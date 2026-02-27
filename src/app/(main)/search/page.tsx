"use client";

import Header from "@/components/layout/Header";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { useBookSearch } from "@/hooks/useBookSearch";

export default function SearchPage() {
  const {
    items,
    totalResults,
    isLoading,
    hasSearched,
    libraryIsbns,
    libraryLoaded,
    addingIsbn,
    handleSearch,
    handleAdd,
  } = useBookSearch();

  return (
    <>
      <Header title="책 검색" />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        <SearchResults
          items={items}
          totalResults={totalResults}
          isLoading={isLoading}
          libraryIsbns={libraryIsbns}
          libraryLoaded={libraryLoaded}
          addingIsbn={addingIsbn}
          onAdd={handleAdd}
          hasSearched={hasSearched}
        />
      </div>
    </>
  );
}
