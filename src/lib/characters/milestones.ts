import type { CharacterRarity } from "@/types";

import { COMMON_CHARACTERS } from "./data/common";
import { RARE_CHARACTERS } from "./data/rare";
import { EPIC_CHARACTERS } from "./data/epic";
import { LEGENDARY_CHARACTERS } from "./data/legendary";

export interface CharacterDefinition {
  name: string;
  description: string;
  sprite_url: string;
  unlock_height_cm: number;
  rarity: CharacterRarity;
}

/**
 * Helper to generate a sprite URL slug from a Korean character name.
 * The slug is a romanized/simplified version for the file path.
 */
export function spriteUrl(slug: string): string {
  return `/sprites/characters/${slug}.png`;
}

/**
 * All character definitions for the reading log app.
 * Theme: Height-based everyday objects & landmarks.
 * 62 characters across 4 rarity tiers, sorted by unlock_height_cm ASC.
 * Heights based on realistic book thickness (~0.006 cm/page).
 */
export const CHARACTER_DEFINITIONS: CharacterDefinition[] = [
  ...COMMON_CHARACTERS,
  ...RARE_CHARACTERS,
  ...EPIC_CHARACTERS,
  ...LEGENDARY_CHARACTERS,
];

/**
 * Get characters filtered by rarity.
 */
export function getCharactersByRarity(rarity: CharacterRarity): CharacterDefinition[] {
  return CHARACTER_DEFINITIONS.filter((c) => c.rarity === rarity);
}

/**
 * Get characters that would be unlocked at a given height.
 */
export function getUnlockableCharacters(heightCm: number): CharacterDefinition[] {
  return CHARACTER_DEFINITIONS.filter((c) => c.unlock_height_cm <= heightCm);
}
