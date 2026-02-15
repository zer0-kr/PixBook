import type { SupabaseClient } from "@supabase/supabase-js";
import type { Character } from "@/types";

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
    console.error("Error fetching unlockable characters:", charError);
    return [];
  }

  // 2. Fetch user's already unlocked character IDs
  const { data: userChars, error: ucError } = await supabase
    .from("user_characters")
    .select("character_id")
    .eq("user_id", userId);

  if (ucError) {
    console.error("Error fetching user characters:", ucError);
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

  // 4. INSERT new entries into user_characters
  const insertRows = newlyUnlockable.map((c: Character) => ({
    user_id: userId,
    character_id: c.id,
    is_active: false,
  }));

  const { error: insertError } = await supabase
    .from("user_characters")
    .insert(insertRows);

  if (insertError) {
    console.error("Error inserting user characters:", insertError);
    return [];
  }

  return newlyUnlockable as Character[];
}

/**
 * Set a character as the user's active character.
 * Deactivates any previously active character first.
 */
export async function setActiveCharacter(
  supabase: SupabaseClient,
  userId: string,
  characterId: string
): Promise<boolean> {
  // Deactivate all current active characters
  const { error: deactivateError } = await supabase
    .from("user_characters")
    .update({ is_active: false })
    .eq("user_id", userId)
    .eq("is_active", true);

  if (deactivateError) {
    console.error("Error deactivating characters:", deactivateError);
    return false;
  }

  // Activate the selected character
  const { error: activateError } = await supabase
    .from("user_characters")
    .update({ is_active: true })
    .eq("user_id", userId)
    .eq("character_id", characterId);

  if (activateError) {
    console.error("Error activating character:", activateError);
    return false;
  }

  // Update the profile's active_character_id
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ active_character_id: characterId })
    .eq("id", userId);

  if (profileError) {
    console.error("Error updating profile active character:", profileError);
    return false;
  }

  return true;
}
