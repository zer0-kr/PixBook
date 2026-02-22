"use client";

import { PixelCard } from "@/components/ui";

interface GenreBreakdownProps {
  /** Array of { category: string, count: number } sorted descending */
  data: { category: string; count: number }[];
}

const BAR_COLORS = [
  "bg-pixel-green",
  "bg-pixel-blue",
  "bg-pixel-purple",
  "bg-pixel-orange",
  "bg-pixel-pink",
  "bg-pixel-teal",
  "bg-pixel-yellow",
  "bg-pixel-red",
];

export default function GenreBreakdown({ data }: GenreBreakdownProps) {
  if (data.length === 0) {
    return (
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">장르별 분포</h3>
        <p className="text-sm text-brown-lighter text-center py-4">
          아직 완독한 책이 없습니다
        </p>
      </PixelCard>
    );
  }

  // Show top 7 categories + "기타" for the rest
  const MAX_CATEGORIES = 7;
  let displayData: { category: string; count: number }[];

  if (data.length > MAX_CATEGORIES) {
    const top = data.slice(0, MAX_CATEGORIES);
    const otherCount = data
      .slice(MAX_CATEGORIES)
      .reduce((sum, d) => sum + d.count, 0);
    displayData = [...top, { category: "기타", count: otherCount }];
  } else {
    displayData = data;
  }

  const maxCount = Math.max(...displayData.map((d) => d.count), 1);
  const total = displayData.reduce((sum, d) => sum + d.count, 0);

  return (
    <PixelCard hoverable={false}>
      <h3 className="font-pixel text-xs text-brown mb-4">장르별 분포</h3>

      <div className="space-y-2">
        {displayData.map((d, i) => {
          const widthPercent = (d.count / maxCount) * 100;
          const percentage = Math.round((d.count / total) * 100);
          const color = BAR_COLORS[i % BAR_COLORS.length];

          return (
            <div key={d.category} className="flex items-center gap-2">
              {/* Category label */}
              <span className="text-xs text-brown w-28 truncate text-right shrink-0" title={d.category}>
                {d.category}
              </span>

              {/* Bar */}
              <div className="flex-1 h-5 bg-cream-dark border-2 border-brown">
                <div
                  className={`h-full ${color} transition-all duration-300`}
                  style={{ width: `${Math.max(widthPercent, 4)}%` }}
                />
              </div>

              {/* Count & percentage */}
              <span className="text-[10px] text-brown-lighter w-14 text-right shrink-0">
                {d.count}권 ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </PixelCard>
  );
}
