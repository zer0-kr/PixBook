import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  ensureBookExists,
  addBookToLibrary,
} from "../../helpers/data-factory";
import { UI_TEXT, TEST_BOOK, TEST_REVIEW } from "../../helpers/test-data";

test.describe("독서 기록", () => {
  let userBookId: string;

  test.beforeEach(async () => {
    await cleanupTestUserData();
    const bookId = await ensureBookExists(TEST_BOOK);
    userBookId = await addBookToLibrary(bookId, {
      reading_status: "want_to_read",
    });
  });

  test("책 정보와 독서 기록이 표시된다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);

    // Wait for content to render
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Book title in header
    await expect(page.getByText(TEST_BOOK.title).first()).toBeVisible();
    // Author
    await expect(page.getByText(TEST_BOOK.author)).toBeVisible();
    // 4 status buttons
    await expect(
      page.getByRole("button", { name: UI_TEXT.statusWantToRead })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: UI_TEXT.statusReading })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: UI_TEXT.statusCompleted, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: UI_TEXT.statusDropped })
    ).toBeVisible();
  });

  test('상태를 "읽는 중"으로 변경하면 시작일이 자동 설정된다', async ({
    page,
  }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole("button", { name: UI_TEXT.statusReading }).click();

    // start-date should have today's date
    const startDate = page.locator("#start-date");
    const today = new Date().toISOString().split("T")[0];
    await expect(startDate).toHaveValue(today, { timeout: 5000 });
  });

  test('상태를 "완독"으로 변경하면 완료일이 자동 설정되고 축하 토스트가 표시된다', async ({
    page,
  }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole("button", { name: UI_TEXT.statusCompleted, exact: true }).click();

    // end-date should have today's date
    const endDate = page.locator("#end-date");
    const today = new Date().toISOString().split("T")[0];
    await expect(endDate).toHaveValue(today, { timeout: 5000 });

    // Toast message
    await expect(page.getByText(UI_TEXT.completedToast)).toBeVisible({
      timeout: 10000,
    });
  });

  test("완독 상태가 아니면 별점 클릭 영역이 없고 힌트가 표시된다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Star click areas should not exist (read-only mode)
    await expect(page.getByTestId("star-full-4")).toHaveCount(0);
    await expect(page.getByTestId("star-half-4")).toHaveCount(0);

    // Hint text should be visible
    await expect(page.getByText("완독 후 평점을 남길 수 있습니다")).toBeVisible();
  });

  test("완독으로 변경하면 별점 입력이 활성화되고 힌트가 사라진다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Before: hint visible, no click areas
    await expect(page.getByText("완독 후 평점을 남길 수 있습니다")).toBeVisible();
    await expect(page.getByTestId("star-full-4")).toHaveCount(0);

    // Change to completed
    await page.getByRole("button", { name: UI_TEXT.statusCompleted, exact: true }).click();
    await expect(page.getByText(UI_TEXT.completedToast)).toBeVisible({
      timeout: 10000,
    });

    // After: hint gone, click areas appear
    await expect(page.getByText("완독 후 평점을 남길 수 있습니다")).toBeHidden();
    await expect(page.getByTestId("star-full-4")).toBeVisible();
    await expect(page.getByTestId("star-half-4")).toBeVisible();
  });

  test("정수 별점을 설정할 수 있다 (완독 상태)", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Change to completed first
    await page.getByRole("button", { name: UI_TEXT.statusCompleted, exact: true }).click();
    await expect(page.getByText(UI_TEXT.completedToast)).toBeVisible({
      timeout: 10000,
    });

    // Click right half of 4th star → 4점
    await page.getByTestId("star-full-4").click({ force: true });

    // Wait for debounced save (800ms) + network
    await page.waitForTimeout(1500);

    // Reload and verify
    await page.reload();
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Stars 1-4 should be fully filled, star 5 should be hidden
    await expect(page.getByTestId("star-filled-4")).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
    await expect(page.getByTestId("star-filled-5")).toHaveCSS("clip-path", /inset\(0px 100%/, { timeout: 5000 });
  });

  test("반별(0.5 단위) 별점을 설정할 수 있다 (완독 상태)", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Change to completed first
    await page.getByRole("button", { name: UI_TEXT.statusCompleted, exact: true }).click();
    await expect(page.getByText(UI_TEXT.completedToast)).toBeVisible({
      timeout: 10000,
    });

    // Click left half of 4th star → 3.5점
    await page.getByTestId("star-half-4").click({ force: true });

    // Wait for debounced save (800ms) + network
    await page.waitForTimeout(1500);

    // Reload and verify persistence
    await page.reload();
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // 3rd star should be fully filled
    await expect(page.getByTestId("star-filled-3")).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
    // 4th star should be half-filled
    await expect(page.getByTestId("star-filled-4")).toHaveCSS("clip-path", /inset\(0px 50%/, { timeout: 5000 });
    // 5th star should be hidden
    await expect(page.getByTestId("star-filled-5")).toHaveCSS("clip-path", /inset\(0px 100%/, { timeout: 5000 });
  });

  test("완독에서 다른 상태로 변경하면 별점이 초기화된다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Step 1: Change to completed
    await page.getByRole("button", { name: UI_TEXT.statusCompleted, exact: true }).click();
    await expect(page.getByText(UI_TEXT.completedToast)).toBeVisible({
      timeout: 10000,
    });

    // Step 2: Set 4-star rating
    await page.getByTestId("star-full-4").click({ force: true });
    await page.waitForTimeout(1500);

    // Verify star 4 is filled
    await expect(page.getByTestId("star-filled-4")).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });

    // Step 3: Change status to "읽는 중" (leaving completed)
    await page.getByRole("button", { name: UI_TEXT.statusReading }).click();

    // Step 4: Rating should be reset — all stars empty
    await expect(page.getByTestId("star-filled-1")).toHaveCSS("clip-path", /inset\(0px 100%/, { timeout: 5000 });

    // Hint text should reappear
    await expect(page.getByText("완독 후 평점을 남길 수 있습니다")).toBeVisible();

    // Step 5: Reload to verify persistence of reset
    await page.reload();
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Stars should still be empty
    await expect(page.getByTestId("star-filled-1")).toHaveCSS("clip-path", /inset\(0px 100%/, { timeout: 5000 });
  });

  test("한 줄 감상을 작성할 수 있다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    await page.locator("#review").fill(TEST_REVIEW);

    // Wait for debounced save (800ms) + network
    await page.waitForTimeout(1500);

    // Reload and verify persistence
    await page.reload();
    await expect(page.locator("#review")).toHaveValue(TEST_REVIEW, {
      timeout: 15000,
    });
  });

  test("책등 색상을 변경할 수 있다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Click green color
    await page.getByLabel("색상 #2ECC71").click();

    // Wait for debounced save (800ms) + network
    await page.waitForTimeout(1500);

    // Reload and verify
    await page.reload();
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // Green color button should have scale-110 class
    const greenButton = page.getByLabel("색상 #2ECC71");
    await expect(greenButton).toHaveClass(/scale-110/, { timeout: 5000 });
  });
});
