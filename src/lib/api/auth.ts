import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { User, SupabaseClient } from "@supabase/supabase-js";

type AuthResult =
  | { user: User; supabase: SupabaseClient; response?: never }
  | { user?: never; supabase?: never; response: NextResponse };

export async function authenticateApiRequest(): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      response: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { user, supabase };
}
