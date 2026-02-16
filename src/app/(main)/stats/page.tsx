import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { StatsPageView } from "@/components/stats";
import type { Profile, UserBook, ReadingSession } from "@/types";

export const metadata = {
  title: "통계 | 픽북",
  description: "월별 완독 수, 장르 분포, 독서 캘린더로 나의 독서 현황을 한눈에 확인하세요.",
};

export default async function StatsPage() {
  const supabase = await createClient();

  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01`;
  const yearEnd = `${currentYear}-12-31`;

  // Fetch getUser, profile, completed books, and reading sessions in parallel
  const [user, { data: profileData }, { data: completedThisYear }, { data: sessionsData }] =
    await Promise.all([
      getUser(),
      supabase.from("profiles").select("*").single(),
      supabase
        .from("user_books")
        .select("*, book:books(*)")
        .eq("reading_status", "completed")
        .gte("end_date", yearStart)
        .lte("end_date", yearEnd),
      supabase
        .from("reading_sessions")
        .select("*")
        .gte("date", yearStart)
        .lte("date", yearEnd),
    ]);

  if (!user) {
    redirect("/login");
  }

  const profile = profileData as Profile | null;

  const completedBooks: UserBook[] = (completedThisYear ?? []).map((row) => ({
    ...row,
    book: row.book ?? undefined,
  }));

  const sessions: ReadingSession[] = sessionsData ?? [];

  // Calculate stats
  const totalBooksCompleted = completedBooks.length;
  const totalPagesRead = completedBooks.reduce(
    (sum, ub) => sum + (ub.book?.page_count ?? 0),
    0
  );
  const towerHeightCm = profile?.tower_height_cm ?? 0;

  // Average books per month (based on current month number)
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const averageBooksPerMonth =
    currentMonth > 0
      ? Math.round((totalBooksCompleted / currentMonth) * 10) / 10
      : 0;

  // Build monthly data for bar chart (last 12 months)
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

  // Build calendar sessions data
  const calendarSessions = sessions.map((s) => ({
    date: s.date,
    pages: s.pages_read,
  }));

  // Build genre breakdown
  const genreMap = new Map<string, number>();
  for (const ub of completedBooks) {
    const category = ub.book?.category ?? "미분류";
    genreMap.set(category, (genreMap.get(category) ?? 0) + 1);
  }
  const genreData = Array.from(genreMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <Header title="통계" />
      <StatsPageView
        totalBooksCompleted={totalBooksCompleted}
        totalPagesRead={totalPagesRead}
        towerHeightCm={towerHeightCm}
        averageBooksPerMonth={averageBooksPerMonth}
        monthlyData={monthlyData}
        calendarSessions={calendarSessions}
        genreData={genreData}
        currentYear={currentYear}
      />
    </>
  );
}
