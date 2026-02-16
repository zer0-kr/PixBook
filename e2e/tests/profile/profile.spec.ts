import { test, expect } from "@playwright/test";
import { cleanupTestUserData } from "../../helpers/data-factory";
import { UI_TEXT, TEST_USER, TEST_NICKNAME } from "../../helpers/test-data";

test.describe("프로필 페이지", () => {
  test.beforeEach(async () => {
    await cleanupTestUserData();
  });

  test("프로필 정보가 표시된다", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByText(UI_TEXT.nickname)).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(UI_TEXT.accountInfo)).toBeVisible();
    await expect(page.getByText(UI_TEXT.readingStats)).toBeVisible();
    await expect(page.getByText(UI_TEXT.dataExport)).toBeVisible();
    await expect(page.getByText(TEST_USER.email)).toBeVisible();
  });

  test("닉네임을 수정할 수 있다", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText(UI_TEXT.nickname)).toBeVisible({
      timeout: 15000,
    });

    // Clear and type new nickname
    const nicknameInput = page.getByPlaceholder(UI_TEXT.nicknamePlaceholder);
    await nicknameInput.clear();
    await nicknameInput.fill(TEST_NICKNAME);

    // Click save
    await page.getByRole("button", { name: UI_TEXT.save }).click();

    // Check toast
    await expect(page.getByText(UI_TEXT.nicknameSaved)).toBeVisible({
      timeout: 10000,
    });

    // Reload and verify persistence
    await page.reload();
    await expect(page.getByText(UI_TEXT.nickname)).toBeVisible({
      timeout: 15000,
    });

    await expect(
      page.getByPlaceholder(UI_TEXT.nicknamePlaceholder)
    ).toHaveValue(TEST_NICKNAME);
  });

  test("빈 닉네임으로 저장 시 에러 토스트가 표시된다", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText(UI_TEXT.nickname)).toBeVisible({
      timeout: 15000,
    });

    const nicknameInput = page.getByPlaceholder(UI_TEXT.nicknamePlaceholder);
    await nicknameInput.clear();

    await page.getByRole("button", { name: UI_TEXT.save }).click();

    await expect(page.getByText(UI_TEXT.nicknameEmpty)).toBeVisible({
      timeout: 10000,
    });
  });

  test("CSV 다운로드 요청이 정상 응답을 반환한다", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText(UI_TEXT.dataExport)).toBeVisible({
      timeout: 15000,
    });

    // Use fetch via page.evaluate to test the export endpoint with auth cookies
    const response = await page.evaluate(async () => {
      const res = await fetch("/api/export?format=csv");
      return { status: res.status, contentType: res.headers.get("content-type") };
    });

    expect(response.status).toBe(200);
    expect(response.contentType).toContain("text/csv");
  });

  test("JSON 다운로드 요청이 정상 응답을 반환한다", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText(UI_TEXT.dataExport)).toBeVisible({
      timeout: 15000,
    });

    const response = await page.evaluate(async () => {
      const res = await fetch("/api/export?format=json");
      return { status: res.status, contentType: res.headers.get("content-type") };
    });

    expect(response.status).toBe(200);
    expect(response.contentType).toContain("application/json");
  });
});
