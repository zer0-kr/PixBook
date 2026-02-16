import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { logError } from "@/lib/logger";
import { Header } from "@/components/layout";
import { LibraryView } from "@/components/library";
import type { UserBook } from "@/types";

export default async function LibraryPage() {
  const supabase = await createClient();

  const [user, { data, error }] = await Promise.all([
    getUser(),
    supabase
      .from("user_books")
      .select(`
        id, reading_status, rating, one_line_review,
        start_date, end_date, created_at,
        book:books(id, title, author, publisher, cover_url, page_count, category)
      `)
      .order("created_at", { ascending: false }),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (error) {
    logError("Error fetching user books:", error);
    throw error;
  }

  const userBooks = (data ?? []).map((row) => ({
    ...row,
    book: row.book ?? undefined,
  })) as unknown as UserBook[];

  return (
    <>
      <Header title="서재" />
      <LibraryView userBooks={userBooks} />
    </>
  );
}
