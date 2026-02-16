import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout";
import { LibraryView } from "@/components/library";
import type { UserBook } from "@/types";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("user_books")
    .select("*, book:books(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching user books:", error);
  }

  const userBooks: UserBook[] = (data ?? []).map((row) => ({
    ...row,
    book: row.book ?? undefined,
  }));

  return (
    <>
      <Header title="서재" />
      <LibraryView userBooks={userBooks} />
    </>
  );
}
