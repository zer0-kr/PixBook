import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Google OAuth 로그인", () => {
  test("Google 로그인 버튼이 표시된다", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText(UI_TEXT.loginHeader)).toBeVisible({
      timeout: 15000,
    });

    const googleButton = page.getByRole("button", {
      name: UI_TEXT.googleLoginButton,
    });
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });

  test("Google 로그인 버튼 클릭 시 OAuth URL로 리다이렉트된다", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.getByText(UI_TEXT.loginHeader)).toBeVisible({
      timeout: 15000,
    });

    // Click Google login and wait for navigation to OAuth endpoint
    await page.getByRole("button", { name: UI_TEXT.googleLoginButton }).click();

    await page.waitForURL(/supabase\.co\/auth\/v1\/authorize|accounts\.google\.com/, {
      timeout: 15000,
    });

    const url = page.url();
    // Should redirect to Supabase auth endpoint with Google provider
    expect(
      url.includes("supabase.co/auth/v1/authorize") ||
        url.includes("accounts.google.com")
    ).toBeTruthy();
  });

  test("OAuth 콜백에 code 없이 접근하면 /login으로 리다이렉트된다", async ({
    page,
  }) => {
    await page.goto("/callback");

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("OAuth 콜백에 잘못된 code로 접근하면 /login으로 리다이렉트된다", async ({
    page,
  }) => {
    await page.goto("/callback?code=invalid_test_code_12345");

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
