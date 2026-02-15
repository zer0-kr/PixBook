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

export default function StarRating({
  value,
  onChange,
  size = "md",
}: StarRatingProps) {
  const interactive = typeof onChange === "function";

  return (
    <div className={`star-rating ${sizeClasses[size]}`} role="group" aria-label="별점">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${
            star <= value ? "text-pixel-gold" : "text-brown-lighter"
          } ${interactive ? "cursor-pointer hover:scale-110" : ""} inline-block transition-transform select-none`}
          onClick={interactive ? () => onChange(star) : undefined}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={`${star}점`}
          onKeyDown={
            interactive
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange(star);
                  }
                }
              : undefined
          }
        >
          {star <= value ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
