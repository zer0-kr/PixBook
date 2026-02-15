"use client";

import { PixelCard } from "@/components/ui";
import { formatHeight } from "@/lib/tower/calculator";

interface YearSummaryProps {
  totalBooksCompleted: number;
  totalPagesRead: number;
  towerHeightCm: number;
  averageBooksPerMonth: number;
}

const stats = [
  {
    key: "books",
    icon: "📚",
    label: "올해 완독",
    format: (v: number) => `${v}권`,
  },
  {
    key: "pages",
    icon: "📄",
    label: "총 읽은 페이지",
    format: (v: number) => `${v.toLocaleString()}p`,
  },
  {
    key: "height",
    icon: "🏗️",
    label: "탑 높이 성장",
    format: (v: number) => formatHeight(v),
  },
  {
    key: "avg",
    icon: "📊",
    label: "월평균 독서량",
    format: (v: number) => `${v}권`,
  },
] as const;

type StatKey = (typeof stats)[number]["key"];

export default function YearSummary({
  totalBooksCompleted,
  totalPagesRead,
  towerHeightCm,
  averageBooksPerMonth,
}: YearSummaryProps) {
  const values: Record<StatKey, number> = {
    books: totalBooksCompleted,
    pages: totalPagesRead,
    height: towerHeightCm,
    avg: averageBooksPerMonth,
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <PixelCard key={stat.key} hoverable={false} className="text-center">
          <div className="text-2xl mb-1">{stat.icon}</div>
          <div className="font-pixel text-lg text-pixel-green mb-1">
            {stat.format(values[stat.key])}
          </div>
          <div className="text-xs text-brown-lighter">{stat.label}</div>
        </PixelCard>
      ))}
    </div>
  );
}
