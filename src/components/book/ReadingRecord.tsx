"use client";

import { PixelButton, StarRating } from "@/components/ui";
import UnlockAnimation from "@/components/characters/UnlockAnimation";
import { useReadingRecord } from "@/hooks/useReadingRecord";
import { SPINE_COLORS } from "@/lib/constants";
import type { UserBook, ReadingStatus } from "@/types";

const STATUS_OPTIONS: { key: ReadingStatus; label: string; color: string }[] = [
  { key: "want_to_read", label: "읽고 싶은", color: "bg-status-want text-brown" },
  { key: "reading", label: "읽는 중", color: "bg-status-reading text-white" },
  { key: "completed", label: "완독", color: "bg-status-completed text-white" },
  { key: "dropped", label: "중단", color: "bg-status-dropped text-white" },
];

interface ReadingRecordProps {
  userBook: UserBook;
  onUpdate: (updated: Partial<UserBook>) => void;
}

export default function ReadingRecord({ userBook, onUpdate }: ReadingRecordProps) {
  const {
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
    isRatingEditable,
    unlockedCharacter,
    handleDismissUnlock,
  } = useReadingRecord({ userBook, onUpdate });

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
              disabled={isSaving}
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
        <StarRating
          value={rating}
          onChange={isRatingEditable ? handleRatingChange : undefined}
          size="lg"
        />
        {!isRatingEditable && (
          <p className="text-xs text-brown-lighter mt-1">
            완독 후 평점을 남길 수 있습니다
          </p>
        )}
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
      {unlockedCharacter && (
        <UnlockAnimation
          character={unlockedCharacter}
          isOpen={true}
          onClose={handleDismissUnlock}
        />
      )}
    </div>
  );
}
