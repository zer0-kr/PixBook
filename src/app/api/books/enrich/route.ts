import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { searchAladin } from "@/lib/aladin/api";
import { logError } from "@/lib/logger";

const BATCH_LIMIT = 5;

/**
 * Normalize an author string for fuzzy matching:
 * - Remove parenthesized role annotations like (지은이), (옮긴이), (엮은이)
 * - Remove whitespace, commas
 * - Lowercase for latin characters
 */
function normalizeAuthor(author: string): string {
  return author
    .replace(/\([^)]*\)/g, "") // strip (지은이) etc.
    .replace(/[,\s]/g, "")
    .toLowerCase();
}

/**
 * Check if the CSV author matches any of the Aladin result authors.
 * Uses substring inclusion after normalization.
 */
function authorsMatch(csvAuthor: string, aladinAuthor: string): boolean {
  const normCsv = normalizeAuthor(csvAuthor);
  const normAladin = normalizeAuthor(aladinAuthor);

  // Either the CSV author appears in the Aladin author string or vice versa
  return normAladin.includes(normCsv) || normCsv.includes(normAladin);
}

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

      // Fetch book details using service client
      const { data: books, error: booksError } = await serviceClient
        .from("books")
        .select("id, title, author, isbn13")
        .in("id", validIds);

      if (booksError || !books) {
        logError("Enrich: books query error:", booksError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const results: Array<{ bookId: string; status: string; title?: string }> = [];
      let enriched = 0;
      let failed = 0;

      for (const book of books) {
        try {
          const items = await searchAladin(book.title, { maxResults: 5 });

          if (items.length === 0) {
            // No results — mark as ENR- to avoid re-processing
            await serviceClient
              .from("books")
              .update({ isbn13: book.isbn13.replace(/^IMP-/, "ENR-") })
              .eq("id", book.id);
            failed++;
            results.push({ bookId: book.id, status: "no_results", title: book.title });
            continue;
          }

          // Find a matching item by author
          const matched = items.find((item) => authorsMatch(book.author, item.author));

          if (!matched) {
            // Author mismatch — mark as ENR-
            await serviceClient
              .from("books")
              .update({ isbn13: book.isbn13.replace(/^IMP-/, "ENR-") })
              .eq("id", book.id);
            failed++;
            results.push({ bookId: book.id, status: "no_match", title: book.title });
            continue;
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
            page_count: matched.subInfo?.itemPage ?? 200,
            pub_date: matched.pubDate || null,
            aladin_link: matched.link || null,
            publisher: matched.publisher || book.author,
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
          results.push({ bookId: book.id, status: "enriched", title: book.title });
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
