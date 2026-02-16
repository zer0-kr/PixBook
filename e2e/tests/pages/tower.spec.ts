import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

test.describe("타워 페이지", () => {
  test("타워 페이지가 로딩된다", async ({ page }) => {
    await page.goto("/tower");

    await expect(
      page.getByRole("heading", { name: UI_TEXT.towerHeader })
    ).toBeVisible({
      timeout: 15000,
    });
  });
});
