import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  addCompletedBook,
} from "../../helpers/data-factory";
import { UI_TEXT, TEST_BOOK, TEST_BOOK_2 } from "../../helpers/test-data";

test.describe("통계 페이지", () => {
  test("통계 페이지가 로딩되고 현재 연도가 표시된다", async ({ page }) => {
    await page.goto("/stats");

    await expect(
      page.getByRole("heading", { name: UI_TEXT.statsHeader })
    ).toBeVisible({
      timeout: 15000,
    });

    const currentYear = new Date().getFullYear().toString();
    await expect(page.getByText(currentYear).first()).toBeVisible();
  });

  test("독서 데이터가 있으면 통계가 표시된다", async ({ page }) => {
    await cleanupTestUserData();
    await addCompletedBook(TEST_BOOK, {
      start_date: "2026-01-10",
      end_date: "2026-01-25",
    });
    await addCompletedBook(TEST_BOOK_2, {
      start_date: "2026-02-01",
      end_date: "2026-02-15",
    });

    await page.goto("/stats");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.statsHeader })
    ).toBeVisible({ timeout: 15000 });

    // Year summary cards should show data
    await expect(page.getByText(UI_TEXT.yearlyCompleted)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(UI_TEXT.totalPagesRead)).toBeVisible();

    // Monthly chart section
    await expect(page.getByText(UI_TEXT.monthlyChart)).toBeVisible();

    await cleanupTestUserData();
  });

  test("장르 분포가 표시된다", async ({ page }) => {
    await cleanupTestUserData();
    await addCompletedBook(TEST_BOOK, {
      start_date: "2026-01-10",
      end_date: "2026-01-25",
    });

    await page.goto("/stats");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.statsHeader })
    ).toBeVisible({ timeout: 15000 });

    // Genre breakdown section should be present
    await expect(page.getByText(UI_TEXT.genreBreakdown)).toBeVisible({
      timeout: 10000,
    });

    await cleanupTestUserData();
  });

  test("독서 캘린더가 표시된다", async ({ page }) => {
    await cleanupTestUserData();
    await addCompletedBook(TEST_BOOK, {
      start_date: "2026-01-10",
      end_date: "2026-01-25",
    });

    await page.goto("/stats");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.statsHeader })
    ).toBeVisible({ timeout: 15000 });

    // Reading calendar section
    await expect(page.getByText(UI_TEXT.readingCalendar)).toBeVisible({
      timeout: 10000,
    });

    // Calendar legend
    await expect(page.getByText("적음")).toBeVisible();
    await expect(page.getByText("많음")).toBeVisible();

    await cleanupTestUserData();
  });
});
