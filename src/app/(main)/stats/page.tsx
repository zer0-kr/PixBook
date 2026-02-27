import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import {
  YearSummarySection,
  MonthlyChartSection,
  CalendarSection,
  GenreSection,
} from "./_sections";
import {
  YearSummarySkeleton,
  MonthlyChartSkeleton,
  CalendarSkeleton,
  GenreSkeleton,
} from "./_skeletons";

export const metadata = {
  title: "통계 | 픽북",
  description:
    "월별 완독 수, 장르 분포, 독서 캘린더로 나의 독서 현황을 한눈에 확인하세요.",
};

export default async function StatsPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header title="통계" />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <Suspense fallback={<YearSummarySkeleton />}>
          <YearSummarySection currentYear={currentYear} />
        </Suspense>
        <Suspense fallback={<MonthlyChartSkeleton />}>
          <MonthlyChartSection currentYear={currentYear} />
        </Suspense>
        <Suspense fallback={<CalendarSkeleton />}>
          <CalendarSection currentYear={currentYear} />
        </Suspense>
        <Suspense fallback={<GenreSkeleton />}>
          <GenreSection currentYear={currentYear} />
        </Suspense>
      </div>
    </>
  );
}
