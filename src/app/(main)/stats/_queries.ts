import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserBook, ReadingSession } from "@/types";

/**
 * Per-request cached query functions for the stats page.
 * React.cache() deduplicates: multiple Suspense sections calling the same
 * function with the same args share a single DB query per request.
 */

export const getProfile = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").maybeSingle();
  return data as Profile | null;
});

export const getCompletedBooksForYear = cache(
  async (yearStart: string, yearEnd: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("user_books")
      .select("id, end_date, book:books(page_count, category, title)")
      .eq("reading_status", "completed")
      .gte("end_date", yearStart)
      .lte("end_date", yearEnd);

    return (data ?? []).map((row) => ({
      ...row,
      book: row.book ?? undefined,
    })) as unknown as UserBook[];
  }
);

export const getReadingSessionsForYear = cache(
  async (yearStart: string, yearEnd: string) => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reading_sessions")
      .select("*")
      .gte("date", yearStart)
      .lte("date", yearEnd);

    return (data ?? []) as ReadingSession[];
  }
);
