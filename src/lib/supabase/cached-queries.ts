import { unstable_cache } from "next/cache";
import { createClient } from "./server";
import type { Character } from "@/types";

export const getCachedCharacters = unstable_cache(
  async (): Promise<Character[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("characters")
      .select("id, name, description, sprite_url, unlock_height_cm, rarity")
      .order("unlock_height_cm", { ascending: true });
    return (data as Character[]) ?? [];
  },
  ["all-characters"],
  { revalidate: 3600 }
);
