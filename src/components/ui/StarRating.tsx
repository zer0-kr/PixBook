"use client";

type StarSize = "sm" | "md" | "lg";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: StarSize;
}

const sizeClasses: Record<StarSize, string> = {
  sm: "text-sm",
  md: "text-xl",
  lg: "text-3xl",
};

function getClipPath(star: number, value: number): string {
  if (value >= star) return "inset(0 0 0 0)";
  if (value >= star - 0.5) return "inset(0 50% 0 0)";
  return "inset(0 100% 0 0)";
}

export default function StarRating({
  value,
  onChange,
  size = "md",
}: StarRatingProps) {
  const interactive = typeof onChange === "function";

  function handleClick(newValue: number) {
    if (!interactive) return;
    onChange(newValue === value ? 0 : newValue);
  }

  function handleKeyDown(e: React.KeyboardEvent, newValue: number) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(newValue);
    }
  }

  return (
    <div className={`star-rating ${sizeClasses[size]}`} role="group" aria-label="별점">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="relative inline-block select-none">
          {/* 빈 별 (배경) */}
          <span className="text-brown-lighter">☆</span>
          {/* 채워진 별 (전경, clip-path로 제어) */}
          <span
            className="absolute inset-0 text-pixel-gold pointer-events-none"
            style={{ clipPath: getClipPath(star, value) }}
            data-testid={`star-filled-${star}`}
          >
            ★
          </span>
          {interactive && (
            <>
              {/* 왼쪽 절반 클릭 영역 (반별) */}
              <span
                className="absolute inset-y-0 left-0 w-1/2 cursor-pointer hover:opacity-80"
                onClick={() => handleClick(star - 0.5)}
                role="button"
                tabIndex={0}
                aria-label={`${star - 0.5}점`}
                data-testid={`star-half-${star}`}
                onKeyDown={(e) => handleKeyDown(e, star - 0.5)}
              />
              {/* 오른쪽 절반 클릭 영역 (정수별) */}
              <span
                className="absolute inset-y-0 right-0 w-1/2 cursor-pointer hover:opacity-80"
                onClick={() => handleClick(star)}
                role="button"
                tabIndex={0}
                aria-label={`${star}점`}
                data-testid={`star-full-${star}`}
                onKeyDown={(e) => handleKeyDown(e, star)}
              />
            </>
          )}
        </span>
      ))}
    </div>
  );
}
