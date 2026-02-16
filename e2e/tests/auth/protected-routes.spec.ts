import { test, expect } from "@playwright/test";

test.describe("비인증 사용자 보호 라우트", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  const protectedRoutes = [
    "/library",
    "/search",
    "/tower",
    "/characters",
    "/stats",
    "/profile",
  ];

  for (const route of protectedRoutes) {
    test(`${route} → 비인증 시 /login으로 리다이렉트`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
  }
});

test.describe("인증 사용자 auth 페이지 리다이렉트", () => {
  // Uses default storageState (authenticated) from config

  const authRoutes = ["/login", "/signup"];

  for (const route of authRoutes) {
    test(`${route} → 인증 시 /library로 리다이렉트`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/library/, { timeout: 10000 });
    });
  }
});
