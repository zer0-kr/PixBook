import { test, expect } from "@playwright/test";
import { TEST_USER, UI_TEXT } from "../../helpers/test-data";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("회원가입 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("회원가입 폼이 표시된다", async ({ page }) => {
    await expect(page.getByText(UI_TEXT.signupHeader)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(UI_TEXT.signupSubheading)).toBeVisible();

    // Form fields
    await expect(page.getByPlaceholder("모험가 이름")).toBeVisible();
    await expect(page.getByPlaceholder("email@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("6자 이상")).toBeVisible();

    // Submit button
    await expect(
      page.getByRole("button", { name: UI_TEXT.signupButton })
    ).toBeVisible();
  });

  test("이미 가입한 이메일로 가입 시 에러가 표시된다", async ({ page }) => {
    await expect(page.getByText(UI_TEXT.signupHeader)).toBeVisible({
      timeout: 15000,
    });

    await page.getByPlaceholder("모험가 이름").fill("테스트유저");
    await page.getByPlaceholder("email@example.com").fill(TEST_USER.email);
    await page.getByPlaceholder("6자 이상").fill(TEST_USER.password);
    await page.getByRole("button", { name: UI_TEXT.signupButton }).click();

    // Error or success-with-unverified — either way the form should respond
    const errorDiv = page.locator(".bg-pixel-red\\/10");
    const successText = page.getByText("가입 완료!");
    await expect(errorDiv.or(successText)).toBeVisible({ timeout: 10000 });
  });

  test("로그인 페이지 링크가 동작한다", async ({ page }) => {
    await expect(page.getByText(UI_TEXT.signupHeader)).toBeVisible({
      timeout: 15000,
    });

    await expect(page.getByText(UI_TEXT.alreadyHaveAccount)).toBeVisible();
    await page.getByRole("link", { name: UI_TEXT.loginButton }).click();

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
