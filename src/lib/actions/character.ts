"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import type { UserCharacter } from "@/types";

export async function setActiveCharacterAction(characterId: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_active_character", {
    p_user_id: user.id,
    p_character_id: characterId,
  });

  return !error;
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
