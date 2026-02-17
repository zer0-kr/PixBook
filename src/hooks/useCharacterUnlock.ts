import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import { logError } from "@/lib/logger";
import type { Character } from "@/types";

interface TowerHeightResult {
  tower_height: number;
  books_completed: number;
  pages_read: number;
}

export function useCharacterUnlock(mountedRef: React.RefObject<boolean>) {
  const [unlockedCharacters, setUnlockedCharacters] = useState<Character[]>([]);
  const [showUnlockIndex, setShowUnlockIndex] = useState<number>(-1);

  const recalculateTowerHeight = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !mountedRef.current) return;

      const { data, error } = await supabase.rpc("recalculate_tower_height", {
        p_user_id: user.id,
      });

      if (error) {
        logError("Error recalculating tower height:", error);
        return;
      }

      const result = (data as TowerHeightResult[] | null)?.[0];
      if (!result) return;

      const towerHeight = Number(result.tower_height);

      // Check for newly unlocked characters
      const newlyUnlocked = await checkAndUnlockCharacters(
        supabase,
        user.id,
        towerHeight
      );

      if (newlyUnlocked.length > 0 && mountedRef.current) {
        setUnlockedCharacters(newlyUnlocked);
        setShowUnlockIndex(0);
      }
    } catch (err) {
      logError("Error recalculating tower:", err);
    }
  }, [mountedRef]);

  // Derived: current character to show in unlock animation, or null
  const unlockedCharacter =
    showUnlockIndex >= 0 && showUnlockIndex < unlockedCharacters.length
      ? unlockedCharacters[showUnlockIndex]
      : null;

  const handleDismissUnlock = useCallback(() => {
    const nextIndex = showUnlockIndex + 1;
    if (nextIndex < unlockedCharacters.length) {
      setShowUnlockIndex(nextIndex);
    } else {
      setShowUnlockIndex(-1);
      setUnlockedCharacters([]);
    }
  }, [showUnlockIndex, unlockedCharacters.length]);

  return {
    recalculateTowerHeight,
    unlockedCharacter,
    handleDismissUnlock,
  };
}
