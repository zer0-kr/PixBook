"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import type { UserBook, ReadingStatus } from "@/types";
import BookCard from "./BookCard";
import EmptyLibrary from "./EmptyLibrary";

type TabKey = "all" | ReadingStatus;
type SortKey = "newest" | "recent_read" | "title" | "author" | "rating";
type ViewMode = "grid" | "list" | "cover";

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "all", label: "전체" },
  { key: "completed", label: "완독" },
  { key: "reading", label: "읽는중" },
  { key: "want_to_read", label: "읽고싶은" },
  { key: "dropped", label: "중단" },
];

const DEFAULT_SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "등록순" },
  { key: "title", label: "제목" },
  { key: "author", label: "저자" },
];

const COMPLETED_SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "recent_read", label: "최근 읽은순" },
  { key: "title", label: "제목" },
  { key: "author", label: "저자" },
  { key: "rating", label: "평점" },
];

const PAGE_SIZE = 20;

interface LibraryViewProps {
  userBooks: UserBook[];
}

export default function LibraryView({ userBooks }: LibraryViewProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTab = (searchParams.get("tab") as TabKey) || "all";

  const setActiveTab = (tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    window.history.replaceState(null, "", `${pathname}${qs ? `?${qs}` : ""}`);
  };

  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const sortOptions = activeTab === "completed" ? COMPLETED_SORT_OPTIONS : DEFAULT_SORT_OPTIONS;

  const effectiveSortBy = sortOptions.some((o) => o.key === sortBy)
    ? sortBy
    : sortOptions[0].key;

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
    switch (effectiveSortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "recent_read":
        sorted.sort(
          (a, b) =>
            new Date(b.end_date ?? "").getTime() - new Date(a.end_date ?? "").getTime()
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
  }, [filteredBooks, effectiveSortBy]);

  // Progressive rendering
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset display count on tab change
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [activeTab]);

  const displayedBooks = sortedBooks.slice(0, displayCount);
  const hasMore = displayCount < sortedBooks.length;

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => prev + PAGE_SIZE);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  if (userBooks.length === 0) {
    return <EmptyLibrary />;
  }

  return (
    <div className="px-4 py-4">
      {/* Tabs */}
      <div className="flex gap-1 mb-4" role="tablist" aria-label="독서 상태 필터">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pixel-btn flex-1 min-w-0 px-1 py-1.5 text-xs font-bold transition-colors text-center ${
              activeTab === tab.key
                ? "bg-pixel-blue text-white"
                : "bg-cream-dark text-brown hover:bg-cream-dark/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort + Count header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-brown-lighter">
          {sortedBooks.length}권
        </p>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex gap-0.5">
            {([
              { mode: "grid" as ViewMode, label: "그리드 뷰", icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
                  <rect x="1" y="1" width="4" height="4" /><rect x="6" y="1" width="4" height="4" /><rect x="11" y="1" width="4" height="4" />
                  <rect x="1" y="6" width="4" height="4" /><rect x="6" y="6" width="4" height="4" /><rect x="11" y="6" width="4" height="4" />
                  <rect x="1" y="11" width="4" height="4" /><rect x="6" y="11" width="4" height="4" /><rect x="11" y="11" width="4" height="4" />
                </svg>
              )},
              { mode: "list" as ViewMode, label: "리스트 뷰", icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
                  <rect x="1" y="2" width="14" height="3" />
                  <rect x="1" y="7" width="14" height="3" />
                  <rect x="1" y="12" width="14" height="3" />
                </svg>
              )},
              { mode: "cover" as ViewMode, label: "커버 뷰", icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
                  <rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" />
                  <rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" />
                </svg>
              )},
            ]).map(({ mode, label, icon }) => (
              <button
                key={mode}
                aria-label={label}
                onClick={() => setViewMode(mode)}
                className={`pixel-btn p-1.5 transition-colors ${
                  viewMode === mode
                    ? "bg-pixel-blue text-white"
                    : "bg-cream-dark text-brown hover:bg-cream-dark/80"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
          <select
            value={effectiveSortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="pixel-input px-2 py-1 text-xs text-brown bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Book grid */}
      {sortedBooks.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-brown-lighter">
            해당 상태의 책이 없습니다.
          </p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="flex flex-col gap-2">
              {displayedBooks.map((userBook) => (
                <BookCard key={userBook.id} userBook={userBook} viewMode="list" />
              ))}
            </div>
          ) : (
            <div className={
              viewMode === "cover"
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
                : "grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4"
            }>
              {displayedBooks.map((userBook) => (
                <BookCard key={userBook.id} userBook={userBook} viewMode={viewMode} />
              ))}
            </div>
          )}
          {hasMore && <div ref={sentinelRef} className="h-1" />}
        </>
      )}
    </div>
  );
}
