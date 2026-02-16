"use client";

import type { Character } from "@/types";
import { formatHeight } from "@/lib/tower/calculator";
import { getNextMilestone } from "@/lib/tower/constants";
import PixelCard from "@/components/ui/PixelCard";
import PixelProgressBar from "@/components/ui/PixelProgressBar";

interface TowerStatsProps {
  totalHeightCm: number;
  totalBooksCompleted: number;
  totalPagesRead: number;
  activeCharacter: Character | null;
  selectedYear: number | "all";
}

export default function TowerStats({
  totalHeightCm,
  totalBooksCompleted,
  totalPagesRead,
  activeCharacter,
  selectedYear,
}: TowerStatsProps) {
  const nextMilestone = getNextMilestone(totalHeightCm);

  return (
    <PixelCard className="flex flex-col gap-4" hoverable={false}>
      <h2 className="font-pixel text-[10px] text-brown">
        {selectedYear === "all" ? "타워 통계" : `${selectedYear}년 통계`}
      </h2>

      {/* Stat rows */}
      <div className="grid grid-cols-2 gap-3">
        <StatItem label="총 높이" value={formatHeight(totalHeightCm)} />
        <StatItem label="완독 수" value={`${totalBooksCompleted}권`} />
        <StatItem label="읽은 페이지" value={`${totalPagesRead.toLocaleString()}p`} />
        <StatItem
          label="활성 캐릭터"
          value={activeCharacter?.name ?? "없음"}
        />
      </div>

      {/* Next milestone progress */}
      {nextMilestone ? (
        <div>
          <p className="mb-1 text-xs font-bold text-brown">
            다음 목표: {nextMilestone.label}
          </p>
          <PixelProgressBar
            value={Math.round(totalHeightCm)}
            maxValue={nextMilestone.height_cm}
            label={`${formatHeight(totalHeightCm)} / ${formatHeight(nextMilestone.height_cm)}`}
            color="bg-pixel-green"
          />
        </div>
      ) : (
        <p className="text-xs font-bold text-pixel-gold">
          모든 마일스톤을 달성했어요!
        </p>
      )}
    </PixelCard>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-brown-lighter">{label}</span>
      <span className="text-sm font-bold text-brown">{value}</span>
    </div>
  );
}
