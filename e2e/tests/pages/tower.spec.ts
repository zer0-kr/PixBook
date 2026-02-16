import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  addCompletedBook,
} from "../../helpers/data-factory";
import { UI_TEXT, TEST_BOOK, TEST_BOOK_2 } from "../../helpers/test-data";

test.describe("타워 페이지", () => {
  test("타워 페이지가 로딩된다", async ({ page }) => {
    await page.goto("/tower");

    await expect(
      page.getByRole("heading", { name: UI_TEXT.towerHeader })
    ).toBeVisible({
      timeout: 15000,
    });
  });

  test("완독한 책이 있으면 타워에 책등이 표시된다", async ({ page }) => {
    await cleanupTestUserData();
    await addCompletedBook(TEST_BOOK, { spine_color: "#E74C3C" });
    await addCompletedBook(TEST_BOOK_2, { spine_color: "#3498DB" });

    await page.goto("/tower");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.towerHeader })
    ).toBeVisible({ timeout: 15000 });

    // Tower stats sidebar should show completed books
    await expect(page.getByText(UI_TEXT.towerStats)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("2권")).toBeVisible();

    // Empty message should NOT be visible
    await expect(page.getByText(UI_TEXT.towerEmpty)).not.toBeVisible();

    await cleanupTestUserData();
  });

  test("줌 컨트롤이 동작한다", async ({ page }) => {
    await page.goto("/tower");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.towerHeader })
    ).toBeVisible({ timeout: 15000 });

    // Initial zoom should be 100%
    await expect(page.getByText("100%")).toBeVisible({ timeout: 5000 });

    // Click zoom in
    await page.getByRole("button", { name: "+" }).click();
    // Zoom should increase (no longer 100%)
    await expect(page.getByText("100%")).not.toBeVisible({ timeout: 5000 });

    // Click zoom out twice to go below 100%
    await page.getByRole("button", { name: "-" }).click();
    await page.getByRole("button", { name: "-" }).click();
    // Should show a value less than 100%
    await expect(page.getByText("100%")).not.toBeVisible({ timeout: 5000 });
  });

  test("완독 책이 없으면 안내 문구가 표시된다", async ({ page }) => {
    await cleanupTestUserData();

    await page.goto("/tower");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.towerHeader })
    ).toBeVisible({ timeout: 15000 });

    await expect(page.getByText(UI_TEXT.towerEmpty)).toBeVisible({
      timeout: 10000,
    });
  });
});
