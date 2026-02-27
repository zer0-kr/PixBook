import type { SupabaseClient } from "@supabase/supabase-js";
import type { AladinItem, AladinSearchResponse } from "./types";
import type { Book } from "@/types";

/**
 * Convert an Aladin API item to a book table row format.
 */
export function aladinItemToBook(item: AladinItem): Omit<Book, "id" | "created_at"> {
  return {
    isbn13: item.isbn13,
    title: item.title,
    author: item.author,
    publisher: item.publisher,
    pub_date: item.pubDate || null,
    cover_url: item.cover || null,
    page_count: item.subInfo?.itemPage ?? 200,
    category: item.categoryName || null,
    description: item.description || null,
    aladin_link: item.link || null,
  };
}

/**
 * Look up a book in the local DB by isbn13.
 * If not found, fetch details from the Aladin API and insert into the books table.
 */
export async function findOrCreateBook(
  supabase: SupabaseClient,
  isbn13: string
): Promise<Book> {
  // First, check if book already exists in DB
  const { data: existing, error: selectError } = await supabase
    .from("books")
    .select("*")
    .eq("isbn13", isbn13)
    .maybeSingle();

  if (existing && !selectError) {
    return existing as Book;
  }

  // Book not found in DB — fetch from Aladin API
  const response = await fetch(`/api/books/${isbn13}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch book details for ISBN ${isbn13}`);
  }

  const data: AladinSearchResponse = await response.json();

  if (!data.item || data.item.length === 0) {
    throw new Error(`No book found for ISBN ${isbn13}`);
  }

  const bookData = aladinItemToBook(data.item[0]);

  // Insert the book into the database
  const { data: inserted, error: insertError } = await supabase
    .from("books")
    .insert(bookData)
    .select()
    .single();

  if (insertError) {
    // Handle race condition: another request may have inserted the book
    if (insertError.code === "23505") {
      // unique_violation
      const { data: retry, error: retryError } = await supabase
        .from("books")
        .select("*")
        .eq("isbn13", isbn13)
        .single();

      if (retryError || !retry) {
        throw new Error(`Failed to retrieve book after conflict: ${retryError?.message}`);
      }

      return retry as Book;
    }

    throw new Error(`Failed to insert book: ${insertError.message}`);
  }

  return inserted as Book;
}
