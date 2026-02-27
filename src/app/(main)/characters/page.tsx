import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { getCachedCharacters } from "@/lib/supabase/cached-queries";
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

  // Fetch user, cached characters, user's unlocked characters, profile, and completed books in parallel
  // getCachedCharacters() is served from unstable_cache (1hr TTL) — no DB query on cache hit
  const [user, characters, { data: userCharacters }, { data: profile }, { data: completedBooks }] =
    await Promise.all([
      getUser(),
      getCachedCharacters(),
      supabase
        .from("user_characters")
        .select("id, character_id, unlocked_at, character:characters(id, name, description, sprite_url, unlock_height_cm, rarity)"),
      supabase.from("profiles").select("*").maybeSingle(),
      supabase
        .from("user_books")
        .select("book:books(page_count)")
        .eq("reading_status", "completed"),
    ]);

  if (!user) {
    redirect("/login");
  }

  // Use profile.tower_height_cm if available (updated by client-side RPC on each book completion).
  // Fall back to manual calculation when stale/0 (e.g., pre-existing completions before RPC was added).
  const profileHeight = profile?.tower_height_cm ?? 0;
  const towerHeightCm = profileHeight > 0
    ? profileHeight
    : (completedBooks ?? []).reduce(
        (sum, ub) => {
          const book = ub.book as unknown as { page_count: number } | null;
          return sum + (book?.page_count ?? 0);
        }, 0
      ) * BASE_CM_PER_PAGE;
  const unlockedIds = new Set(
    (userCharacters ?? []).map((uc) => uc.character_id)
  );
  const hasUnlockable = (characters as Character[]).some(
    (c) =>
      c.unlock_height_cm <= towerHeightCm &&
      !unlockedIds.has(c.id)
  );

  return (
    <>
      <Header title="캐릭터 도감" />
      <div className="p-4 md:p-6">
        <CharacterPageView
          characters={characters as Character[]}
          userCharacters={(userCharacters ?? []) as unknown as UserCharacter[]}
          profile={{ ...(profile as Profile), tower_height_cm: towerHeightCm }}
          pendingUnlock={hasUnlockable}
        />
      </div>
    </>
  );
}
