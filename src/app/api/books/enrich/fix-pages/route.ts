import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { lookupAladin } from "@/lib/aladin/api";
import { logError } from "@/lib/logger";

export const maxDuration = 30;

const BATCH_LIMIT = 20;

export async function POST() {
  return withAuthAndRateLimit(
    async ({ user, supabase }) => {
      // Find user's books with page_count=200 and a real ISBN13 (already enriched)
      const { data: userBooks, error: ubError } = await supabase
        .from("user_books")
        .select("book_id, book:books(id, isbn13, page_count)")
        .eq("user_id", user.id);

      if (ubError) {
        logError("fix-pages: user_books query error:", ubError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      type BookRow = { id: string; isbn13: string; page_count: number };
      const candidates = (userBooks ?? [])
        .map((ub) => {
          const book = ub.book;
          return (Array.isArray(book) ? book[0] : book) as BookRow | null;
        })
        .filter(
          (book): book is BookRow =>
            book !== null &&
            book.page_count === 200 &&
            /^\d{13}$/.test(book.isbn13)
        );

      if (candidates.length === 0) {
        return NextResponse.json({ fixed: 0, message: "No books to fix" });
      }

      const batch = candidates.slice(0, BATCH_LIMIT);

      const serviceClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      let fixed = 0;
      const results: Array<{
        bookId: string;
        isbn13: string;
        oldPageCount: number;
        newPageCount: number | null;
      }> = [];

      for (const book of batch) {
        try {
          const item = await lookupAladin(book.isbn13);
          const realPageCount = item?.subInfo?.itemPage;

          if (realPageCount && realPageCount !== 200) {
            await serviceClient
              .from("books")
              .update({ page_count: realPageCount })
              .eq("id", book.id);

            fixed++;
            results.push({
              bookId: book.id,
              isbn13: book.isbn13,
              oldPageCount: 200,
              newPageCount: realPageCount,
            });
          }
        } catch (error) {
          logError(`fix-pages: error processing book ${book.id}:`, error);
        }
      }

      // Recalculate tower height after fixing page counts
      if (fixed > 0) {
        const { error: rpcError } = await serviceClient.rpc(
          "recalculate_tower_height",
          { p_user_id: user.id }
        );
        if (rpcError) {
          logError("fix-pages: recalculate_tower_height error:", rpcError);
        }
      }

      return NextResponse.json({
        fixed,
        total: candidates.length,
        remaining: Math.max(0, candidates.length - BATCH_LIMIT),
        results,
      });
    },
    { key: "fix-pages", limit: 5, windowSeconds: 300 }
  );
}
