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

export async function addCompletedBook(
  data: BookData,
  options?: {
    spine_color?: string;
    rating?: number;
    start_date?: string;
    end_date?: string;
  }
): Promise<string> {
  const bookId = await ensureBookExists(data);
  const supabase = getAdminClient();
  const userId = await getTestUserId();
  if (!userId) throw new Error("Test user not found");

  const { data: userBook, error } = await supabase
    .from("user_books")
    .insert({
      user_id: userId,
      book_id: bookId,
      reading_status: "completed",
      rating: options?.rating ?? 4,
      spine_color: options?.spine_color ?? "#E74C3C",
      start_date: options?.start_date ?? "2025-01-15",
      end_date: options?.end_date ?? "2025-02-20",
    })
    .select("id")
    .single();

  if (error)
    throw new Error(`Failed to add completed book: ${error.message}`);

  // Update profile stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_books_completed, total_pages_read, tower_height_cm")
    .eq("id", userId)
    .single();

  if (profile) {
    const spineHeight = Math.round(data.page_count * 0.006);
    await supabase
      .from("profiles")
      .update({
        total_books_completed: (profile.total_books_completed || 0) + 1,
        total_pages_read: (profile.total_pages_read || 0) + data.page_count,
        tower_height_cm: (profile.tower_height_cm || 0) + spineHeight,
      })
      .eq("id", userId);
  }

  return userBook!.id;
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
    })
    .eq("id", userId);
}
