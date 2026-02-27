import {
  getProfile,
  getCompletedBooksForYear,
  getReadingSessionsForYear,
} from "./_queries";
import {
  YearSummary,
  MonthlyChart,
  ReadingCalendar,
  GenreBreakdown,
} from "@/components/stats";

interface SectionProps {
  currentYear: number;
}

/* ── Year Summary (profile + completedBooks) ────────────────────── */

export async function YearSummarySection({ currentYear }: SectionProps) {
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  const [profile, completedBooks] = await Promise.all([
    getProfile(),
    getCompletedBooksForYear(yearStart, yearEnd),
  ]);

  const totalBooksCompleted = completedBooks.length;
  const totalPagesRead = completedBooks.reduce(
    (sum, ub) => sum + (ub.book?.page_count ?? 0),
    0
  );
  const towerHeightCm = profile?.tower_height_cm ?? 0;
  const currentMonth = new Date().getMonth() + 1;
  const averageBooksPerMonth =
    currentMonth > 0
      ? Math.round((totalBooksCompleted / currentMonth) * 10) / 10
      : 0;

  return (
    <YearSummary
      totalBooksCompleted={totalBooksCompleted}
      totalPagesRead={totalPagesRead}
      towerHeightCm={towerHeightCm}
      averageBooksPerMonth={averageBooksPerMonth}
    />
  );
}

/* ── Monthly Chart (completedBooks) ─────────────────────────────── */

export async function MonthlyChartSection({ currentYear }: SectionProps) {
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  const completedBooks = await getCompletedBooksForYear(yearStart, yearEnd);

  const monthlyData: { month: string; count: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const count = completedBooks.filter((ub) => {
      if (!ub.end_date) return false;
      return ub.end_date.startsWith(monthStr);
    }).length;
    monthlyData.push({ month: monthStr, count });
  }

  return <MonthlyChart data={monthlyData} />;
}

/* ── Reading Calendar (completedBooks + sessions) ───────────────── */

export async function CalendarSection({ currentYear }: SectionProps) {
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  const [completedBooks, sessions] = await Promise.all([
    getCompletedBooksForYear(yearStart, yearEnd),
    getReadingSessionsForYear(yearStart, yearEnd),
  ]);

  const calendarSessions = [
    ...sessions.map((s) => ({ date: s.date, pages: s.pages_read })),
    ...completedBooks
      .filter((ub) => ub.end_date)
      .map((ub) => ({ date: ub.end_date!, pages: ub.book?.page_count ?? 0 })),
  ];

  return <ReadingCalendar sessions={calendarSessions} year={currentYear} />;
}

/* ── Genre Breakdown (completedBooks) ───────────────────────────── */

export async function GenreSection({ currentYear }: SectionProps) {
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  const completedBooks = await getCompletedBooksForYear(yearStart, yearEnd);

  const genreMap = new Map<string, number>();
  for (const ub of completedBooks) {
    const category = ub.book?.category ?? "미분류";
    genreMap.set(category, (genreMap.get(category) ?? 0) + 1);
  }
  const genreData = Array.from(genreMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return <GenreBreakdown data={genreData} />;
}
