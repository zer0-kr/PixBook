import { NextResponse } from "next/server";
import { withAuthAndRateLimit } from "@/lib/api/auth";

export async function DELETE() {
  return withAuthAndRateLimit(
    async ({ user, supabase }) => {
      const { error } = await supabase
        .from("user_books")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      await supabase.rpc("recalculate_tower_height", {
        p_user_id: user.id,
      });

      return NextResponse.json({ success: true });
    },
    { key: "delete-all-books", limit: 3, windowSeconds: 300 }
  );
}
