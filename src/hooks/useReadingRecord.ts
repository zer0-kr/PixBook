import { useState, useCallback, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import { logError } from "@/lib/logger";
import { SPINE_COLORS } from "@/lib/constants";
import type { UserBook, ReadingStatus, Character } from "@/types";

interface TowerHeightResult {
  tower_height: number;
  books_completed: number;
  pages_read: number;
}

interface UseReadingRecordParams {
  userBook: UserBook;
  onUpdate: (updated: Partial<UserBook>) => void;
}

export function useReadingRecord({ userBook, onUpdate }: UseReadingRecordParams) {
  const [status, setStatus] = useState<ReadingStatus>(userBook.reading_status);
  const [rating, setRating] = useState<number>(userBook.rating ?? 0);
  const [review, setReview] = useState(userBook.one_line_review ?? "");
  const [startDate, setStartDate] = useState(userBook.start_date ?? "");
  const [endDate, setEndDate] = useState(userBook.end_date ?? "");
  const [spineColor, setSpineColor] = useState(userBook.spine_color ?? SPINE_COLORS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [unlockedCharacters, setUnlockedCharacters] = useState<Character[]>([]);
  const [showUnlockIndex, setShowUnlockIndex] = useState<number>(-1);

  const { toast } = useToast();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdatesRef = useRef<Partial<UserBook> | null>(null);
  const mountedRef = useRef(true);

  // Save changes, returns true on success
  // When called during unmount flush, mountedRef prevents setState on unmounted component
  const saveChanges = useCallback(
    async (updates: Partial<UserBook>): Promise<boolean> => {
      if (mountedRef.current) setIsSaving(true);
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("user_books")
          .update(updates)
          .eq("id", userBook.id);

        if (error) throw error;

        if (mountedRef.current) onUpdate(updates);
        return true;
      } catch {
        if (mountedRef.current) toast("error", "저장에 실패했습니다");
        return false;
      } finally {
        if (mountedRef.current) setIsSaving(false);
      }
    },
    [userBook.id, onUpdate, toast]
  );

  const debouncedSave = useCallback(
    (updates: Partial<UserBook>) => {
      pendingUpdatesRef.current = { ...pendingUpdatesRef.current, ...updates };
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        const toSave = pendingUpdatesRef.current;
        pendingUpdatesRef.current = null;
        if (toSave) saveChanges(toSave);
      }, 800);
    },
    [saveChanges]
  );

  // Flush pending debounced save on unmount (fire-and-forget; setState guarded by mountedRef)
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (pendingUpdatesRef.current) {
        saveChanges(pendingUpdatesRef.current);
        pendingUpdatesRef.current = null;
      }
    };
  }, [saveChanges]);

  // Recalculate tower height when status changes to completed (atomic RPC)
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
  }, []);

  const handleStatusChange = useCallback(
    async (newStatus: ReadingStatus) => {
      const prevStatus = status;
      const prevStartDate = startDate;
      const prevEndDate = endDate;

      setStatus(newStatus);

      const updates: Partial<UserBook> = {
        reading_status: newStatus,
      };

      // Auto-set start_date when status becomes reading
      if (newStatus === "reading" && !startDate) {
        const today = new Date().toISOString().split("T")[0];
        setStartDate(today);
        updates.start_date = today;
      }

      // Auto-set end_date when status becomes completed
      if (newStatus === "completed" && !endDate) {
        const today = new Date().toISOString().split("T")[0];
        setEndDate(today);
        updates.end_date = today;
      }

      const success = await saveChanges(updates);

      if (!success) {
        // Rollback optimistic state on failure
        setStatus(prevStatus);
        setStartDate(prevStartDate);
        setEndDate(prevEndDate);
        return;
      }

      // Recalculate tower when completed
      if (newStatus === "completed") {
        await recalculateTowerHeight();
        toast("success", "완독을 축하합니다! 탑이 높아졌어요!");
      }
    },
    [status, startDate, endDate, saveChanges, recalculateTowerHeight, toast]
  );

  const handleRatingChange = useCallback(
    (newRating: number) => {
      setRating(newRating);
      debouncedSave({ rating: newRating });
    },
    [debouncedSave]
  );

  const handleReviewChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setReview(value);
      debouncedSave({ one_line_review: value || null });
    },
    [debouncedSave]
  );

  const handleStartDateChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setStartDate(value);
      debouncedSave({ start_date: value || null });
    },
    [debouncedSave]
  );

  const handleEndDateChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEndDate(value);
      debouncedSave({ end_date: value || null });
    },
    [debouncedSave]
  );

  const handleSpineColorChange = useCallback(
    (color: string) => {
      setSpineColor(color);
      debouncedSave({ spine_color: color });
    },
    [debouncedSave]
  );

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
    status,
    rating,
    review,
    startDate,
    endDate,
    spineColor,
    isSaving,
    handleStatusChange,
    handleRatingChange,
    handleReviewChange,
    handleStartDateChange,
    handleEndDateChange,
    handleSpineColorChange,
    unlockedCharacter,
    handleDismissUnlock,
  };
}
