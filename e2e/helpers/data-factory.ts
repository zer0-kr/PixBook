import { getAdminClient, getTestUserId } from "./supabase-admin";

interface BookData {
  isbn13: string;
  title: string;
  author: string;
  publisher: string;
  page_count: number;
  category?: string;
}

export async function ensureBookExists(data: BookData): Promise<string> {
  const supabase = getAdminClient();

  // Try to find existing book
  const { data: existing } = await supabase
    .from("books")
    .select("id")
    .eq("isbn13", data.isbn13)
    .single();

  if (existing) return existing.id;

  // Create new book
  const { data: created, error } = await supabase
    .from("books")
    .insert({
      isbn13: data.isbn13,
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      page_count: data.page_count,
      category: data.category ?? null,
      cover_url: null,
      pub_date: null,
      description: null,
      aladin_link: null,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create book: ${error.message}`);
  return created!.id;
}

export async function addBookToLibrary(
  bookId: string,
  options?: {
    reading_status?: string;
    rating?: number;
    spine_color?: string;
  }
): Promise<string> {
  const supabase = getAdminClient();
  const userId = await getTestUserId();
  if (!userId) throw new Error("Test user not found");

  const { data, error } = await supabase
    .from("user_books")
    .insert({
      user_id: userId,
      book_id: bookId,
      reading_status: options?.reading_status ?? "want_to_read",
      rating: options?.rating ?? null,
      spine_color: options?.spine_color ?? "#E74C3C",
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to add book to library: ${error.message}`);
  return data!.id;
}

export async function cleanupTestUserData(): Promise<void> {
  const supabase = getAdminClient();
  const userId = await getTestUserId();
  if (!userId) return;

  // Delete reading_notes for user's books
  const { data: userBooks } = await supabase
    .from("user_books")
    .select("id")
    .eq("user_id", userId);

  if (userBooks && userBooks.length > 0) {
    const userBookIds = userBooks.map((ub) => ub.id);
    await supabase
      .from("reading_notes")
      .delete()
      .in("user_book_id", userBookIds);
  }

  // Delete reading_sessions
  await supabase.from("reading_sessions").delete().eq("user_id", userId);

  // Delete user_characters
  await supabase.from("user_characters").delete().eq("user_id", userId);

  // Delete user_books
  await supabase.from("user_books").delete().eq("user_id", userId);

  // Reset profile stats
  await supabase
    .from("profiles")
    .update({
      nickname: process.env.TEST_USER_NICKNAME || "E2E테스터",
      tower_height_cm: 0,
      total_books_completed: 0,
      total_pages_read: 0,
      active_character_id: null,
    })
    .eq("id", userId);
}
