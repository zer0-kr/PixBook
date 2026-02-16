"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import type { UserCharacter } from "@/types";

export async function setActiveCharacterAction(characterId: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = await createClient();

  // 기존 활성 캐릭터 해제
  await supabase
    .from("user_characters")
    .update({ is_active: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  // 새 캐릭터 활성화
  const { error: activateError } = await supabase
    .from("user_characters")
    .update({ is_active: true })
    .eq("user_id", user.id)
    .eq("character_id", characterId);

  if (activateError) return false;

  // 프로필 업데이트
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ active_character_id: characterId })
    .eq("id", user.id);

  return !profileError;
}

export async function unlockPendingCharactersAction(
  towerHeightCm: number
): Promise<UserCharacter[] | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  await checkAndUnlockCharacters(supabase, user.id, towerHeightCm);

  const { data } = await supabase
    .from("user_characters")
    .select(
      "id, character_id, unlocked_at, character:characters(id, name, description, sprite_url, unlock_height_cm, rarity)"
    )
    .eq("user_id", user.id);

  return (data as unknown as UserCharacter[]) ?? [];
}
