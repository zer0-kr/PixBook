import { test, expect } from "@playwright/test";
import { UI_TEXT } from "../../helpers/test-data";

test.describe("캐릭터 페이지", () => {
  test("캐릭터 도감 페이지가 로딩된다", async ({ page }) => {
    await page.goto("/characters");

    await expect(page.getByText(UI_TEXT.charactersHeader)).toBeVisible({
      timeout: 15000,
    });
  });

  test("캐릭터 카드가 표시된다", async ({ page }) => {
    await page.goto("/characters");
    await expect(page.getByText(UI_TEXT.charactersHeader)).toBeVisible({
      timeout: 15000,
    });

    // Collection status section
    await expect(page.getByText(UI_TEXT.collectionStatus)).toBeVisible({
      timeout: 10000,
    });

    // Character cards should exist in the grid
    // Cards are rendered as buttons
    const characterCards = page.locator(
      'button[class*="border-rarity"], button[class*="pixel-border"]'
    );
    // At minimum there should be some characters defined in the system
    await expect(characterCards.first()).toBeVisible({ timeout: 10000 });
  });

  test("레어리티 필터와 통계가 표시된다", async ({ page }) => {
    await page.goto("/characters");
    await expect(page.getByText(UI_TEXT.charactersHeader)).toBeVisible({
      timeout: 15000,
    });

    // Rarity badges in the summary section
    await expect(page.getByText(UI_TEXT.rarityCommon).first()).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(UI_TEXT.rarityRare).first()).toBeVisible();
    await expect(page.getByText(UI_TEXT.rarityEpic).first()).toBeVisible();
    await expect(page.getByText(UI_TEXT.rarityLegendary).first()).toBeVisible();

    // Filter tabs should also be present (전체 + 4 rarities)
    const filterButtons = page.locator("button").filter({ hasText: /전체/ });
    await expect(filterButtons.first()).toBeVisible();
  });

  test("잠긴 캐릭터에 잠김 표시가 보인다", async ({ page }) => {
    await page.goto("/characters");
    await expect(page.getByText(UI_TEXT.charactersHeader)).toBeVisible({
      timeout: 15000,
    });

    // Locked characters show "?" placeholder and unlock height text
    // Look for the "?" symbol used on locked character cards
    const lockedIndicators = page.getByText("?");
    await expect(lockedIndicators.first()).toBeVisible({ timeout: 10000 });

    // Locked characters show "???" as name
    const hiddenNames = page.getByText("???");
    await expect(hiddenNames.first()).toBeVisible();

    // Unlock height text (e.g., "높이 XXcm에서 해금")
    const unlockText = page.getByText(/에서 해금/);
    await expect(unlockText.first()).toBeVisible();
  });
});
