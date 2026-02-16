import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout";
import { ProfilePageView } from "@/components/profile";
import type { Profile, Character } from "@/types";

export const metadata = {
  title: "프로필 | 북적북적",
  description: "닉네임 변경, 독서 현황 확인, 데이터 내보내기 등 나의 계정을 관리하세요.",
};

export default async function ProfilePage() {
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

  if (!profile) {
    redirect("/login");
  }

  // Fetch active character if set
  let activeCharacter: Character | null = null;
  if (profile.active_character_id) {
    const { data: charData } = await supabase
      .from("characters")
      .select("*")
      .eq("id", profile.active_character_id)
      .single();
    activeCharacter = charData as Character | null;
  }

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
