type BadgeVariant =
  | "common"
  | "rare"
  | "epic"
  | "legendary"
  | "want"
  | "reading"
  | "completed"
  | "dropped";

interface PixelBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  common: "bg-rarity-common text-white",
  rare: "bg-rarity-rare text-white",
  epic: "bg-rarity-epic text-white",
  legendary: "bg-rarity-legendary text-brown",
  want: "bg-status-want text-brown",
  reading: "bg-status-reading text-white",
  completed: "bg-status-completed text-white",
  dropped: "bg-status-dropped text-white",
};

const variantLabels: Record<BadgeVariant, string> = {
  common: "일반",
  rare: "레어",
  epic: "에픽",
  legendary: "전설",
  want: "읽고 싶은",
  reading: "읽는 중",
  completed: "완독",
  dropped: "중단",
};

export default function PixelBadge({ variant, children }: PixelBadgeProps) {
  return (
    <span
      className={`inline-block border-2 border-brown px-2 py-0.5 text-xs font-bold shadow-pixel-sm ${variantClasses[variant]}`}
    >
      {children ?? variantLabels[variant]}
    </span>
  );
}
