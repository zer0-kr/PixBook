"use client";

import type { UserBook } from "@/types";
import { calculateBookHeight, cmToPixels } from "@/lib/tower/calculator";
import BookSpine from "./BookSpine";

/** Stable palette for books that have no custom spine_color. */
const DEFAULT_SPINE_COLORS = [
  "#E74C3C",
  "#3498DB",
  "#2ECC71",
  "#9B59B6",
  "#E67E22",
  "#1ABC9C",
  "#F1C40F",
  "#FF6B9D",
  "#8B9DC3",
  "#D35400",
];

interface BookTowerProps {
  completedBooks: UserBook[];
  zoom: number;
}

/**
 * Stack of BookSpine components, bottom-to-top (oldest at bottom, newest at top).
 * Uses column-reverse so the first rendered element sits at the bottom.
 */
export default function BookTower({ completedBooks, zoom }: BookTowerProps) {
  if (completedBooks.length === 0) {
    return (
      <div className="flex h-32 items-end justify-center">
        <p className="text-center text-xs text-brown-lighter">
          완료한 책이 없어요.<br />
          책을 읽고 탑을 쌓아보세요!
        </p>
      </div>
    );
  }

  // Oldest first → appears at bottom of column-reverse container.
  const sorted = [...completedBooks].sort(
    (a, b) => new Date(a.end_date ?? a.created_at).getTime() - new Date(b.end_date ?? b.created_at).getTime(),
  );

  return (
    <div className="flex flex-col-reverse items-center">
      {sorted.map((ub, idx) => {
        const book = ub.book;
        if (!book) return null;

        const heightCm = calculateBookHeight(book.page_count);
        const heightPx = cmToPixels(heightCm, zoom);
        const color =
          ub.spine_color || DEFAULT_SPINE_COLORS[idx % DEFAULT_SPINE_COLORS.length];

        return (
          <BookSpine
            key={ub.id}
            book={book}
            spineColor={color}
            heightPx={heightPx}
          />
        );
      })}
    </div>
  );
}
