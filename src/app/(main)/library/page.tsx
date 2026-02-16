import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { logError } from "@/lib/logger";
import { Header } from "@/components/layout";
import { LibraryView } from "@/components/library";
import type { UserBook } from "@/types";

export default async function LibraryPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_books")
    .select("*, book:books(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    logError("Error fetching user books:", error);
    throw error;
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
