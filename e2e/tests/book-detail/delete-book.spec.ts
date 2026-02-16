import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  ensureBookExists,
  addBookToLibrary,
} from "../../helpers/data-factory";
import { UI_TEXT, TEST_BOOK } from "../../helpers/test-data";

test.describe("책 삭제", () => {
  let userBookId: string;

  test.beforeEach(async () => {
    await cleanupTestUserData();
    const bookId = await ensureBookExists(TEST_BOOK);
    userBookId = await addBookToLibrary(bookId);
  });

  test("책을 삭제하면 /library로 리다이렉트된다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(
      page.getByRole("button", { name: UI_TEXT.deleteFromLibrary })
    ).toBeVisible({ timeout: 15000 });

    // Click "서재에서 삭제"
    await page
      .getByRole("button", { name: UI_TEXT.deleteFromLibrary })
      .click();

    // Modal should appear with title "책 삭제"
    await expect(page.getByText(UI_TEXT.deleteBookTitle)).toBeVisible();

    // Click "삭제" in modal
    await page
      .getByRole("button", { name: UI_TEXT.delete })
      .last()
      .click();

    // Should redirect to /library
    await expect(page).toHaveURL(/\/library/, { timeout: 10000 });

    // Toast should appear
    await expect(page.getByText(UI_TEXT.deletedFromLibrary)).toBeVisible({
      timeout: 10000,
    });
  });

  test("삭제 취소 시 모달이 닫히고 현재 페이지가 유지된다", async ({
    page,
  }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(
      page.getByRole("button", { name: UI_TEXT.deleteFromLibrary })
    ).toBeVisible({ timeout: 15000 });

    // Click "서재에서 삭제"
    await page
      .getByRole("button", { name: UI_TEXT.deleteFromLibrary })
      .click();

    // Modal should appear
    await expect(page.getByText(UI_TEXT.deleteBookTitle)).toBeVisible();

    // Click "취소"
    await page.getByRole("button", { name: UI_TEXT.cancel }).click();

    // Modal should close
    await expect(page.getByText(UI_TEXT.deleteBookTitle)).not.toBeVisible();

    // Should stay on book detail page
    await expect(page).toHaveURL(/\/book\//, { timeout: 5000 });
  });
});
