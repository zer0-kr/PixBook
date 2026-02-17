/**
 * Produce progressively simplified search queries from a raw title.
 * Returns an array of distinct levels (most specific → most generic).
 */
export function normalizeTitleForSearch(rawTitle: string): string[] {
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
export function normalizeTitleForComparison(title: string): string {
  let t = title;
  t = t.replace(/^\[[^\]]*\]\s*/, "");
  t = t.replace(/\s*\([^)]*\)\s*/g, "");
  t = t.replace(/[:\-–—]/g, " ");
  t = t.toLowerCase();
  t = t.replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g, "");
  return t;
}

/** Split a compound author string by common Korean delimiters. */
export function splitAuthors(author: string): string[] {
  return author
    .split(/[,·、|]/)
    .map((a) => a.replace(/\([^)]*\)/g, "").trim())
    .filter(Boolean);
}

/** Normalize a single author name for comparison. */
export function normalizeAuthor(author: string): string {
  return author
    .replace(/\([^)]*\)/g, "")
    .replace(/[,·、|\s]/g, "")
    .toLowerCase();
}
