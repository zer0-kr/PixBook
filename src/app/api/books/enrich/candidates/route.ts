import { NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { logError } from "@/lib/logger";

export async function GET() {
  return withAuthAndRateLimit(
    async ({ user, supabase }) => {
      const { data, error } = await supabase
        .from("user_books")
        .select("book_id, book:books(id, title, author, isbn13, cover_url)")
        .eq("user_id", user.id);

      if (error) {
        logError("Enrich candidates query error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      // Filter in JS: isbn13 starts with IMP- and cover_url is null
      type BookRow = { id: string; title: string; author: string; isbn13: string; cover_url: string | null };
      const candidates = (data ?? [])
        .map((ub) => {
          const book = ub.book;
          // Supabase join may return array or object depending on relation
          return (Array.isArray(book) ? book[0] : book) as BookRow | null;
        })
        .filter(
          (book): book is BookRow =>
            book !== null &&
            (book.isbn13.startsWith("IMP-") || book.isbn13.startsWith("ENR-")) &&
            book.cover_url === null
        )
        .map(({ id, title, author }) => ({ id, title, author }));

      return NextResponse.json({ candidates, total: candidates.length });
    },
    { key: "enrich-candidates", limit: 30, windowSeconds: 60 }
  );
}
