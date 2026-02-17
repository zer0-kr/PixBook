import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

test.describe("모바일 레이아웃", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("서재 탭이 한 줄로 균등하게 표시된다", async ({ page }) => {
    await page.goto("/library");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.libraryHeader })
    ).toBeVisible({ timeout: 15000 });

    // All 5 tabs should be visible in a single row
    const tabs = [
      UI_TEXT.tabAll,
      UI_TEXT.tabCompleted,
      UI_TEXT.tabReading,
      UI_TEXT.tabWantToRead,
      UI_TEXT.tabDropped,
    ];
    for (const label of tabs) {
      await expect(
        page.getByRole("tab", { name: label })
      ).toBeVisible();
    }

    // Mobile bottom navigation should be visible
    const mobileNav = page.locator("nav.md\\:hidden");
    await expect(mobileNav).toBeVisible();

    // All nav items should be visible
    const navLabels = [
      UI_TEXT.navLibrary,
      UI_TEXT.navSearch,
      UI_TEXT.navTower,
      UI_TEXT.navCharacters,
      UI_TEXT.navStats,
      UI_TEXT.navProfile,
    ];
    for (const label of navLabels) {
      await expect(mobileNav.getByText(label)).toBeVisible();
    }
  });

  test("가로 스크롤이 발생하지 않는다", async ({ page }) => {
    await page.goto("/library");
    await expect(
      page.getByRole("heading", { name: UI_TEXT.libraryHeader })
    ).toBeVisible({ timeout: 15000 });

    // Verify no horizontal scroll
    const hasNoHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(hasNoHorizontalScroll).toBe(true);
  });
});
