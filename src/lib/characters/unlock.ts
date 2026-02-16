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

  // 5. Auto-set active character if none is set
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("active_character_id")
    .eq("id", userId)
    .single();

  if (!currentProfile?.active_character_id) {
    const firstCharId = allUnlockable[0].id;

    await supabase
      .from("user_characters")
      .update({ is_active: true })
      .eq("user_id", userId)
      .eq("character_id", firstCharId);

    await supabase
      .from("profiles")
      .update({ active_character_id: firstCharId })
      .eq("id", userId);
  }

  return newlyUnlockable as Character[];
}
