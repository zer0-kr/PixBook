"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PixelButton, StarRating } from "@/components/ui";
import { useToast } from "@/components/ui/PixelToast";
import { createClient } from "@/lib/supabase/client";
import { checkAndUnlockCharacters } from "@/lib/characters/unlock";
import UnlockAnimation from "@/components/characters/UnlockAnimation";
import type { UserBook, ReadingStatus, Character } from "@/types";

const STATUS_OPTIONS: { key: ReadingStatus; label: string; color: string }[] = [
  { key: "want_to_read", label: "읽고 싶은", color: "bg-status-want text-brown" },
  { key: "reading", label: "읽는 중", color: "bg-status-reading text-white" },
  { key: "completed", label: "완독", color: "bg-status-completed text-white" },
  { key: "dropped", label: "중단", color: "bg-status-dropped text-white" },
];

const SPINE_COLORS = [
  "#E74C3C", // red
  "#3498DB", // blue
  "#2ECC71", // green
  "#F1C40F", // yellow
  "#9B59B6", // purple
  "#E67E22", // orange
  "#FF6B9D", // pink
  "#1ABC9C", // teal
  "#3D2C2E", // brown
  "#8B9DC3", // silver-blue
];

interface ReadingRecordProps {
  userBook: UserBook;
  onUpdate: (updated: Partial<UserBook>) => void;
}

export default function ReadingRecord({ userBook, onUpdate }: ReadingRecordProps) {
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

  // Debounced save
  const saveChanges = useCallback(
    async (updates: Partial<UserBook>) => {
      setIsSaving(true);
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("user_books")
          .update(updates)
          .eq("id", userBook.id);

        if (error) throw error;

        onUpdate(updates);
      } catch {
        toast("error", "저장에 실패했습니다");
      } finally {
        setIsSaving(false);
      }
    },
    [userBook.id, onUpdate, toast]
  );

  const debouncedSave = useCallback(
    (updates: Partial<UserBook>) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        saveChanges(updates);
      }, 800);
    },
    [saveChanges]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Recalculate tower height when status changes to completed
  const recalculateTowerHeight = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch all completed user_books with page count
      const { data: completedBooks } = await supabase
        .from("user_books")
        .select("book:books(page_count)")
        .eq("user_id", user.id)
        .eq("reading_status", "completed");

      if (!completedBooks) return;

      let totalPages = 0;
      let totalBooks = 0;

      for (const row of completedBooks) {
        totalBooks++;
        const book = row.book as unknown;
        if (book && typeof book === "object" && "page_count" in book) {
          totalPages += (book as { page_count: number }).page_count || 0;
        }
      }

      const towerHeight = totalPages * 0.06;

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          tower_height_cm: towerHeight,
          total_books_completed: totalBooks,
          total_pages_read: totalPages,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating tower height:", error);
        return;
      }

      // Check for newly unlocked characters
      const newlyUnlocked = await checkAndUnlockCharacters(
        supabase,
        user.id,
        towerHeight
      );

      if (newlyUnlocked.length > 0) {
        setUnlockedCharacters(newlyUnlocked);
        setShowUnlockIndex(0);
      }
    } catch (err) {
      console.error("Error recalculating tower:", err);
    }
  }, []);

  const handleStatusChange = useCallback(
    async (newStatus: ReadingStatus) => {
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

      await saveChanges(updates);

      // Recalculate tower when completed
      if (newStatus === "completed") {
        await recalculateTowerHeight();
        toast("success", "완독을 축하합니다! 탑이 높아졌어요!");
      }
    },
    [startDate, endDate, saveChanges, recalculateTowerHeight, toast]
  );

  const handleRatingChange = useCallback(
    (newRating: number) => {
      setRating(newRating);
      debouncedSave({ rating: newRating });
    },
    [debouncedSave]
  );

  const handleReviewChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setReview(value);
      debouncedSave({ one_line_review: value || null });
    },
    [debouncedSave]
  );

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setStartDate(value);
      debouncedSave({ start_date: value || null });
    },
    [debouncedSave]
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="space-y-6">
      {/* Status selector */}
      <div>
        <label className="block text-sm font-bold text-brown mb-2">
          읽기 상태
        </label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <PixelButton
              key={opt.key}
              size="sm"
              variant={status === opt.key ? "primary" : "secondary"}
              onClick={() => handleStatusChange(opt.key)}
              className={
                status === opt.key ? opt.color : ""
              }
            >
              {opt.label}
            </PixelButton>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="start-date"
            className="block text-sm font-bold text-brown mb-1"
          >
            시작일
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="pixel-input w-full text-xs text-brown"
          />
        </div>
        <div>
          <label
            htmlFor="end-date"
            className="block text-sm font-bold text-brown mb-1"
          >
            완료일
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="pixel-input w-full text-xs text-brown"
          />
        </div>
      </div>

      {/* Star rating */}
      <div>
        <label className="block text-sm font-bold text-brown mb-2">
          평점
        </label>
        <StarRating value={rating} onChange={handleRatingChange} size="lg" />
      </div>

      {/* One-line review */}
      <div>
        <label
          htmlFor="review"
          className="block text-sm font-bold text-brown mb-1"
        >
          한 줄 감상
        </label>
        <input
          id="review"
          type="text"
          value={review}
          onChange={handleReviewChange}
          placeholder="이 책에 대한 한 줄 감상을 남겨보세요"
          className="pixel-input w-full text-sm text-brown"
          maxLength={200}
        />
      </div>

      {/* Spine color picker */}
      <div>
        <label className="block text-sm font-bold text-brown mb-2">
          책등 색상
        </label>
        <div className="flex flex-wrap gap-2">
          {SPINE_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleSpineColorChange(color)}
              className={`w-8 h-8 border-3 transition-transform ${
                spineColor === color
                  ? "border-brown scale-110 shadow-pixel"
                  : "border-brown-lighter hover:border-brown"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`색상 ${color}`}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Saving indicator */}
      {isSaving && (
        <p className="text-xs text-brown-lighter animate-pulse">저장 중...</p>
      )}

      {/* Character unlock animation */}
      {showUnlockIndex >= 0 && showUnlockIndex < unlockedCharacters.length && (
        <UnlockAnimation
          character={unlockedCharacters[showUnlockIndex]}
          isOpen={true}
          onClose={() => {
            const nextIndex = showUnlockIndex + 1;
            if (nextIndex < unlockedCharacters.length) {
              setShowUnlockIndex(nextIndex);
            } else {
              setShowUnlockIndex(-1);
              setUnlockedCharacters([]);
            }
          }}
        />
      )}
    </div>
  );
}
