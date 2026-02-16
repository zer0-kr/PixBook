import { test, expect } from "@playwright/test";
import { cleanupTestUserData } from "../../helpers/data-factory";
import { UI_TEXT } from "../../helpers/test-data";

test.describe("책 검색", () => {
  test.beforeEach(async () => {
    await cleanupTestUserData();
  });

  test("검색 페이지가 표시된다", async ({ page }) => {
    await page.goto("/search");

    await expect(
      page.getByRole("heading", { name: UI_TEXT.searchHeader })
    ).toBeVisible({
      timeout: 15000,
    });
    await expect(
      page.getByPlaceholder(UI_TEXT.searchPlaceholder)
    ).toBeVisible();
  });

  test("검색 실행 시 결과가 표시된다", async ({ page }) => {
    await page.goto("/search");
    await expect(
      page.getByPlaceholder(UI_TEXT.searchPlaceholder)
    ).toBeVisible({ timeout: 15000 });

    const searchInput = page.getByPlaceholder(UI_TEXT.searchPlaceholder);
    await searchInput.fill("클린 코드");
    await searchInput.press("Enter");

    // Wait for search results (API may be slow)
    await expect(
      page.locator(".pixel-card-static").first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("책을 서재에 추가할 수 있다", async ({ page }) => {
    await page.goto("/search");
    await expect(
      page.getByPlaceholder(UI_TEXT.searchPlaceholder)
    ).toBeVisible({ timeout: 15000 });

    const searchInput = page.getByPlaceholder(UI_TEXT.searchPlaceholder);
    await searchInput.fill("클린 코드");
    await searchInput.press("Enter");

    // Wait for results
    const firstResult = page.locator(".pixel-card-static").first();
    await expect(firstResult).toBeVisible({ timeout: 15000 });

    // Click to expand
    await firstResult.click();

    // Click "서재에 추가"
    await page
      .getByRole("button", { name: UI_TEXT.addToLibrary })
      .first()
      .click();

    // Check toast
    await expect(page.getByText(UI_TEXT.addedToLibrary)).toBeVisible({
      timeout: 10000,
    });

    // Check badge appears
    await expect(page.getByText(UI_TEXT.inLibrary).first()).toBeVisible();
  });
});
