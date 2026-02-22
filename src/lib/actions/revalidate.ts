"use server";

import { revalidatePath } from "next/cache";

export async function revalidateLibrary() {
  revalidatePath("/library");
  revalidatePath("/tower");
  revalidatePath("/stats");
}
