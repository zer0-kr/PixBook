"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PixelCard, PixelProgressBar, PixelBadge, PixelModal } from "@/components/ui";
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
}

export default function CharacterPageView({
  characters,
  userCharacters: initialUserCharacters,
  profile,
  pendingUnlock,
}: CharacterPageViewProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [userCharacters, setUserCharacters] = useState(initialUserCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!pendingUnlock) return;
    let cancelled = false;
    unlockPendingCharactersAction().then((result) => {
      if (cancelled || !result) return;
      setUserCharacters(result);
      router.refresh();
    });
    return () => { cancelled = true; };
  }, [pendingUnlock, router]);

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
            onClick={() => setSelectedCharacter(character)}
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

      {/* Character detail modal */}
      {selectedCharacter && (
        <PixelModal
          isOpen
          onClose={() => setSelectedCharacter(null)}
          title={unlockedIds.has(selectedCharacter.id) ? selectedCharacter.name : "???"}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Sprite */}
            <div className="relative h-32 w-32 overflow-hidden border-3 border-brown bg-cream-dark">
              {unlockedIds.has(selectedCharacter.id) ? (
                <Image
                  src={selectedCharacter.sprite_url}
                  alt={selectedCharacter.name}
                  fill
                  unoptimized
                  className="pixel-art object-contain p-2"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-brown/40">
                  <span className="font-pixel text-3xl text-white/80">?</span>
                </div>
              )}
            </div>

            {/* Rarity badge */}
            <PixelBadge variant={selectedCharacter.rarity}>
              {selectedCharacter.rarity === "common" ? "일반" : selectedCharacter.rarity === "rare" ? "레어" : selectedCharacter.rarity === "epic" ? "에픽" : "전설"}
            </PixelBadge>

            {/* Description */}
            {unlockedIds.has(selectedCharacter.id) && (
              <p className="text-center text-sm text-brown-lighter">
                {selectedCharacter.description}
              </p>
            )}

            {/* Unlock height */}
            <div className="w-full border-t-3 border-brown pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brown">해금 높이</span>
                <span className="font-pixel text-sm text-brown">
                  {formatHeight(selectedCharacter.unlock_height_cm)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-bold text-brown">상태</span>
                <span className={`text-xs font-bold ${unlockedIds.has(selectedCharacter.id) ? "text-pixel-green" : "text-brown-lighter"}`}>
                  {unlockedIds.has(selectedCharacter.id) ? "해금 완료" : "미해금"}
                </span>
              </div>
            </div>
          </div>
        </PixelModal>
      )}
    </div>
  );
}
