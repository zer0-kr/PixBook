import path from "path";
import dotenv from "dotenv";
import { getAdminClient, getTestUserId } from "./helpers/supabase-admin";
import { cleanupTestUserData } from "./helpers/data-factory";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default async function globalSetup() {
  const supabase = getAdminClient();
  const email = process.env.TEST_USER_EMAIL!;
  const password = process.env.TEST_USER_PASSWORD!;
  const nickname = process.env.TEST_USER_NICKNAME || "E2E테스터";

  console.log(`[Global Setup] Setting up test user: ${email}`);

  // Check if test user already exists
  const existingUserId = await getTestUserId();

  if (existingUserId) {
    console.log("[Global Setup] Test user exists, cleaning up data...");
    await cleanupTestUserData();
  } else {
    console.log("[Global Setup] Creating test user...");
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nickname },
    });

    if (error) {
      throw new Error(`Failed to create test user: ${error.message}`);
    }

    console.log(`[Global Setup] Test user created: ${data.user.id}`);

    // Wait for handle_new_user trigger to create profile
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Verify profile was created
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", data.user.id)
      .single();

    if (!profile) {
      // Manually create profile if trigger didn't fire
      console.log("[Global Setup] Creating profile manually...");
      await supabase.from("profiles").insert({
        id: data.user.id,
        nickname,
        tower_height_cm: 0,
        total_books_completed: 0,
        total_pages_read: 0,
      });
    }
  }

  console.log("[Global Setup] Done.");
}
