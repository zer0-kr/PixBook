"use client";

import { PixelCard } from "@/components/ui";

interface MonthlyChartProps {
  /** Array of { month: "YYYY-MM", count: number } for the last 12 months */
  data: { month: string; count: number }[];
}

const MONTH_LABELS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export default function MonthlyChart({ data }: MonthlyChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  // Y-axis labels: 0, ceil(max/2), max
  const yLabels = [maxCount, Math.ceil(maxCount / 2), 0];

  return (
    <PixelCard hoverable={false}>
      <h3 className="font-pixel text-xs text-brown mb-4">월별 완독 수</h3>

      <div className="flex items-end gap-1">
        {/* Y-axis */}
        <div className="flex flex-col justify-between h-40 pr-2 text-[10px] text-brown-lighter">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end gap-1 h-40">
          {data.map((d) => {
            const heightPercent = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
            const monthIndex = parseInt(d.month.split("-")[1], 10) - 1;
            const label = MONTH_LABELS[monthIndex] ?? d.month;

            return (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center justify-end h-full"
              >
                {/* Count label above bar */}
                {d.count > 0 && (
                  <span className="text-[10px] font-bold text-pixel-green mb-1">
                    {d.count}
                  </span>
                )}
                {/* Bar */}
                <div
                  className="w-full bg-pixel-green border-2 border-brown transition-all duration-300"
                  style={{
                    height: `${Math.max(heightPercent, d.count > 0 ? 8 : 2)}%`,
                    minHeight: d.count > 0 ? "4px" : "2px",
                  }}
                />
                {/* Month label */}
                <span className="text-[9px] text-brown-lighter mt-1 whitespace-nowrap">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </PixelCard>
  );
}
