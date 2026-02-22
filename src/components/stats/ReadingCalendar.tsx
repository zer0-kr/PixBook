"use client";

import { useState, useMemo } from "react";
import { PixelCard } from "@/components/ui";
import { toDateString } from "@/lib/utils/date";

interface ReadingCalendarProps {
  /** Array of { date: "YYYY-MM-DD", pages: number } */
  sessions: { date: string; pages: number }[];
  year: number;
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
function getIntensityLevel(pages: number): number {
  if (pages === 0) return 0;
  if (pages <= 10) return 1;
  if (pages <= 30) return 2;
  if (pages <= 60) return 3;
  return 4;
}

const INTENSITY_COLORS = [
  "bg-cream-dark border-brown/20", // 0: no activity
  "bg-pixel-green/30 border-pixel-green/40", // 1: light
  "bg-pixel-green/55 border-pixel-green/60", // 2: medium
  "bg-pixel-green/80 border-pixel-green/85", // 3: heavy
  "bg-pixel-green border-green-800", // 4: very heavy
];

export default function ReadingCalendar({ sessions, year }: ReadingCalendarProps) {
  const [tooltip, setTooltip] = useState<{
    date: string;
    pages: number;
    x: number;
    y: number;
  } | null>(null);

  // Build a map from date string to total pages
  const dateMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      map.set(s.date, (map.get(s.date) ?? 0) + s.pages);
    }
    return map;
  }, [sessions]);

  // Generate all weeks for the year
  const weeks = useMemo(() => {
    const result: { date: string; pages: number; dayOfWeek: number }[][] = [];
    const startDate = new Date(year, 0, 1);
    // Adjust to Monday-based week (0=Mon, 6=Sun)
    const startDow = (startDate.getDay() + 6) % 7;

    let currentWeek: { date: string; pages: number; dayOfWeek: number }[] = [];

    // Fill empty days at the start
    for (let i = 0; i < startDow; i++) {
      currentWeek.push({ date: "", pages: 0, dayOfWeek: i });
    }

    const d = new Date(year, 0, 1);
    while (d.getFullYear() === year) {
      const dateStr = toDateString(d);
      const dow = (d.getDay() + 6) % 7;
      const pages = dateMap.get(dateStr) ?? 0;

      currentWeek.push({ date: dateStr, pages, dayOfWeek: dow });

      if (dow === 6) {
        result.push(currentWeek);
        currentWeek = [];
      }

      d.setDate(d.getDate() + 1);
    }

    // Push last incomplete week
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [year, dateMap]);

  return (
    <PixelCard hoverable={false}>
      <h3 className="font-pixel text-xs text-brown mb-4">
        {year}년 독서 캘린더
      </h3>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="flex gap-0.5">
            {/* Day of week labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className="h-[12px] w-6 flex items-center justify-end text-[9px] text-brown-lighter pr-1"
                >
                  {i % 2 === 0 ? label : ""}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const day = week.find((d) => d.dayOfWeek === dayIndex);
                  if (!day || !day.date) {
                    return (
                      <div
                        key={dayIndex}
                        className="h-[12px] w-[12px]"
                      />
                    );
                  }

                  const level = getIntensityLevel(day.pages);

                  return (
                    <div
                      key={dayIndex}
                      className={`h-[12px] w-[12px] border ${INTENSITY_COLORS[level]} cursor-pointer`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          date: day.date,
                          pages: day.pages,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-[10px] text-brown-lighter mr-1">적음</span>
            {INTENSITY_COLORS.map((color, i) => (
              <div
                key={i}
                className={`h-[12px] w-[12px] border ${color}`}
              />
            ))}
            <span className="text-[10px] text-brown-lighter ml-1">많음</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pixel-card-static px-2 py-1 text-[10px] text-brown pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-bold">{tooltip.date}</div>
          <div>{tooltip.pages > 0 ? `${tooltip.pages}페이지` : "기록 없음"}</div>
        </div>
      )}
    </PixelCard>
  );
}
