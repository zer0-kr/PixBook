import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

test.describe("통계 페이지", () => {
  test("통계 페이지가 로딩되고 현재 연도가 표시된다", async ({ page }) => {
    await page.goto("/stats");

    await expect(
      page.getByRole("heading", { name: UI_TEXT.statsHeader })
    ).toBeVisible({
      timeout: 15000,
    });

    const currentYear = new Date().getFullYear().toString();
    await expect(page.getByText(currentYear).first()).toBeVisible();
  });
});
