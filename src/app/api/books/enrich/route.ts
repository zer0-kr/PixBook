import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@supabase/supabase-js";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { searchAladin, lookupAladin } from "@/lib/aladin/api";
import { logError } from "@/lib/logger";
import type { AladinItem } from "@/lib/aladin/types";

const BATCH_LIMIT = 5;
const HIGH_CONFIDENCE_THRESHOLD = 70;
const ACCEPT_THRESHOLD = 45;

// ---------------------------------------------------------------------------
// Title normalization
// ---------------------------------------------------------------------------

/**
 * Produce progressively simplified search queries from a raw title.
 * Returns an array of distinct levels (most specific → most generic).
 */
function normalizeTitleForSearch(rawTitle: string): string[] {
  const levels: string[] = [];

  // Level 1: strip series brackets, edition/volume parentheses at end
  let l1 = rawTitle.trim();
  l1 = l1.replace(/^\[[^\]]*\]\s*/, "");              // [시리즈명] prefix
  l1 = l1.replace(/\s*\([^)]*(?:판|권|쇄|edition|ed)\)[.\s]*$/i, ""); // (개정판), (102권)
  l1 = l1.replace(/\s+(?:\d+|제?\d+권|Vol\.?\s*\d+)\s*$/i, "");       // trailing 1, 제2권, Vol.3
  l1 = l1.trim();
  if (l1) levels.push(l1);

  // Level 1.5: strip all parenthetical content for cleaner search
  const noParens = l1.replace(/\s*\([^)]*\)\s*/g, "").trim();
  if (noParens && noParens !== l1) levels.push(noParens);

  // Level 2: drop subtitle after : or  -
  const subtitleIdx = Math.min(
    l1.indexOf(":") === -1 ? Infinity : l1.indexOf(":"),
    l1.indexOf(" - ") === -1 ? Infinity : l1.indexOf(" - ")
  );
  if (subtitleIdx !== Infinity) {
    const l2 = l1.slice(0, subtitleIdx).trim();
    if (l2 && l2 !== l1) levels.push(l2);
  }

  // Deduplicate (preserving order)
  return [...new Set(levels)];
}

/**
 * Normalize a title for comparison: strip all noise → lowercase → remove
 * non-alphanumeric (except Korean).
 */
function normalizeTitleForComparison(title: string): string {
  let t = title;
  t = t.replace(/^\[[^\]]*\]\s*/, "");
  t = t.replace(/\s*\([^)]*\)\s*/g, "");
  t = t.replace(/[:\-–—]/g, " ");
  t = t.toLowerCase();
  t = t.replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, "");
  return t;
}

// ---------------------------------------------------------------------------
// Author helpers
// ---------------------------------------------------------------------------

/** Split a compound author string by common Korean delimiters. */
function splitAuthors(author: string): string[] {
  return author
    .split(/[,·、|]/)
    .map((a) => a.replace(/\([^)]*\)/g, "").trim())
    .filter(Boolean);
}

/** Normalize a single author name for comparison. */
function normalizeAuthor(author: string): string {
  return author
    .replace(/\([^)]*\)/g, "")
    .replace(/[,·、|\s]/g, "")
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/** Character bigram set for Dice coefficient. */
function bigrams(s: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
  return set;
}

function diceCoefficient(a: string, b: string): number {
  const ba = bigrams(a);
  const bb = bigrams(b);
  if (ba.size === 0 && bb.size === 0) return 1;
  if (ba.size === 0 || bb.size === 0) return 0;
  let overlap = 0;
  for (const g of ba) if (bb.has(g)) overlap++;
  return (2 * overlap) / (ba.size + bb.size);
}

interface BookRow {
  id: string;
  title: string;
  author: string;
  isbn13: string;
  publisher: string | null;
}

interface ScoreBreakdown {
  author: number;
  title: number;
  publisher: number;
  rank: number;
  total: number;
}

function scoreCandidate(
  book: BookRow,
  item: AladinItem,
  rank: number
): ScoreBreakdown {
  let authorScore = 0;
  let titleScore = 0;
  let publisherScore = 0;
  let rankScore = 0;

  // --- Author (40 pts) ---
  const csvAuthor = book.author;
  const aladinAuthor = item.author ?? "";

  if (!csvAuthor || csvAuthor === "알 수 없음" || csvAuthor === "unknown") {
    authorScore = 15;
  } else {
    const normCsv = normalizeAuthor(csvAuthor);
    const normAladin = normalizeAuthor(aladinAuthor);

    if (normAladin.includes(normCsv) || normCsv.includes(normAladin)) {
      authorScore = 40;
    } else {
      const csvAuthors = splitAuthors(csvAuthor);
      const aladinAuthors = splitAuthors(aladinAuthor);
      const anyMatch = csvAuthors.some((ca) => {
        const nca = normalizeAuthor(ca);
        return aladinAuthors.some((aa) => {
          const naa = normalizeAuthor(aa);
          return naa.includes(nca) || nca.includes(naa);
        });
      });

      if (anyMatch) {
        authorScore = 35;
      } else {
        const overlap = diceCoefficient(normCsv, normAladin);
        if (overlap > 0.6) authorScore = 20;
      }
    }
  }

  // --- Title (35 pts) ---
  const normBookTitle = normalizeTitleForComparison(book.title);
  const normItemTitle = normalizeTitleForComparison(item.title ?? "");

  if (normBookTitle === normItemTitle) {
    titleScore = 35;
  } else if (
    normBookTitle &&
    normItemTitle &&
    (normItemTitle.includes(normBookTitle) || normBookTitle.includes(normItemTitle))
  ) {
    const ratio =
      Math.min(normBookTitle.length, normItemTitle.length) /
      Math.max(normBookTitle.length, normItemTitle.length);
    titleScore = Math.round(ratio * 35);
  } else if (normBookTitle && normItemTitle) {
    titleScore = Math.round(diceCoefficient(normBookTitle, normItemTitle) * 35);
  }

  // --- Publisher (15 pts) ---
  if (book.publisher && item.publisher) {
    const normBookPub = book.publisher.replace(/[^a-z0-9가-힣]/gi, "").toLowerCase();
    const normItemPub = item.publisher.replace(/[^a-z0-9가-힣]/gi, "").toLowerCase();
    if (normBookPub === normItemPub) {
      publisherScore = 15;
    } else if (normItemPub.includes(normBookPub) || normBookPub.includes(normItemPub)) {
      publisherScore = 12;
    }
  }

  // --- Search rank (10 pts) ---
  if (rank === 0) rankScore = 10;
  else if (rank === 1) rankScore = 8;
  else if (rank === 2) rankScore = 6;
  else if (rank === 3) rankScore = 4;
  else rankScore = 2;

  return {
    author: authorScore,
    title: titleScore,
    publisher: publisherScore,
    rank: rankScore,
    total: authorScore + titleScore + publisherScore + rankScore,
  };
}

/** Extract the first author name, or null if unknown. */
function getFirstAuthor(author: string): string | null {
  if (!author || author === "알 수 없음" || author === "unknown") return null;
  const authors = splitAuthors(author);
  return authors[0] || null;
}

// ---------------------------------------------------------------------------
// Multi-strategy search
// ---------------------------------------------------------------------------

interface SearchResult {
  item: AladinItem;
  score: number;
  scoreBreakdown: ScoreBreakdown;
}

async function findBestMatch(
  book: BookRow,
  timeBudgetExceeded: boolean
): Promise<SearchResult | null> {
  let best: SearchResult | null = null;

  const titleLevels = normalizeTitleForSearch(book.title);
  const level1 = titleLevels[0] ?? book.title;
  const level2 = titleLevels[1]; // may be undefined
  const firstAuthor = getFirstAuthor(book.author);

  // Short title for combined search: use level2 (main title without subtitle) or level1
  const shortTitle = level2 || level1;

  // Build strategy list
  const strategies: Array<{
    queryType: "Title" | "Keyword";
    query: string;
    maxResults: number;
    lastResort?: boolean;
  }> = [
    // Strategy 1: normalized title search
    { queryType: "Title", query: level1, maxResults: 20 },
  ];

  if (!timeBudgetExceeded) {
    // Strategy 2 (NEW): combined short title + first author keyword search
    if (firstAuthor) {
      strategies.push({
        queryType: "Keyword",
        query: `${shortTitle} ${firstAuthor}`,
        maxResults: 20,
      });
    }
    // Strategy 3: simplified title keyword search (subtitle removed)
    if (level2) {
      strategies.push({ queryType: "Keyword", query: level2, maxResults: 20 });
    }
    // Strategy 4: original title if different from level1
    if (book.title.trim() !== level1) {
      strategies.push({ queryType: "Title", query: book.title.trim(), maxResults: 10 });
    }
    // Strategy 5 (NEW): author name only — last resort
    if (firstAuthor) {
      strategies.push({
        queryType: "Keyword",
        query: firstAuthor,
        maxResults: 10,
        lastResort: true,
      });
    }
  }

  for (const strategy of strategies) {
    // Strategy 5 only runs if we still have no acceptable match
    if (strategy.lastResort && best && best.score >= ACCEPT_THRESHOLD) continue;

    const items = await searchAladin(strategy.query, {
      maxResults: strategy.maxResults,
      queryType: strategy.queryType,
    });

    for (let i = 0; i < items.length; i++) {
      const breakdown = scoreCandidate(book, items[i], i);
      if (!best || breakdown.total > best.score) {
        best = { item: items[i], score: breakdown.total, scoreBreakdown: breakdown };
      }
      // Early exit on high confidence
      if (breakdown.total >= HIGH_CONFIDENCE_THRESHOLD) return best;
    }

    // If we already have an acceptable match, no need to try further strategies
    if (best && best.score >= ACCEPT_THRESHOLD) break;
  }

  return best;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

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
