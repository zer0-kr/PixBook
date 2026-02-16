import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { TowerPageView } from "@/components/tower";
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

  // Recalculate tower stats (syncs profiles table and returns fresh values)
  const { data: towerData } = await supabase.rpc("recalculate_tower_height", {
    p_user_id: user.id,
  });

  const towerResult = (
    towerData as
      | { tower_height: number; books_completed: number; pages_read: number }[]
      | null
  )?.[0];

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
        totalHeightCm={towerResult ? Number(towerResult.tower_height) : (profile?.tower_height_cm ?? 0)}
        totalBooksCompleted={towerResult?.books_completed ?? (profile?.total_books_completed ?? 0)}
        totalPagesRead={towerResult?.pages_read ?? (profile?.total_pages_read ?? 0)}
        activeCharacter={activeCharacter}
      />
    </>
  );
}
