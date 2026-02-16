import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import Header from "@/components/layout/Header";
import CharacterPageView from "@/components/characters/CharacterPageView";
import type { Character, UserCharacter, Profile } from "@/types";

export const metadata = {
  title: "캐릭터 도감 | 픽북",
  description: "책을 읽고 탑을 쌓아 새로운 캐릭터를 해금하세요. 일반부터 전설까지 다양한 캐릭터를 수집해보세요.",
};

export default async function CharactersPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch all characters, user's unlocked characters, and profile in parallel
  const [{ data: characters }, { data: userCharacters }, { data: profile }] =
    await Promise.all([
      supabase
        .from("characters")
        .select("*")
        .order("unlock_height_cm", { ascending: true }),
      supabase
        .from("user_characters")
        .select("*, character:characters(*)")
        .eq("user_id", user.id),
      supabase.from("profiles").select("*").eq("id", user.id).single(),
    ]);

  return (
    <>
      <Header title="캐릭터 도감" />
      <div className="p-4 md:p-6">
        <CharacterPageView
          characters={(characters as Character[]) ?? []}
          userCharacters={(userCharacters as UserCharacter[]) ?? []}
          profile={profile as Profile}
        />
      </div>
    </>
  );
}
