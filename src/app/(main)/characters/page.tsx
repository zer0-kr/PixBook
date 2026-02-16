import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import { BASE_CM_PER_PAGE } from "@/lib/tower/calculator";
import Header from "@/components/layout/Header";
import CharacterPageView from "@/components/characters/CharacterPageView";
import type { Character, UserCharacter, Profile } from "@/types";

export const metadata = {
  title: "캐릭터 도감 | 픽북",
  description: "책을 읽고 탑을 쌓아 새로운 캐릭터를 해금하세요. 일반부터 전설까지 다양한 캐릭터를 수집해보세요.",
};

export default async function CharactersPage() {
  const supabase = await createClient();

  // Fetch getUser, all characters, user's unlocked characters, profile, and completed books in parallel
  const [user, { data: characters }, { data: userCharacters }, { data: profile }, { data: completedBooks }] =
    await Promise.all([
      getUser(),
      supabase
        .from("characters")
        .select("*")
        .order("unlock_height_cm", { ascending: true }),
      supabase
        .from("user_characters")
        .select("*, character:characters(*)"),
      supabase.from("profiles").select("*").single(),
      supabase
        .from("user_books")
        .select("book:books(page_count)")
        .eq("reading_status", "completed"),
    ]);

  if (!user) {
    redirect("/login");
  }

  // Calculate tower height directly from completed books (profile.tower_height_cm may be stale/0
  // because recalculate_tower_height RPC fails in server components due to auth.uid() = NULL)
  const totalPagesRead = (completedBooks ?? []).reduce(
    (sum, ub) => sum + ((ub as any).book?.page_count ?? 0), 0
  );
  const towerHeightCm = totalPagesRead * BASE_CM_PER_PAGE;
  const unlockedIds = new Set(
    (userCharacters ?? []).map((uc) => (uc as UserCharacter).character_id)
  );
  const hasUnlockable = (characters ?? []).some(
    (c) =>
      (c as Character).unlock_height_cm <= towerHeightCm &&
      !unlockedIds.has((c as Character).id)
  );

  let finalUserCharacters = userCharacters;
  if (hasUnlockable) {
    await checkAndUnlockCharacters(supabase, user.id, towerHeightCm);
    const { data: refreshed } = await supabase
      .from("user_characters")
      .select("*, character:characters(*)")
      .eq("user_id", user.id);
    finalUserCharacters = refreshed;
  }

  return (
    <>
      <Header title="캐릭터 도감" />
      <div className="p-4 md:p-6">
        <CharacterPageView
          characters={(characters as Character[]) ?? []}
          userCharacters={(finalUserCharacters as UserCharacter[]) ?? []}
          profile={{ ...(profile as Profile), tower_height_cm: towerHeightCm }}
        />
      </div>
    </>
  );
}
