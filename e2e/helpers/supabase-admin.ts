import { createClient, SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in e2e/.env.test"
    );
  }

  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return adminClient;
}

export async function getTestUserId(): Promise<string | null> {
  const supabase = getAdminClient();
  const email = process.env.TEST_USER_EMAIL!;

  const { data } = await supabase.auth.admin.listUsers();
  const user = data?.users?.find((u) => u.email === email);
  return user?.id ?? null;
}
