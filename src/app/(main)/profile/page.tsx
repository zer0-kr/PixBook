import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { ProfilePageView } from "@/components/profile";
import type { Profile, Character } from "@/types";

export const metadata = {
  title: "프로필 | 픽북",
  description: "닉네임 변경, 독서 현황 확인, 데이터 내보내기 등 나의 계정을 관리하세요.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // Fetch getUser, profile, and all characters in parallel
  const [user, { data: profileData }, { data: allCharacters }] = await Promise.all([
    getUser(),
    supabase.from("profiles").select("*").single(),
    supabase.from("characters").select("id, name, sprite_url"),
  ]);

  if (!user) {
    redirect("/login");
  }

  const profile = profileData as Profile | null;

  if (!profile) {
    redirect("/login");
  }

  // Find active character from pre-fetched list
  const activeCharacter: Character | null = profile.active_character_id
    ? (allCharacters?.find((c) => c.id === profile.active_character_id) as Character | undefined) ?? null
    : null;

  return (
    <>
      <Header title="프로필" />
      <ProfilePageView
        profile={profile}
        email={user.email ?? ""}
        activeCharacter={activeCharacter}
      />
    </>
  );
}
