"use client";

import { useState, useMemo } from "react";
import type { UserBook, ReadingStatus } from "@/types";
import BookCard from "./BookCard";
import EmptyLibrary from "./EmptyLibrary";

type TabKey = "all" | ReadingStatus;
type SortKey = "newest" | "title" | "author" | "rating";

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "all", label: "전체" },
  { key: "want_to_read", label: "읽고싶은" },
  { key: "reading", label: "읽는중" },
  { key: "completed", label: "완독" },
  { key: "dropped", label: "중단" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "최신추가" },
  { key: "title", label: "제목" },
  { key: "author", label: "저자" },
  { key: "rating", label: "평점" },
];

interface LibraryViewProps {
  userBooks: UserBook[];
}

export default function LibraryView({ userBooks }: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  // Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = {
      all: userBooks.length,
      want_to_read: 0,
      reading: 0,
      completed: 0,
      dropped: 0,
    };
    for (const ub of userBooks) {
      counts[ub.reading_status]++;
    }
    return counts;
  }, [userBooks]);

  // Filter by tab
  const filteredBooks = useMemo(() => {
    if (activeTab === "all") return userBooks;
    return userBooks.filter((ub) => ub.reading_status === activeTab);
  }, [userBooks, activeTab]);

  // Sort
  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];
    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "title":
        sorted.sort((a, b) =>
          (a.book?.title ?? "").localeCompare(b.book?.title ?? "", "ko")
        );
        break;
      case "author":
        sorted.sort((a, b) =>
          (a.book?.author ?? "").localeCompare(b.book?.author ?? "", "ko")
        );
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }
    return sorted;
  }, [filteredBooks, sortBy]);

  if (userBooks.length === 0) {
    return <EmptyLibrary />;
  }

  return (
    <div className="px-4 py-4">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-none" role="tablist" aria-label="독서 상태 필터">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pixel-btn whitespace-nowrap px-3 py-1.5 text-xs font-bold transition-colors ${
              activeTab === tab.key
                ? "bg-pixel-blue text-white"
                : "bg-cream-dark text-brown hover:bg-cream-dark/80"
            }`}
          >
            {tab.label} ({tabCounts[tab.key]})
          </button>
        ))}
      </div>

      {/* Sort + Count header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-brown-lighter">
          {sortedBooks.length}권
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="pixel-input px-2 py-1 text-xs text-brown bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Book grid */}
      {sortedBooks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-brown-lighter">
            해당 상태의 책이 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedBooks.map((userBook) => (
            <BookCard key={userBook.id} userBook={userBook} />
          ))}
        </div>
      )}
    </div>
  );
}
