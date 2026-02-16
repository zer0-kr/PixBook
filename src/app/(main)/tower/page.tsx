import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { TowerPageView } from "@/components/tower";
import { BASE_CM_PER_PAGE } from "@/lib/tower/calculator";
import type { UserBook, Character, Profile } from "@/types";

export default async function TowerPage() {
  const supabase = await createClient();

  // Fetch getUser, profile, completed books, and all characters in parallel
  const [user, { data: profileData }, { data: completedData }, { data: allCharacters }] =
    await Promise.all([
      getUser(),
      supabase.from("profiles").select("*").single(),
      supabase
        .from("user_books")
        .select("*, book:books(*)")
        .eq("reading_status", "completed")
        .order("end_date", { ascending: true }),
      supabase.from("characters").select("*"),
    ]);

  if (!user) {
    redirect("/login");
  }

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

  // Find active character from pre-fetched list
  const activeCharacter: Character | null = profile?.active_character_id
    ? (allCharacters?.find((c: Character) => c.id === profile.active_character_id) as Character) ?? null
    : null;

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
