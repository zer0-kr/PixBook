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

    test("책 목록이 탭 카운트와 함께 표시된다", async ({ page }) => {
      await page.goto("/library");

      await expect(page.getByText("전체 (2)")).toBeVisible({ timeout: 15000 });
      await expect(page.getByText("읽고싶은 (1)")).toBeVisible();
      await expect(page.getByText("읽는중 (1)")).toBeVisible();
    });

    test("탭으로 필터링할 수 있다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("전체 (2)")).toBeVisible({ timeout: 15000 });

      await page.getByText("읽고싶은 (1)").click();

      // Should show 1 book
      await expect(page.getByText("1권")).toBeVisible();
    });

    test("빈 탭 메시지가 표시된다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("전체 (2)")).toBeVisible({ timeout: 15000 });

      await page.getByText("완독 (0)").click();

      await expect(page.getByText(UI_TEXT.emptyTab)).toBeVisible();
    });

    test("정렬을 변경할 수 있다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("전체 (2)")).toBeVisible({ timeout: 15000 });

      const sortSelect = page.locator("select");
      await sortSelect.selectOption("title");
    });

    test("책 카드 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
      await page.goto("/library");
      await expect(page.getByText("전체 (2)")).toBeVisible({ timeout: 15000 });

      // Click the first book card link
      const bookCard = page.locator("a[href*='/book/']").first();
      await expect(bookCard).toBeVisible();
      await bookCard.click();

      await expect(page).toHaveURL(/\/book\//, { timeout: 10000 });
    });
  });
});
