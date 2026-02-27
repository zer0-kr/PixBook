import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { logError } from "@/lib/logger";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import { getTowerHeight } from "@/lib/tower/rpc";
import { revalidateAllPages } from "@/lib/actions/revalidate";
import {
  generateIsbn,
  mapStatus,
  mapRating,
  isValidDate,
  computeCreatedAt,
  type ImportRowInput,
} from "@/lib/import/helpers";

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
        .map((row, index) => ({
          isbn13: generateIsbn(row.title, row.author),
          title: row.title,
          author: row.author || "알 수 없음",
          publisher: row.publisher || null,
          status: mapStatus(row),
          rating: mapRating(row.rating),
          startDate: isValidDate(row.startDate) ? row.startDate : null,
          endDate: isValidDate(row.endDate) ? row.endDate : null,
          createdAt: row.createdAt,
          rowIndex: index,
        }));

      if (prepared.length === 0) {
        return NextResponse.json({ imported: 0, skipped: 0, errors });
      }

      // Step 2: Bulk insert books (skip existing via ignoreDuplicates)
      const uniqueIsbns = [...new Set(prepared.map((p) => p.isbn13))];
      const booksToInsert = uniqueIsbns.map((isbn) => {
        const p = prepared.find((r) => r.isbn13 === isbn)!;
        return {
          isbn13: p.isbn13,
          title: p.title,
          author: p.author,
          publisher: p.publisher,
          page_count: 200,
        };
      });

      const { error: insertBooksError } = await auth.supabase
        .from("books")
        .upsert(booksToInsert, {
          onConflict: "isbn13",
          ignoreDuplicates: true,
        });

      if (insertBooksError) {
        logError("Import: book insert failed", insertBooksError);
        return NextResponse.json(
          { error: "책 일괄 저장 실패" },
          { status: 500 }
        );
      }

      // Step 2b: Fetch all book IDs by isbn13
      const { data: books, error: booksError } = await auth.supabase
        .from("books")
        .select("id, isbn13")
        .in("isbn13", uniqueIsbns);

      if (booksError || !books) {
        logError("Import: book ID lookup failed", booksError);
        return NextResponse.json(
          { error: "책 ID 조회 실패" },
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

      // Step 4: Bulk insert new user_books only (deduplicate by book_id)
      const baseTime = Date.now();
      const seenBookIds = new Set<string>();
      const newUserBooks = prepared
        .map((p) => {
          const bookId = isbnToBookId.get(p.isbn13);
          if (!bookId) {
            errors.push(`"${p.title}" 책 ID 매칭 실패`);
            return null;
          }
          if (existingBookIds.has(bookId) || seenBookIds.has(bookId))
            return null;
          seenBookIds.add(bookId);
          return {
            user_id: auth.user.id,
            book_id: bookId,
            reading_status: p.status,
            rating: p.rating,
            start_date: p.startDate,
            end_date: p.endDate,
            created_at: computeCreatedAt(p.createdAt, p.rowIndex, baseTime),
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
          .upsert(newUserBooks, {
            onConflict: "user_id,book_id",
            ignoreDuplicates: true,
          });

        if (insertError) {
          logError("Import: user_books insert failed", insertError);
          errors.push("독서 기록 일괄 저장 실패");
        } else {
          imported = newUserBooks.length;
        }
      }

      // Recalculate tower stats and unlock characters
      const towerHeight = await getTowerHeight(auth.supabase, auth.user.id);
      if (towerHeight !== null) {
        await checkAndUnlockCharacters(auth.supabase, auth.user.id, towerHeight);
      }

      revalidateAllPages();

      return NextResponse.json({
        imported,
        skipped,
        errors: errors.slice(0, 10),
      });
    },
    { key: "import", limit: 3, windowSeconds: 300 }
  );
}
