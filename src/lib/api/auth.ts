import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
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

interface RateLimitConfig {
  key: string;
  limit: number;
  windowSeconds: number;
}

type AuthenticatedHandler = (
  auth: { user: User; supabase: SupabaseClient }
) => Promise<NextResponse>;

export async function withAuthAndRateLimit(
  handler: AuthenticatedHandler,
  rateLimit: RateLimitConfig
): Promise<NextResponse> {
  const auth = await authenticateApiRequest();
  if (auth.response) return auth.response;

  const { allowed } = checkRateLimit(
    `${rateLimit.key}:${auth.user.id}`,
    { limit: rateLimit.limit, windowSeconds: rateLimit.windowSeconds }
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  return handler(auth);
}
