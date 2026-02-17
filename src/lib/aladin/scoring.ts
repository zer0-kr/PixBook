import { normalizeTitleForComparison, splitAuthors, normalizeAuthor } from "./normalize";
import type { AladinItem } from "./types";

/** Character bigram set for Dice coefficient. */
export function bigrams(s: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
  return set;
}

export function diceCoefficient(a: string, b: string): number {
  const ba = bigrams(a);
  const bb = bigrams(b);
  if (ba.size === 0 && bb.size === 0) return 1;
  if (ba.size === 0 || bb.size === 0) return 0;
  let overlap = 0;
  for (const g of ba) if (bb.has(g)) overlap++;
  return (2 * overlap) / (ba.size + bb.size);
}

export interface BookRow {
  id: string;
  title: string;
  author: string;
  isbn13: string;
  publisher: string | null;
}

export interface ScoreBreakdown {
  author: number;
  title: number;
  publisher: number;
  rank: number;
  total: number;
}

export function scoreCandidate(
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
