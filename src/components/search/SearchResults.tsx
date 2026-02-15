"use client";

import type { AladinItem } from "@/lib/aladin/types";
import SearchResultCard from "./SearchResultCard";

interface SearchResultsProps {
  items: AladinItem[];
  totalResults: number;
  isLoading: boolean;
  libraryIsbns: Set<string>;
  addingIsbn: string | null;
  onAdd: (item: AladinItem) => void;
  hasSearched: boolean;
}

export default function SearchResults({
  items,
  totalResults,
  isLoading,
  libraryIsbns,
  addingIsbn,
  onAdd,
  hasSearched,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="pixel-loading mb-3 text-2xl text-brown">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
        <p className="text-sm text-brown-light">검색 중...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="mb-2 text-4xl">📚</p>
        <p className="text-sm text-brown-light">
          읽고 싶은 책을 검색해보세요!
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="mb-2 text-4xl">🔍</p>
        <p className="text-sm font-bold text-brown">검색 결과가 없습니다</p>
        <p className="mt-1 text-xs text-brown-lighter">
          다른 검색어로 시도해보세요
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs text-brown-lighter">
        총 {totalResults.toLocaleString()}건의 결과
      </p>
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
        {items.map((item) => (
          <SearchResultCard
            key={item.isbn13 || item.itemId}
            item={item}
            isInLibrary={libraryIsbns.has(item.isbn13)}
            isAdding={addingIsbn === item.isbn13}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}
