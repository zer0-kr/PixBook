"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import type { UserCharacter } from "@/types";

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
