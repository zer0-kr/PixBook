import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import { getTowerHeight } from "@/lib/tower/rpc";
import type { Character } from "@/types";

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

      const height = await getTowerHeight(supabase, user.id);
      if (height === null) return;

      // Check for newly unlocked characters
      const newlyUnlocked = await checkAndUnlockCharacters(
        supabase,
        user.id,
        height
      );

      if (newlyUnlocked.length > 0 && mountedRef.current) {
        setUnlockedCharacters(newlyUnlocked);
        setShowUnlockIndex(0);
      }
    } catch (err) {
      const { logError } = await import("@/lib/logger");
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
