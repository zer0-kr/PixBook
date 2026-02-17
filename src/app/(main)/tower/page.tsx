import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { TowerPageView } from "@/components/tower";
import type { UserBook } from "@/types";

export default async function TowerPage() {
  const supabase = await createClient();

  const [user, { data: completedData }] = await Promise.all([
    getUser(),
    supabase
      .from("user_books")
      .select("id, spine_color, end_date, created_at, book:books(id, title, page_count, cover_url)")
      .eq("reading_status", "completed")
      .order("end_date", { ascending: true }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const completedBooks = (completedData ?? []).map((row) => ({
    ...row,
    book: row.book ?? undefined,
  })) as unknown as UserBook[];

  return (
    <>
      <Header title="책 탑" />
      <TowerPageView completedBooks={completedBooks} />
    </>
  );
}
