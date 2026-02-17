import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  ensureBookExists,
  addBookToLibrary,
} from "../../helpers/data-factory";
import { UI_TEXT, TEST_BOOK, TEST_BOOK_2 } from "../../helpers/test-data";

test.describe("서재 페이지", () => {
  test("빈 서재 시 안내 문구가 표시된다", async ({ page }) => {
    await cleanupTestUserData();
    await page.goto("/library");

    await expect(page.getByText(UI_TEXT.emptyLibrary)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(UI_TEXT.goToSearch)).toBeVisible();
  });

  test.describe("책이 있는 서재", () => {
    test.beforeEach(async () => {
      await cleanupTestUserData();

      // Seed 2 books with different statuses
      const bookId1 = await ensureBookExists(TEST_BOOK);
      const bookId2 = await ensureBookExists(TEST_BOOK_2);
      await addBookToLibrary(bookId1, { reading_status: "want_to_read" });
      await addBookToLibrary(bookId2, { reading_status: "reading" });
    });

    test("책 목록이 탭과 함께 표시된다", async ({ page }) => {
      await page.goto("/library");

      // Wait for books to load (count shown as separate text)
      await expect(page.getByText("2권")).toBeVisible({ timeout: 15000 });

      // Tabs should be visible
      await expect(page.getByRole("tab", { name: UI_TEXT.tabAll })).toBeVisible();
      await expect(page.getByRole("tab", { name: UI_TEXT.tabWantToRead })).toBeVisible();
      await expect(page.getByRole("tab", { name: UI_TEXT.tabReading })).toBeVisible();
    });

    test("탭으로 필터링할 수 있다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("2권")).toBeVisible({ timeout: 15000 });

      await page.getByRole("tab", { name: UI_TEXT.tabWantToRead }).click();

      // Should show 1 book
      await expect(page.getByText("1권")).toBeVisible();
    });

    test("빈 탭 메시지가 표시된다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("2권")).toBeVisible({ timeout: 15000 });

      await page.getByRole("tab", { name: UI_TEXT.tabCompleted }).click();

      await expect(page.getByText(UI_TEXT.emptyTab)).toBeVisible();
    });

    test("정렬을 변경할 수 있다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("2권")).toBeVisible({ timeout: 15000 });

      const sortSelect = page.locator("select");
      await sortSelect.selectOption("title");
    });

    test("뷰 모드를 전환할 수 있다 (그리드→리스트→커버)", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("2권")).toBeVisible({ timeout: 15000 });

      // Grid view button should be active by default (has bg-pixel-blue)
      const gridBtn = page.getByLabel(UI_TEXT.viewModeGrid);
      const listBtn = page.getByLabel(UI_TEXT.viewModeList);
      const coverBtn = page.getByLabel(UI_TEXT.viewModeCover);

      await expect(gridBtn).toBeVisible();
      await expect(gridBtn).toHaveClass(/bg-pixel-blue/);

      // Switch to list view
      await listBtn.click();
      await expect(listBtn).toHaveClass(/bg-pixel-blue/);
      // List layout uses flex-col (use .first() to avoid matching toast container)
      await expect(page.locator("main .flex.flex-col.gap-2").first()).toBeVisible();
      // Books should still be visible as links
      await expect(page.locator("a[href*='/book/']").first()).toBeVisible();

      // Switch to cover view
      await coverBtn.click();
      await expect(coverBtn).toHaveClass(/bg-pixel-blue/);
      // Cover layout uses grid-cols-2
      await expect(page.locator(".grid.grid-cols-2")).toBeVisible();
      await expect(page.locator("a[href*='/book/']").first()).toBeVisible();
    });

    test("책 카드 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("2권")).toBeVisible({ timeout: 15000 });

      // Click the first book card link
      const bookCard = page.locator("a[href*='/book/']").first();
      await expect(bookCard).toBeVisible();
      await bookCard.click();

      await expect(page).toHaveURL(/\/book\//, { timeout: 10000 });
    });
  });
});
