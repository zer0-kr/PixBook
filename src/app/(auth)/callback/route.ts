import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/logger";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(new URL("/library", requestUrl.origin));
      }
    } catch (err) {
      logError("Auth callback error:", err);
    }
  }

  // Return to login page on error
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
