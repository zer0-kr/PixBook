import { test, expect } from "@playwright/test";
import {
  cleanupTestUserData,
  ensureBookExists,
  addBookToLibrary,
} from "../../helpers/data-factory";
import { getAdminClient } from "../../helpers/supabase-admin";

test.describe("보강 시 페이지 수 수정", () => {
  test.beforeEach(async () => {
    await cleanupTestUserData();
  });

  test("보강된 도서가 실제 쪽수를 갖는다 (200이 아님)", async ({ page, baseURL }) => {
    test.setTimeout(60_000);

    // 1. IMP- ISBN + page_count=200인 도서 삽입 (알라딘에서 매칭 가능한 실제 도서)
    const bookId = await ensureBookExists({
      isbn13: "IMP-testpagefix",
      title: "클린 코드",
      author: "로버트 C. 마틴",
      publisher: "인사이트",
      page_count: 200,
    });

    await addBookToLibrary(bookId, { reading_status: "want_to_read" });

    // 2. 페이지 방문으로 인증 쿠키 활성화 후 API 호출
    await page.goto("/library");
    await expect(page.getByText("전체")).toBeVisible({ timeout: 15000 });

    const res = await page.request.post(`${baseURL}/api/books/enrich`, {
      data: { bookIds: [bookId] },
    });
    const body = await res.json();
    expect(res.ok(), `enrich API failed: ${JSON.stringify(body)}`).toBeTruthy();
    expect(body.enriched).toBe(1);

    // 3. page_count가 200이 아닌 실제값인지 확인
    const supabase = getAdminClient();
    const { data: updated } = await supabase
      .from("books")
      .select("page_count, isbn13")
      .eq("id", bookId)
      .single();

    expect(updated).not.toBeNull();
    expect(updated!.page_count).not.toBe(200);
    expect(updated!.page_count).toBeGreaterThan(300); // 클린 코드 ~464쪽
  });
});
