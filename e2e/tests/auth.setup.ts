import { test as setup, expect } from "@playwright/test";
import path from "path";
import { TEST_USER } from "../helpers/test-data";

const AUTH_FILE = path.resolve(__dirname, "../.auth/user.json");

setup("authenticate test user", async ({ page }) => {
  await page.goto("/login");

  // Fill login form
  await page.getByPlaceholder("email@example.com").fill(TEST_USER.email);
  await page.getByPlaceholder("********").fill(TEST_USER.password);
  await page.getByRole("button", { name: "로그인", exact: true }).click();

  // Wait for redirect to /library
  await expect(page).toHaveURL(/\/library/, { timeout: 15000 });

  // Save authentication state
  await page.context().storageState({ path: AUTH_FILE });
});
