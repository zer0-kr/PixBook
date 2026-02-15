"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { PixelButton, PixelBadge } from "@/components/ui";
import type { Character, CharacterRarity } from "@/types";

const RARITY_LABELS: Record<CharacterRarity, string> = {
  common: "일반",
  rare: "레어",
  epic: "에픽",
  legendary: "전설",
};

const RARITY_TEXT: Record<CharacterRarity, string> = {
  common: "text-rarity-common",
  rare: "text-rarity-rare",
  epic: "text-rarity-epic",
  legendary: "text-rarity-legendary",
};

const RARITY_BG: Record<CharacterRarity, string> = {
  common: "bg-rarity-common",
  rare: "bg-rarity-rare",
  epic: "bg-rarity-epic",
  legendary: "bg-rarity-legendary",
};

interface UnlockAnimationProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Pixel sparkle particle for unlock animation.
 */
function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <div
      className="sparkle-particle absolute h-1.5 w-1.5 bg-pixel-gold"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

export default function UnlockAnimation({
  character,
  isOpen,
  onClose,
}: UnlockAnimationProps) {
  const [imgError, setImgError] = useState(false);
  const [show, setShow] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Trigger entrance animation
      const timer = setTimeout(() => setShow(true), 50);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      setShow(false);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Generate sparkle positions
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 150,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="캐릭터 획득"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-brown/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`relative z-10 w-full max-w-sm pixel-border bg-cream p-6 text-center transition-all duration-500 ${
          show
            ? "scale-100 opacity-100"
            : "scale-75 opacity-0"
        }`}
      >
        {/* Sparkle particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {sparkles.map((s) => (
            <Sparkle key={s.id} delay={s.delay} x={s.x} y={s.y} />
          ))}
        </div>

        {/* Title */}
        <h2 className="font-pixel text-sm text-brown mb-4 unlock-title-glow">
          새로운 캐릭터 획득!
        </h2>

        {/* Character sprite */}
        <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden border-3 border-brown bg-cream-dark">
          {!imgError ? (
            <Image
              src={character.sprite_url}
              alt={character.name}
              fill
              className="pixel-art object-contain p-2"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center ${RARITY_BG[character.rarity]}`}
            >
              <span className="font-pixel text-2xl text-white">
                {character.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Character name */}
        <h3
          className={`font-pixel text-base mb-1 ${RARITY_TEXT[character.rarity]}`}
        >
          {character.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-brown-lighter mb-3">
          {character.description}
        </p>

        {/* Rarity badge */}
        <div className="mb-4">
          <PixelBadge variant={character.rarity}>
            {RARITY_LABELS[character.rarity]}
          </PixelBadge>
        </div>

        {/* Close button */}
        <PixelButton onClick={onClose} variant="primary" size="md">
          확인
        </PixelButton>
      </div>
    </div>
  );
}
