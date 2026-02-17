"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PixelCard, PixelProgressBar, PixelBadge } from "@/components/ui";
import { formatHeight } from "@/lib/tower/calculator";
import { unlockPendingCharactersAction } from "@/lib/actions/character";
import CharacterCard from "./CharacterCard";
import type { Character, UserCharacter, Profile, CharacterRarity } from "@/types";

type FilterTab = "all" | CharacterRarity;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "common", label: "일반" },
  { key: "rare", label: "레어" },
  { key: "epic", label: "에픽" },
  { key: "legendary", label: "전설" },
];

interface CharacterPageViewProps {
  characters: Character[];
  userCharacters: UserCharacter[];
  profile: Profile;
  pendingUnlock?: boolean;
  towerHeightCm?: number;
}

export default function CharacterPageView({
  characters,
  userCharacters: initialUserCharacters,
  profile,
  pendingUnlock,
  towerHeightCm,
}: CharacterPageViewProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [userCharacters, setUserCharacters] = useState(initialUserCharacters);
  const router = useRouter();

  useEffect(() => {
    if (!pendingUnlock || !towerHeightCm) return;
    let cancelled = false;
    unlockPendingCharactersAction(towerHeightCm).then((result) => {
      if (cancelled || !result) return;
      setUserCharacters(result);
      router.refresh();
    });
    return () => { cancelled = true; };
  }, [pendingUnlock, towerHeightCm, router]);

  const unlockedIds = useMemo(
    () => new Set(userCharacters.map((uc) => uc.character_id)),
    [userCharacters]
  );

  const filteredCharacters = useMemo(() => {
    if (activeTab === "all") return characters;
    return characters.filter((c) => c.rarity === activeTab);
  }, [characters, activeTab]);

  const totalUnlocked = unlockedIds.size;
  const totalCharacters = characters.length;

  // Count by rarity
  const rarityStats = useMemo(() => {
    const stats: Record<CharacterRarity, { total: number; unlocked: number }> = {
      common: { total: 0, unlocked: 0 },
      rare: { total: 0, unlocked: 0 },
      epic: { total: 0, unlocked: 0 },
      legendary: { total: 0, unlocked: 0 },
    };
    for (const c of characters) {
      stats[c.rarity].total++;
      if (unlockedIds.has(c.id)) {
        stats[c.rarity].unlocked++;
      }
    }
    return stats;
  }, [characters, unlockedIds]);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <PixelCard hoverable={false}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-brown">수집 현황</h2>
            <span className="text-xs text-brown-lighter">
              현재 탑 높이: {formatHeight(profile.tower_height_cm)}
            </span>
          </div>

          <PixelProgressBar
            value={totalUnlocked}
            maxValue={totalCharacters}
            label="전체 수집"
            color="bg-pixel-blue"
          />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["common", "rare", "epic", "legendary"] as CharacterRarity[]).map(
              (rarity) => (
                <div
                  key={rarity}
                  className="flex items-center justify-between border-2 border-brown px-2 py-1"
                >
                  <PixelBadge variant={rarity}>
                    {rarity === "common"
                      ? "일반"
                      : rarity === "rare"
                        ? "레어"
                        : rarity === "epic"
                          ? "에픽"
                          : "전설"}
                  </PixelBadge>
                  <span className="ml-2 text-xs font-bold text-brown">
                    {rarityStats[rarity].unlocked}/{rarityStats[rarity].total}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </PixelCard>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="레어리티 필터">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pixel-btn px-3 py-1.5 text-xs font-bold transition-colors ${
              activeTab === tab.key
                ? "bg-pixel-blue text-white"
                : "bg-cream-dark text-brown hover:bg-cream-dark/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Character grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isUnlocked={unlockedIds.has(character.id)}
          />
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-brown-lighter">
            이 등급의 캐릭터가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
