import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  ensureBookExists,
  addBookToLibrary,
} from "../../helpers/data-factory";
import {
  UI_TEXT,
  TEST_BOOK,
  TEST_NOTE_CONTENT,
  TEST_NOTE_PAGE,
  TEST_NOTE_EDITED,
} from "../../helpers/test-data";

test.describe("독서 메모", () => {
  let userBookId: string;

  test.beforeEach(async () => {
    await cleanupTestUserData();
    const bookId = await ensureBookExists(TEST_BOOK);
    userBookId = await addBookToLibrary(bookId);
  });

  test("빈 메모 상태가 표시된다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);

    await expect(page.getByText("독서 메모 (0)")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(UI_TEXT.emptyNotes)).toBeVisible();
  });

  test("메모를 추가할 수 있다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText("독서 메모 (0)")).toBeVisible({
      timeout: 15000,
    });

    // Click "메모 추가"
    await page.getByRole("button", { name: UI_TEXT.addNote }).click();

    // Fill in the form
    await page.locator("#new-note-content").fill(TEST_NOTE_CONTENT);
    await page.locator("#new-note-page").fill(TEST_NOTE_PAGE);

    // Click save
    await page.getByRole("button", { name: UI_TEXT.save }).first().click();

    // Check toast
    await expect(page.getByText(UI_TEXT.noteAdded)).toBeVisible({
      timeout: 10000,
    });

    // Verify note appears in the list
    await expect(page.getByText(TEST_NOTE_CONTENT)).toBeVisible();
    await expect(page.getByText(`p.${TEST_NOTE_PAGE}`)).toBeVisible();
  });

  test("메모를 수정할 수 있다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText("독서 메모 (0)")).toBeVisible({
      timeout: 15000,
    });

    // First, add a note
    await page.getByRole("button", { name: UI_TEXT.addNote }).click();
    await page.locator("#new-note-content").fill(TEST_NOTE_CONTENT);
    await page.getByRole("button", { name: UI_TEXT.save }).first().click();
    await expect(page.getByText(UI_TEXT.noteAdded)).toBeVisible({
      timeout: 10000,
    });

    // Click edit
    await page.getByText(UI_TEXT.edit).first().click();

    // Modify content
    const editTextarea = page.locator("textarea").first();
    await editTextarea.clear();
    await editTextarea.fill(TEST_NOTE_EDITED);

    // Save
    await page.getByRole("button", { name: UI_TEXT.save }).first().click();

    // Check toast
    await expect(page.getByText(UI_TEXT.noteEdited)).toBeVisible({
      timeout: 10000,
    });

    // Verify edited content
    await expect(page.getByText(TEST_NOTE_EDITED)).toBeVisible();
  });

  test("메모를 삭제할 수 있다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText("독서 메모 (0)")).toBeVisible({
      timeout: 15000,
    });

    // First, add a note
    await page.getByRole("button", { name: UI_TEXT.addNote }).click();
    await page.locator("#new-note-content").fill(TEST_NOTE_CONTENT);
    await page.getByRole("button", { name: UI_TEXT.save }).first().click();
    await expect(page.getByText(UI_TEXT.noteAdded)).toBeVisible({
      timeout: 10000,
    });

    // Click delete button on the note
    await page
      .locator("button")
      .filter({ hasText: UI_TEXT.delete })
      .first()
      .click();

    // Confirm delete prompt
    await expect(page.getByText(UI_TEXT.deleteNoteConfirm)).toBeVisible();

    // Click delete in confirmation
    await page
      .getByRole("button", { name: UI_TEXT.delete })
      .first()
      .click();

    // Check toast
    await expect(page.getByText(UI_TEXT.noteDeleted)).toBeVisible({
      timeout: 10000,
    });
  });

  test("메모 추가를 취소할 수 있다", async ({ page }) => {
    await page.goto(`/book/${userBookId}`);
    await expect(page.getByText("독서 메모 (0)")).toBeVisible({
      timeout: 15000,
    });

    // Click "메모 추가"
    await page.getByRole("button", { name: UI_TEXT.addNote }).click();

    // Form should appear
    await expect(page.locator("#new-note-content")).toBeVisible();

    // Click cancel
    await page.getByRole("button", { name: UI_TEXT.cancel }).click();

    // Form should disappear
    await expect(page.locator("#new-note-content")).not.toBeVisible();
  });
});
