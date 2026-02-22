import type { SupabaseClient } from "@supabase/supabase-js";
import { logError } from "@/lib/logger";

export async function getTowerHeight(
  supabase: SupabaseClient,
  userId: string,
): Promise<number | null> {
  const { data, error } = await supabase.rpc("recalculate_tower_height", {
    p_user_id: userId,
  });
  if (error) {
    logError("getTowerHeight RPC failed:", error);
    return null;
  }
  const height = (data as { tower_height: number }[] | null)?.[0]?.tower_height;
  return height != null ? Number(height) : null;
}
