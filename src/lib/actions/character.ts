"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import type { UserCharacter } from "@/types";

export async function unlockPendingCharactersAction(): Promise<
  UserCharacter[] | null
> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();

  // 서버에서 직접 높이 조회 — 클라이언트 값 신뢰하지 않음
  const { data: rpcData } = await supabase.rpc("recalculate_tower_height", {
    p_user_id: user.id,
  });
  const towerHeightCm = Number(
    (rpcData as { tower_height: number }[] | null)?.[0]?.tower_height ?? 0
  );

  await checkAndUnlockCharacters(supabase, user.id, towerHeightCm);

  const { data } = await supabase
    .from("user_characters")
    .select(
      "id, character_id, unlocked_at, character:characters(id, name, description, sprite_url, unlock_height_cm, rarity)"
    )
    .eq("user_id", user.id);

  return (data as unknown as UserCharacter[]) ?? [];
}
