import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout";
import { TowerPageView } from "@/components/tower";
import type { UserBook, Character, Profile } from "@/types";

export default async function TowerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = profileData as Profile | null;

  // Fetch completed books with their book data
  const { data: completedData } = await supabase
    .from("user_books")
    .select("*, book:books(*)")
    .eq("user_id", user.id)
    .eq("reading_status", "completed")
    .order("end_date", { ascending: true });

  const completedBooks: UserBook[] = (completedData ?? []).map((row) => ({
    ...row,
    book: row.book ?? undefined,
  }));

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
        totalHeightCm={profile?.tower_height_cm ?? 0}
        totalBooksCompleted={profile?.total_books_completed ?? 0}
        totalPagesRead={profile?.total_pages_read ?? 0}
        activeCharacter={activeCharacter}
      />
    </>
  );
}
