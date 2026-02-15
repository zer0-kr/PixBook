"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { findOrCreateBook } from "@/lib/aladin/cache";
import type { AladinItem, AladinSearchResponse } from "@/lib/aladin/types";

export default function SearchPage() {
  const [items, setItems] = useState<AladinItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [libraryIsbns, setLibraryIsbns] = useState<Set<string>>(new Set());
  const [addingIsbn, setAddingIsbn] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user's existing library ISBNs on mount
  useEffect(() => {
    async function fetchLibraryIsbns() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("user_books")
        .select("book:books(isbn13)")
        .eq("user_id", user.id);

      if (data) {
        const isbns = new Set<string>();
        for (const row of data) {
          // row.book can be an object or array depending on the join
          const book = row.book as unknown;
          if (book && typeof book === "object" && "isbn13" in book) {
            isbns.add((book as { isbn13: string }).isbn13);
          }
        }
        setLibraryIsbns(isbns);
      }
    }

    fetchLibraryIsbns();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setItems([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        query,
        page: "1",
        maxResults: "20",
      });
      const response = await fetch(`/api/books/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data: AladinSearchResponse = await response.json();
      setItems(data.item || []);
      setTotalResults(data.totalResults || 0);
    } catch {
      toast("error", "검색 중 오류가 발생했습니다");
      setItems([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleAdd = useCallback(
    async (item: AladinItem) => {
      setAddingIsbn(item.isbn13);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast("error", "로그인이 필요합니다");
          return;
        }

        // Find or create the book in the DB
        const book = await findOrCreateBook(supabase, item.isbn13);

        // Check if already in user's library
        const { data: existing } = await supabase
          .from("user_books")
          .select("id")
          .eq("user_id", user.id)
          .eq("book_id", book.id)
          .single();

        if (existing) {
          toast("info", "이미 서재에 있습니다");
          setLibraryIsbns((prev) => new Set(prev).add(item.isbn13));
          return;
        }

        // Add to user's library with 'want_to_read' status
        const { error } = await supabase.from("user_books").insert({
          user_id: user.id,
          book_id: book.id,
          reading_status: "want_to_read",
        });

        if (error) {
          throw error;
        }

        setLibraryIsbns((prev) => new Set(prev).add(item.isbn13));
        toast("success", "서재에 추가되었습니다!");
      } catch {
        toast("error", "책 추가에 실패했습니다");
      } finally {
        setAddingIsbn(null);
      }
    },
    [toast]
  );

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
          addingIsbn={addingIsbn}
          onAdd={handleAdd}
          hasSearched={hasSearched}
        />
      </div>
    </>
  );
}
