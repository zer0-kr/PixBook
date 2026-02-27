import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { ProfilePageView } from "@/components/profile";
import type { Profile } from "@/types";

export const metadata = {
  title: "프로필 | 픽북",
  description: "닉네임 변경, 독서 현황 확인, 데이터 내보내기 등 나의 계정을 관리하세요.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const [user, { data: profileData }] = await Promise.all([
    getUser(),
    supabase.from("profiles").select("*").maybeSingle(),
  ]);

  if (!user) {
    redirect("/login");
  }

  const profile = profileData as Profile | null;

  if (!profile) {
    redirect("/login");
  }

  return (
    <>
      <Header title="프로필" />
      <ProfilePageView profile={profile} email={user.email ?? ""} />
    </>
  );
}
