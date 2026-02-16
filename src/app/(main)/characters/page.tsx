import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import CharacterPageView from "@/components/characters/CharacterPageView";
import type { Character, UserCharacter, Profile } from "@/types";

export const metadata = {
  title: "캐릭터 도감 | 픽북",
  description: "책을 읽고 탑을 쌓아 새로운 캐릭터를 해금하세요. 일반부터 전설까지 다양한 캐릭터를 수집해보세요.",
};

export default async function CharactersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all characters ordered by unlock height
  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .order("unlock_height_cm", { ascending: true });

  // Fetch user's unlocked characters
  const { data: userCharacters } = await supabase
    .from("user_characters")
    .select("*, character:characters(*)")
    .eq("user_id", user.id);

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

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
