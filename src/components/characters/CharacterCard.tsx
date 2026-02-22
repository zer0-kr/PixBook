"use client";

import { useState } from "react";
import Image from "next/image";
import { PixelBadge } from "@/components/ui";
import { formatHeight } from "@/lib/tower/calculator";
import type { Character, CharacterRarity } from "@/types";

const RARITY_BORDER_COLORS: Record<CharacterRarity, string> = {
  common: "border-rarity-common",
  rare: "border-rarity-rare",
  epic: "border-rarity-epic",
  legendary: "border-rarity-legendary",
};

const RARITY_GLOW: Record<CharacterRarity, string> = {
  common: "",
  rare: "shadow-[0_0_8px_rgba(52,152,219,0.5)]",
  epic: "shadow-[0_0_12px_rgba(155,89,182,0.6)]",
  legendary: "shadow-[0_0_16px_rgba(255,215,0,0.7)]",
};

const RARITY_BG: Record<CharacterRarity, string> = {
  common: "bg-rarity-common",
  rare: "bg-rarity-rare",
  epic: "bg-rarity-epic",
  legendary: "bg-rarity-legendary",
};

const RARITY_LABELS: Record<CharacterRarity, string> = {
  common: "일반",
  rare: "레어",
  epic: "에픽",
  legendary: "전설",
};

interface CharacterCardProps {
  character: Character;
  isUnlocked: boolean;
  onClick?: () => void;
}

/**
 * CSS-based placeholder sprite when image fails to load.
 * Shows the first character of the name with a rarity-based background.
 */
function PlaceholderSprite({
  name,
  rarity,
  locked,
}: {
  name: string;
  rarity: CharacterRarity;
  locked: boolean;
}) {
  const initial = name.charAt(0);
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${
        locked ? "bg-brown/40" : RARITY_BG[rarity]
      }`}
    >
      <span
        className={`font-pixel text-lg ${
          locked ? "text-brown-lighter" : "text-white"
        }`}
      >
        {locked ? "?" : initial}
      </span>
    </div>
  );
}

export default function CharacterCard({
  character,
  isUnlocked,
  onClick,
}: CharacterCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={`group relative flex flex-col overflow-hidden border-3 ${
        RARITY_BORDER_COLORS[character.rarity]
      } ${isUnlocked ? RARITY_GLOW[character.rarity] : ""} ${
        isUnlocked ? "" : "opacity-80"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Sprite area */}
      <div className="relative aspect-square w-full overflow-hidden bg-cream-dark">
        {isUnlocked && !imgError ? (
          <Image
            src={character.sprite_url}
            alt={character.name}
            fill
            unoptimized
            className="pixel-art object-contain p-2"
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Fallback placeholder (always show if image fails or locked) */}
        {(imgError || !isUnlocked) && (
          <div className="absolute inset-0">
            <PlaceholderSprite
              name={character.name}
              rarity={character.rarity}
              locked={!isUnlocked}
            />
          </div>
        )}

        {/* Lock overlay for locked characters */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-brown/50">
            <span className="font-pixel text-xl text-white/80">?</span>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="flex flex-1 flex-col bg-cream p-2">
        {/* Name */}
        <p className="truncate text-xs font-bold text-brown">
          {isUnlocked ? character.name : "???"}
        </p>

        {/* Description or unlock condition */}
        {isUnlocked ? (
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-brown-lighter">
            {character.description}
          </p>
        ) : (
          <p className="mt-0.5 text-[10px] text-brown-lighter">
            높이 {formatHeight(character.unlock_height_cm)}에서 해금
          </p>
        )}

        {/* Rarity badge */}
        <div className="mt-auto pt-1.5">
          <PixelBadge variant={character.rarity}>
            {RARITY_LABELS[character.rarity]}
          </PixelBadge>
        </div>
      </div>
    </div>
  );
}
