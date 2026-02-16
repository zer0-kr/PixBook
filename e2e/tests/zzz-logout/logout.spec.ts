import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

// This file is in zzz-logout/ to ensure it runs LAST (alphabetical order)
// since the logout action invalidates the session.
test.describe("로그아웃", () => {
  test("로그아웃하면 /login으로 리다이렉트된다", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText(UI_TEXT.nickname)).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole("button", { name: UI_TEXT.logout }).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
