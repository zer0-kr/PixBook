import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout";
import { BookDetailView } from "@/components/book";
import type { UserBook, ReadingNote } from "@/types";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user_book with joined book data
  const { data: userBookData, error: bookError } = await supabase
    .from("user_books")
    .select("*, book:books(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (bookError || !userBookData) {
    notFound();
  }

  const userBook: UserBook = {
    ...userBookData,
    book: userBookData.book ?? undefined,
  };

  // Fetch reading notes for this user_book
  const { data: notesData } = await supabase
    .from("reading_notes")
    .select("*")
    .eq("user_book_id", id)
    .order("created_at", { ascending: false });

  const notes: ReadingNote[] = notesData ?? [];

  const bookTitle = userBook.book?.title ?? "책 상세";

  return (
    <>
      <Header title={bookTitle} />
      <BookDetailView userBook={userBook} notes={notes} />
    </>
  );
}
