import { normalizeTitleForSearch, splitAuthors } from "./normalize";
import { scoreCandidate, type BookRow, type ScoreBreakdown } from "./scoring";
import { searchAladin } from "./api";

const HIGH_CONFIDENCE_THRESHOLD = 70;
const ACCEPT_THRESHOLD = 45;

export { ACCEPT_THRESHOLD };

/** Extract the first author name, or null if unknown. */
function getFirstAuthor(author: string): string | null {
  if (!author || author === "알 수 없음" || author === "unknown") return null;
  const authors = splitAuthors(author);
  return authors[0] || null;
}

export interface SearchResult {
  item: import("./types").AladinItem;
  score: number;
  scoreBreakdown: ScoreBreakdown;
}

export async function findBestMatch(
  book: BookRow,
  timeBudgetExceeded: boolean
): Promise<SearchResult | null> {
  let best: SearchResult | null = null as SearchResult | null;

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
