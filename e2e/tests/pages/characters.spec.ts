import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

test.describe("캐릭터 페이지", () => {
  test("캐릭터 도감 페이지가 로딩된다", async ({ page }) => {
    await page.goto("/characters");

    await expect(page.getByText(UI_TEXT.charactersHeader)).toBeVisible({
      timeout: 15000,
    });
  });
});
