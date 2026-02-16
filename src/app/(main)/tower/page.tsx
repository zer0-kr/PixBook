import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { TowerPageView } from "@/components/tower";
import { BASE_CM_PER_PAGE } from "@/lib/tower/calculator";
import type { UserBook, Character, Profile } from "@/types";

export default async function TowerPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch profile + completed books in parallel
  const [{ data: profileData }, { data: completedData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("user_books")
      .select("*, book:books(*)")
      .eq("user_id", user.id)
      .eq("reading_status", "completed")
      .order("end_date", { ascending: true }),
  ]);

  const profile = profileData as Profile | null;

  const completedBooks: UserBook[] = (completedData ?? []).map((row) => ({
    ...row,
    book: row.book ?? undefined,
  }));

  // Calculate tower stats directly from completedBooks (no RPC dependency)
  const totalBooksCompleted = completedBooks.length;
  const totalPagesRead = completedBooks.reduce(
    (sum, ub) => sum + (ub.book?.page_count ?? 0),
    0
  );
  const totalHeightCm = totalPagesRead * BASE_CM_PER_PAGE;

  // Fetch active character (if any)
  let activeCharacter: Character | null = null;
  if (profile?.active_character_id) {
    const { data: charData } = await supabase
      .from("characters")
      .select("*")
      .eq("id", profile.active_character_id)
      .single();
    activeCharacter = charData as Character | null;
  }

  return (
    <>
      <Header title="책 탑" />
      <TowerPageView
        completedBooks={completedBooks}
        totalHeightCm={totalHeightCm}
        totalBooksCompleted={totalBooksCompleted}
        totalPagesRead={totalPagesRead}
        activeCharacter={activeCharacter}
      />
    </>
  );
}
