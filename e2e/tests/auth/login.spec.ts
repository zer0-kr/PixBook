import { test, expect } from "@playwright/test";
import { TEST_USER, UI_TEXT } from "../../helpers/test-data";

// Use empty storage state (unauthenticated)
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("로그인 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("로그인 폼이 표시된다", async ({ page }) => {
    await expect(page.getByText(UI_TEXT.loginHeader)).toBeVisible();
    await expect(page.getByPlaceholder("email@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("********")).toBeVisible();
    await expect(
      page.getByRole("button", { name: UI_TEXT.loginButton, exact: true })
    ).toBeVisible();
  });

  test("잘못된 자격증명 시 에러 메시지가 표시된다", async ({ page }) => {
    await page.getByPlaceholder("email@example.com").fill("wrong@test.com");
    await page.getByPlaceholder("********").fill("wrongpassword");
    await page.getByRole("button", { name: UI_TEXT.loginButton, exact: true }).click();

    // Error message should appear
    const errorDiv = page.locator(".bg-pixel-red\\/10");
    await expect(errorDiv).toBeVisible({ timeout: 10000 });
  });

  test("로그인 성공 시 /library로 리다이렉트된다", async ({ page }) => {
    await page.getByPlaceholder("email@example.com").fill(TEST_USER.email);
    await page.getByPlaceholder("********").fill(TEST_USER.password);
    await page.getByRole("button", { name: UI_TEXT.loginButton, exact: true }).click();

    await expect(page).toHaveURL(/\/library/, { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: UI_TEXT.libraryHeader })
    ).toBeVisible({ timeout: 10000 });
  });

  test("로그인 중 로딩 상태가 표시된다", async ({ page }) => {
    await page.getByPlaceholder("email@example.com").fill(TEST_USER.email);
    await page.getByPlaceholder("********").fill(TEST_USER.password);
    await page.getByRole("button", { name: UI_TEXT.loginButton, exact: true }).click();

    // Check loading text appears (may be brief)
    await expect(
      page.getByRole("button", { name: UI_TEXT.loginLoading })
    ).toBeVisible({ timeout: 5000 });
  });
});
