import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  ensureBookExists,
  addBookToLibrary,
} from "../../helpers/data-factory";
import { UI_TEXT, TEST_BOOK } from "../../helpers/test-data";

test.describe("별점 변경 후 서재 반영", () => {
  let userBookId: string;

  test.beforeEach(async () => {
    await cleanupTestUserData();
  });

  test("별점 설정 후 서재에서 반영된다", async ({ page }) => {
    const bookId = await ensureBookExists(TEST_BOOK);
    userBookId = await addBookToLibrary(bookId, {
      reading_status: "completed",
    });

    // 1. 서재에서 별점 없는 상태 확인
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const bookCard = page.locator(`a[href='/book/${userBookId}']`);
    await expect(bookCard).toBeVisible();
    // 별점이 없으므로 star-rating이 없어야 함
    await expect(bookCard.locator(".star-rating")).not.toBeVisible();

    // 2. 상세 페이지에서 별점 4점 설정 (완독 상태에서만 별점 편집 가능)
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });
    await page.getByTestId("star-full-4").click({ force: true });

    // 디바운스 저장 대기 (800ms + 네트워크)
    await page.waitForTimeout(2000);

    // 3. 서재로 이동하여 별점 확인
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const updatedCard = page.locator(`a[href='/book/${userBookId}']`);
    await expect(updatedCard.locator(".star-rating")).toBeVisible({
      timeout: 5000,
    });
    // 4번째 별이 채워져 있어야 함
    await expect(
      updatedCard.locator('[data-testid="star-filled-4"]')
    ).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
    // 5번째 별은 비어 있어야 함
    await expect(
      updatedCard.locator('[data-testid="star-filled-5"]')
    ).toHaveCSS("clip-path", /inset\(0px 100%/);
  });

  test("별점 취소 후 서재에서 별점이 사라진다", async ({ page }) => {
    const bookId = await ensureBookExists(TEST_BOOK);
    // 별점 3점으로 초기 설정 (완독 상태에서만 별점 편집 가능)
    userBookId = await addBookToLibrary(bookId, {
      reading_status: "completed",
      rating: 3,
    });

    // 1. 서재에서 별점 3점 표시 확인
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const bookCard = page.locator(`a[href='/book/${userBookId}']`);
    await expect(bookCard.locator(".star-rating")).toBeVisible({
      timeout: 5000,
    });

    // 2. 상세 페이지에서 동일 별점 클릭하여 취소
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });
    // 같은 별(3점) 클릭 → 별점 취소 (0 → null)
    await page.getByTestId("star-full-3").click({ force: true });

    // 디바운스 저장 대기
    await page.waitForTimeout(2000);

    // 3. 서재로 이동하여 별점 비표시 확인
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const updatedCard = page.locator(`a[href='/book/${userBookId}']`);
    await expect(updatedCard).toBeVisible();
    // 별점이 없으므로 star-rating이 없어야 함
    await expect(updatedCard.locator(".star-rating")).not.toBeVisible();
  });

  test("별점 변경 후 서재에서 새 별점이 반영된다", async ({ page }) => {
    const bookId = await ensureBookExists(TEST_BOOK);
    // 별점 2점으로 초기 설정
    userBookId = await addBookToLibrary(bookId, {
      reading_status: "completed",
      rating: 2,
    });

    // 1. 서재에서 별점 2점 표시 확인
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const bookCard = page.locator(`a[href='/book/${userBookId}']`);
    await expect(
      bookCard.locator('[data-testid="star-filled-2"]')
    ).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
    await expect(
      bookCard.locator('[data-testid="star-filled-3"]')
    ).toHaveCSS("clip-path", /inset\(0px 100%/);

    // 2. 상세 페이지에서 별점 5점으로 변경
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });
    await page.getByTestId("star-full-5").click({ force: true });

    // 디바운스 저장 대기
    await page.waitForTimeout(2000);

    // 3. 서재로 이동하여 별점 5점 확인
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const updatedCard = page.locator(`a[href='/book/${userBookId}']`);
    // 모든 별이 채워져 있어야 함
    await expect(
      updatedCard.locator('[data-testid="star-filled-5"]')
    ).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
  });

  test("뒤로가기로 서재에 돌아와도 변경된 별점이 반영된다", async ({
    page,
  }) => {
    const bookId = await ensureBookExists(TEST_BOOK);
    userBookId = await addBookToLibrary(bookId, {
      reading_status: "completed",
    });

    // 1. 서재 → 상세 페이지 이동
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const bookCard = page.locator(`a[href='/book/${userBookId}']`);
    await bookCard.click();
    await expect(page).toHaveURL(/\/book\//, { timeout: 10000 });
    await expect(page.getByText(UI_TEXT.readingRecord)).toBeVisible({
      timeout: 15000,
    });

    // 2. 별점 3.5점 설정 (반별, 완독 상태에서만 편집 가능)
    await page.getByTestId("star-half-4").click({ force: true });

    // 디바운스 저장 대기
    await page.waitForTimeout(2000);

    // 3. 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL(/\/library/, { timeout: 10000 });
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    // 4. 서재에서 별점 3.5점 확인
    const updatedCard = page.locator(`a[href='/book/${userBookId}']`);
    await expect(updatedCard.locator(".star-rating")).toBeVisible({
      timeout: 5000,
    });
    // 3번째 별 완전 채움
    await expect(
      updatedCard.locator('[data-testid="star-filled-3"]')
    ).toHaveCSS("clip-path", "inset(0px)", { timeout: 5000 });
    // 4번째 별 반 채움
    await expect(
      updatedCard.locator('[data-testid="star-filled-4"]')
    ).toHaveCSS("clip-path", /inset\(0px 50%/);
    // 5번째 별 비움
    await expect(
      updatedCard.locator('[data-testid="star-filled-5"]')
    ).toHaveCSS("clip-path", /inset\(0px 100%/);
  });
});
