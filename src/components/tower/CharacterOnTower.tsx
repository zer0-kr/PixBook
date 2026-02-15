"use client";

import type { Character } from "@/types";

interface CharacterOnTowerProps {
  character: Character | null;
  towerTopPosition: number;
}

/**
 * Renders the user's active pixel-art character (or a default avatar) sitting on
 * top of the tower. Includes a gentle idle bounce animation.
 */
export default function CharacterOnTower({
  character,
}: CharacterOnTowerProps) {
  return (
    <div className="flex flex-col items-center animate-bounce-slow">
      {character?.sprite_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={character.sprite_url}
          alt={character.name}
          className="pixel-art h-10 w-10"
        />
      ) : (
        /* Default pixel avatar when no character is active */
        <div className="pixel-art flex h-10 w-10 items-center justify-center border-2 border-brown bg-pixel-yellow text-lg">
          :)
        </div>
      )}
      {character && (
        <span className="mt-0.5 text-[8px] font-bold text-brown">
          {character.name}
        </span>
      )}
    </div>
  );
}
