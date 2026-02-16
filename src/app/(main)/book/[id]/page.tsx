import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { Header } from "@/components/layout";
import { BookDetailView } from "@/components/book";
import type { UserBook, ReadingNote } from "@/types";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;

  if (!UUID_RE.test(id)) {
    notFound();
  }

  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch user_book and reading notes in parallel
  const [{ data: userBookData, error: bookError }, { data: notesData }] =
    await Promise.all([
      supabase
        .from("user_books")
        .select("*, book:books(*)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("reading_notes")
        .select("*")
        .eq("user_book_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (bookError || !userBookData) {
    notFound();
  }

  const userBook: UserBook = {
    ...userBookData,
    book: userBookData.book ?? undefined,
  };

  const notes: ReadingNote[] = notesData ?? [];

  const bookTitle = userBook.book?.title ?? "책 상세";

  return (
    <>
      <Header title={bookTitle} />
      <BookDetailView userBook={userBook} notes={notes} />
    </>
  );
}
