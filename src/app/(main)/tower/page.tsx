import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { TowerPageView } from "@/components/tower";
import { getCachedCharacters } from "@/lib/supabase/cached-queries";
import type { UserBook, Character, Profile } from "@/types";

export default async function TowerPage() {
  const supabase = await createClient();

  // Fetch getUser, profile, completed books, and all characters in parallel
  const [user, { data: profileData }, { data: completedData }, allCharacters] =
    await Promise.all([
      getUser(),
      supabase.from("profiles").select("*").single(),
      supabase
        .from("user_books")
        .select("id, spine_color, end_date, created_at, book:books(id, title, page_count, cover_url)")
        .eq("reading_status", "completed")
        .order("end_date", { ascending: true }),
      getCachedCharacters(),
    ]);

  if (!user) {
    redirect("/login");
  }

  const profile = profileData as Profile | null;

  const completedBooks = (completedData ?? []).map((row) => ({
    ...row,
    book: row.book ?? undefined,
  })) as unknown as UserBook[];

  // Find active character from pre-fetched list
  const activeCharacter: Character | null = profile?.active_character_id
    ? allCharacters.find((c) => c.id === profile.active_character_id) ?? null
    : null;

  return (
    <>
      <Header title="책 탑" />
      <TowerPageView
        completedBooks={completedBooks}
        activeCharacter={activeCharacter}
      />
    </>
  );
}
