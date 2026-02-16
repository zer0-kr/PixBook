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

export const maxDuration = 30;

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

      const errors: string[] = [];

      // Step 1: Prepare all rows in JS (no DB calls)
      const prepared = rows
        .filter((r) => {
          if (!r.title) {
            errors.push("제목 없는 행 건너뜀");
            return false;
          }
          return true;
        })
        .map((row) => ({
          isbn13: generateIsbn(row.title, row.author),
          title: row.title,
          author: row.author || "알 수 없음",
          publisher: row.publisher || null,
          status: mapStatus(row),
          rating: mapRating(row.rating),
          startDate: isValidDate(row.startDate) ? row.startDate : null,
          endDate: isValidDate(row.endDate) ? row.endDate : null,
        }));

      if (prepared.length === 0) {
        return NextResponse.json({ imported: 0, skipped: 0, errors });
      }

      // Step 2: Bulk upsert all books + retrieve IDs
      const { data: books, error: booksError } = await auth.supabase
        .from("books")
        .upsert(
          prepared.map((p) => ({
            isbn13: p.isbn13,
            title: p.title,
            author: p.author,
            publisher: p.publisher,
            page_count: 200,
          })),
          { onConflict: "isbn13" }
        )
        .select("id, isbn13");

      if (booksError || !books) {
        return NextResponse.json(
          { error: "책 일괄 저장 실패", detail: booksError?.message },
          { status: 500 }
        );
      }

      const isbnToBookId = new Map(books.map((b) => [b.isbn13, b.id]));

      // Step 3: Bulk check existing user_books
      const { data: existingUbs } = await auth.supabase
        .from("user_books")
        .select("book_id")
        .eq("user_id", auth.user.id);

      const existingBookIds = new Set(
        existingUbs?.map((ub) => ub.book_id) ?? []
      );

      // Step 4: Bulk insert new user_books only
      const newUserBooks = prepared
        .map((p) => {
          const bookId = isbnToBookId.get(p.isbn13);
          if (!bookId) {
            errors.push(`"${p.title}" 책 ID 매칭 실패`);
            return null;
          }
          if (existingBookIds.has(bookId)) return null;
          return {
            user_id: auth.user.id,
            book_id: bookId,
            reading_status: p.status,
            rating: p.rating,
            start_date: p.startDate,
            end_date: p.endDate,
          };
        })
        .filter(
          (ub): ub is NonNullable<typeof ub> => ub !== null
        );

      const skipped = prepared.length - newUserBooks.length - errors.length;

      let imported = 0;
      if (newUserBooks.length > 0) {
        const { error: insertError } = await auth.supabase
          .from("user_books")
          .insert(newUserBooks);

        if (insertError) {
          errors.push(`독서 기록 일괄 저장 실패: ${insertError.message}`);
        } else {
          imported = newUserBooks.length;
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
