import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

test.describe("페이지 네비게이션", () => {
  test("서재에서 다른 메뉴로 이동할 수 있다", async ({ page }) => {
    await page.goto("/library");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.libraryHeader })
    ).toBeVisible({ timeout: 15000 });

    // Navigate to Tower via sidebar
    await page.getByRole("link", { name: UI_TEXT.navTower }).first().click();
    await expect(page).toHaveURL(/\/tower/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: UI_TEXT.towerHeader })
    ).toBeVisible({ timeout: 10000 });

    // Navigate to Characters
    await page.getByRole("link", { name: UI_TEXT.navCharacters }).first().click();
    await expect(page).toHaveURL(/\/characters/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: UI_TEXT.charactersHeader })
    ).toBeVisible({ timeout: 10000 });

    // Navigate to Stats
    await page.getByRole("link", { name: UI_TEXT.navStats }).first().click();
    await expect(page).toHaveURL(/\/stats/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: UI_TEXT.statsHeader })
    ).toBeVisible({ timeout: 10000 });

    // Navigate to Profile
    await page.getByRole("link", { name: UI_TEXT.navProfile }).first().click();
    await expect(page).toHaveURL(/\/profile/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: UI_TEXT.profileHeader })
    ).toBeVisible({ timeout: 10000 });
  });

  test("모든 주요 페이지가 로딩된다", async ({ page }) => {
    const pages = [
      { path: "/library", heading: UI_TEXT.libraryHeader },
      { path: "/tower", heading: UI_TEXT.towerHeader },
      { path: "/characters", heading: UI_TEXT.charactersHeader },
      { path: "/stats", heading: UI_TEXT.statsHeader },
      { path: "/profile", heading: UI_TEXT.profileHeader },
    ];

    for (const p of pages) {
      await page.goto(p.path);
      await expect(
        page.getByRole("heading", { name: p.heading })
      ).toBeVisible({ timeout: 15000 });
    }
  });
});
