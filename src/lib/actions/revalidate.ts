"use server";

import { revalidatePath } from "next/cache";

export async function revalidateLibrary() {
  revalidatePath("/library");
  revalidatePath("/tower");
  revalidatePath("/stats");
  revalidatePath("/characters");
  revalidatePath("/profile");
}

/**
 * Revalidate all data-dependent pages.
 * Safe to call from API route handlers (non-"use server" context).
 */
export async function revalidateAllPages() {
  revalidatePath("/library");
  revalidatePath("/tower");
  revalidatePath("/stats");
  revalidatePath("/characters");
  revalidatePath("/profile");
}
