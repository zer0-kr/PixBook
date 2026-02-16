import type { SupabaseClient } from "@supabase/supabase-js";
import type { Character } from "@/types";
import { logError } from "@/lib/logger";

/**
 * Check which characters can be unlocked at the given tower height,
 * and insert any newly unlockable ones into user_characters.
 *
 * @returns Array of newly unlocked Character objects (empty if none).
 */
export async function checkAndUnlockCharacters(
  supabase: SupabaseClient,
  userId: string,
  newTowerHeightCm: number
): Promise<Character[]> {
  // 1. Fetch all characters where unlock_height_cm <= newTowerHeightCm
  const { data: allUnlockable, error: charError } = await supabase
    .from("characters")
    .select("*")
    .lte("unlock_height_cm", newTowerHeightCm)
    .order("unlock_height_cm", { ascending: true });

  if (charError || !allUnlockable) {
    logError("Error fetching unlockable characters:", charError);
    return [];
  }

  // 2. Fetch user's already unlocked character IDs
  const { data: userChars, error: ucError } = await supabase
    .from("user_characters")
    .select("character_id")
    .eq("user_id", userId);

  if (ucError) {
    logError("Error fetching user characters:", ucError);
    return [];
  }

  const alreadyUnlockedIds = new Set(
    (userChars ?? []).map((uc: { character_id: string }) => uc.character_id)
  );

  // 3. Find newly unlockable characters
  const newlyUnlockable = allUnlockable.filter(
    (c: Character) => !alreadyUnlockedIds.has(c.id)
  );

  if (newlyUnlockable.length === 0) {
    return [];
  }

  // 4. UPSERT new entries into user_characters (prevents duplicate insert race condition)
  const insertRows = newlyUnlockable.map((c: Character) => ({
    user_id: userId,
    character_id: c.id,
    is_active: false,
  }));

  const { error: insertError } = await supabase
    .from("user_characters")
    .upsert(insertRows, { onConflict: "user_id,character_id", ignoreDuplicates: true });

  if (insertError) {
    logError("Error inserting user characters:", insertError);
    return [];
  }

  return newlyUnlockable as Character[];
}

/**
 * Set a character as the user's active character.
 * Uses an atomic RPC call to prevent inconsistent state.
 */
export async function setActiveCharacter(
  supabase: SupabaseClient,
  userId: string,
  characterId: string
): Promise<boolean> {
  const { error } = await supabase.rpc("set_active_character", {
    p_user_id: userId,
    p_character_id: characterId,
  });

  if (error) {
    logError("Error setting active character:", error);
    return false;
  }

  return true;
}
