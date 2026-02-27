import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for use inside unstable_cache.
 * unstable_cache runs in a separate async context where cookies() is unavailable,
 * so we use the service-role key which bypasses RLS.
 * Only used for public/shared data (e.g. characters table).
 */
function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Cached characters list — same for all users, refreshed every hour.
 * Eliminates a DB query on every characters page visit.
 */
export const getCachedCharacters = unstable_cache(
  async () => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("characters")
      .select("id, name, description, sprite_url, unlock_height_cm, rarity")
      .order("unlock_height_cm", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },
  ["characters-list"],
  { revalidate: 3600, tags: ["characters"] }
);
