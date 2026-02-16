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

  const supabase = await createClient();

  // Fetch getUser, user_book, and reading notes in parallel (RLS filters by user)
  const [user, { data: userBookData, error: bookError }, { data: notesData }] =
    await Promise.all([
      getUser(),
      supabase
        .from("user_books")
        .select("*, book:books(*)")
        .eq("id", id)
        .single(),
      supabase
        .from("reading_notes")
        .select("*")
        .eq("user_book_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!user) {
    redirect("/login");
  }

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
