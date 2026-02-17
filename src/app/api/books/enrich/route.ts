import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { lookupAladin } from "@/lib/aladin/api";
import { logError } from "@/lib/logger";
import { findBestMatch, ACCEPT_THRESHOLD } from "@/lib/aladin/match";
import type { ScoreBreakdown, BookRow } from "@/lib/aladin/scoring";

const BATCH_LIMIT = 5;

export async function POST(request: NextRequest) {
  return withAuthAndRateLimit(
    async ({ user, supabase }) => {
      const body = await request.json();
      const bookIds: string[] = body.bookIds;

      if (!Array.isArray(bookIds) || bookIds.length === 0 || bookIds.length > BATCH_LIMIT) {
        return NextResponse.json(
          { error: `bookIds must be an array of 1-${BATCH_LIMIT} items` },
          { status: 400 }
        );
      }

      // Verify all books belong to current user via user_books
      const { data: userBooks, error: ubError } = await supabase
        .from("user_books")
        .select("book_id")
        .eq("user_id", user.id)
        .in("book_id", bookIds);

      if (ubError) {
        logError("Enrich: user_books query error:", ubError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const ownedBookIds = new Set((userBooks ?? []).map((ub) => ub.book_id));
      const validIds = bookIds.filter((id) => ownedBookIds.has(id));

      if (validIds.length === 0) {
        return NextResponse.json(
          { error: "No valid books found" },
          { status: 404 }
        );
      }

      // Service role client to bypass RLS for UPDATE
      const serviceClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Fetch book details — now includes publisher
      const { data: books, error: booksError } = await serviceClient
        .from("books")
        .select("id, title, author, isbn13, publisher")
        .in("id", validIds);

      if (booksError || !books) {
        logError("Enrich: books query error:", booksError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const results: Array<{
        bookId: string;
        status: string;
        title?: string;
        score?: number;
        scoreBreakdown?: ScoreBreakdown;
      }> = [];
      let enriched = 0;
      let failed = 0;
      const batchStart = Date.now();

      for (const book of books as BookRow[]) {
        try {
          const timeBudgetExceeded = Date.now() - batchStart > 20_000;
          const match = await findBestMatch(book, timeBudgetExceeded);

          if (!match || match.score < ACCEPT_THRESHOLD) {
            // No acceptable match — mark as ENR-
            const newIsbn = book.isbn13.replace(/^(IMP-|ENR-)/, "ENR-");
            await serviceClient
              .from("books")
              .update({ isbn13: newIsbn })
              .eq("id", book.id);
            failed++;
            results.push({
              bookId: book.id,
              status: match ? "low_score" : "no_results",
              title: book.title,
              score: match?.score,
              scoreBreakdown: match?.scoreBreakdown,
            });
            continue;
          }

          const matched = match.item;

          // ItemSearch may not return subInfo.itemPage — fall back to ItemLookUp
          let pageCount = matched.subInfo?.itemPage;
          if (!pageCount && matched.isbn13 && !timeBudgetExceeded) {
            const lookedUp = await lookupAladin(matched.isbn13);
            if (lookedUp?.subInfo?.itemPage) {
              pageCount = lookedUp.subInfo.itemPage;
            }
          }

          // Check if a book with the real ISBN already exists
          const realIsbn = matched.isbn13;
          const { data: existing } = await serviceClient
            .from("books")
            .select("id")
            .eq("isbn13", realIsbn)
            .single();

          const updateData: Record<string, unknown> = {
            cover_url: matched.cover || null,
            description: matched.description || null,
            category: matched.categoryName || null,
            page_count: pageCount ?? 200,
            pub_date: matched.pubDate || null,
            aladin_link: matched.link || null,
            publisher: matched.publisher || book.publisher || book.author,
          };

          // Only update isbn13 if no conflict with existing book
          if (!existing) {
            updateData.isbn13 = realIsbn;
          }

          await serviceClient
            .from("books")
            .update(updateData)
            .eq("id", book.id);

          enriched++;
          results.push({
            bookId: book.id,
            status: "enriched",
            title: book.title,
            score: match.score,
          });
        } catch (error) {
          logError(`Enrich: error processing book ${book.id}:`, error);
          failed++;
          results.push({ bookId: book.id, status: "error", title: book.title });
        }
      }

      return NextResponse.json({ enriched, failed, results });
    },
    { key: "enrich", limit: 60, windowSeconds: 300 }
  );
}
