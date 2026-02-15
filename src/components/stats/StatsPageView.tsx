"use client";

import YearSummary from "./YearSummary";
import MonthlyChart from "./MonthlyChart";
import ReadingCalendar from "./ReadingCalendar";
import GenreBreakdown from "./GenreBreakdown";

interface StatsPageViewProps {
  totalBooksCompleted: number;
  totalPagesRead: number;
  towerHeightCm: number;
  averageBooksPerMonth: number;
  monthlyData: { month: string; count: number }[];
  calendarSessions: { date: string; pages: number }[];
  genreData: { category: string; count: number }[];
  currentYear: number;
}

export default function StatsPageView({
  totalBooksCompleted,
  totalPagesRead,
  towerHeightCm,
  averageBooksPerMonth,
  monthlyData,
  calendarSessions,
  genreData,
  currentYear,
}: StatsPageViewProps) {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Year Summary */}
      <YearSummary
        totalBooksCompleted={totalBooksCompleted}
        totalPagesRead={totalPagesRead}
        towerHeightCm={towerHeightCm}
        averageBooksPerMonth={averageBooksPerMonth}
      />

      {/* Monthly Completed Books Chart */}
      <MonthlyChart data={monthlyData} />

      {/* Reading Calendar Heatmap */}
      <ReadingCalendar sessions={calendarSessions} year={currentYear} />

      {/* Genre Breakdown */}
      <GenreBreakdown data={genreData} />
    </div>
  );
}
