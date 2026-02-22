import { useState, useCallback, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { revalidateLibrary } from "@/lib/actions/revalidate";
import { findOrCreateBook } from "@/lib/aladin/cache";
import type { AladinItem, AladinSearchResponse } from "@/lib/aladin/types";

export function useBookSearch() {
  const [items, setItems] = useState<AladinItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [libraryIsbns, setLibraryIsbns] = useState<Set<string>>(new Set());
  const [addingIsbn, setAddingIsbn] = useState<string | null>(null);
  const { toast } = useToast();
  const searchAbortRef = useRef<AbortController | null>(null);

  // Fetch user's existing library ISBNs on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchLibraryIsbns() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) return;

      const { data } = await supabase
        .from("user_books")
        .select("book:books(isbn13)")
        .eq("user_id", user.id);

      if (data && !cancelled) {
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
    return () => { cancelled = true; };
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    searchAbortRef.current?.abort();

    if (!query) {
      setItems([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    const controller = new AbortController();
    searchAbortRef.current = controller;

    try {
      const params = new URLSearchParams({
        query,
        page: "1",
        maxResults: "20",
      });
      const response = await fetch(`/api/books/search?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data: AladinSearchResponse = await response.json();
      setItems(data.item || []);
      setTotalResults(data.totalResults || 0);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
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
        revalidateLibrary();
      } catch {
        toast("error", "책 추가에 실패했습니다");
      } finally {
        setAddingIsbn(null);
      }
    },
    [toast]
  );

  return {
    items,
    totalResults,
    isLoading,
    hasSearched,
    libraryIsbns,
    addingIsbn,
    handleSearch,
    handleAdd,
  };
}
