import path from "path";
import dotenv from "dotenv";
import { getAdminClient, getTestUserId } from "./helpers/supabase-admin";
import { cleanupTestUserData } from "./helpers/data-factory";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default async function globalTeardown() {
  console.log("[Global Teardown] Cleaning up test user...");

  const userId = await getTestUserId();
  if (!userId) {
    console.log("[Global Teardown] Test user not found, skipping.");
    return;
  }

  // Clean up all test data first
  await cleanupTestUserData();

  // Delete the test user (CASCADE will handle profiles)
  const supabase = getAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error(`[Global Teardown] Failed to delete test user: ${error.message}`);
  } else {
    console.log("[Global Teardown] Test user deleted.");
  }

  // Clean up orphaned books (books not referenced by any user_book)
  const { data: orphanedBooks } = await supabase
    .from("books")
    .select("id")
    .not(
      "id",
      "in",
      supabase.from("user_books").select("book_id")
    );

  // Note: Supabase doesn't support NOT IN subquery directly.
  // We'll leave orphaned books as they're harmless reference data.

  console.log("[Global Teardown] Done.");
}
