import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import type { ReadingStatus } from "@/types";

interface ImportRowInput {
  title: string;
  author: string;
  publisher: string;
  status: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  droppedDate: string;
  rating: number;
}

const STATUS_MAP: Record<string, ReadingStatus> = {
  "읽은 책": "completed",
  "읽고 싶은 책": "want_to_read",
  "읽고 있는 책": "reading",
};

function generateIsbn(title: string, author: string): string {
  const hash = createHash("sha256")
    .update(`${title}|${author}`)
    .digest("hex")
    .slice(0, 10);
  return `IMP-${hash}`;
}

function mapStatus(row: ImportRowInput): ReadingStatus {
  if (row.droppedDate) return "dropped";
  return STATUS_MAP[row.status] ?? "want_to_read";
}

function mapRating(rating: number): number | null {
  if (!rating || rating <= 0) return null;
  // 0.5 단위로 반올림
  const rounded = Math.round(rating * 2) / 2;
  return Math.max(0.5, Math.min(5, rounded));
}

function isValidDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d);
}

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    async (auth) => {
      let body: { rows: ImportRowInput[] };
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 }
        );
      }

      const { rows } = body;
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: "No rows to import" },
          { status: 400 }
        );
      }
      if (rows.length > 500) {
        return NextResponse.json(
          { error: "Maximum 500 rows allowed" },
          { status: 400 }
        );
      }

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const row of rows) {
        if (!row.title) {
          errors.push("제목 없는 행 건너뜀");
          continue;
        }

        try {
          const isbn13 = generateIsbn(row.title, row.author);

          // Upsert book
          const { data: book, error: bookError } = await auth.supabase
            .from("books")
            .upsert(
              {
                isbn13,
                title: row.title,
                author: row.author || "알 수 없음",
                publisher: row.publisher || null,
                page_count: 200,
              },
              { onConflict: "isbn13" }
            )
            .select("id")
            .single();

          if (bookError || !book) {
            errors.push(`"${row.title}" 책 저장 실패`);
            continue;
          }

          // Check if user already has this book
          const { data: existing } = await auth.supabase
            .from("user_books")
            .select("id")
            .eq("user_id", auth.user.id)
            .eq("book_id", book.id)
            .single();

          if (existing) {
            skipped++;
            continue;
          }

          // Insert user_book
          const readingStatus = mapStatus(row);
          const rating = mapRating(row.rating);
          const startDate = isValidDate(row.startDate)
            ? row.startDate
            : null;
          const endDate = isValidDate(row.endDate) ? row.endDate : null;

          const { error: ubError } = await auth.supabase
            .from("user_books")
            .insert({
              user_id: auth.user.id,
              book_id: book.id,
              reading_status: readingStatus,
              rating,
              start_date: startDate,
              end_date: endDate,
            });

          if (ubError) {
            errors.push(`"${row.title}" 독서 기록 저장 실패`);
            continue;
          }

          imported++;
        } catch {
          errors.push(`"${row.title}" 처리 중 오류`);
        }
      }

      // Recalculate tower stats
      await auth.supabase.rpc("recalculate_tower_height", {
        p_user_id: auth.user.id,
      });

      return NextResponse.json({
        imported,
        skipped,
        errors: errors.slice(0, 10),
      });
    },
    { key: "import", limit: 3, windowSeconds: 300 }
  );
}
