import { NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api/auth";
import { getTowerHeight } from "@/lib/tower/rpc";

export async function DELETE() {
  return withAuthAndRateLimit(
    async ({ user, supabase }) => {
      const { error } = await supabase
        .from("user_books")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      await getTowerHeight(supabase, user.id);

      return NextResponse.json({ success: true });
    },
    { key: "delete-all-books", limit: 3, windowSeconds: 300 }
  );
}
