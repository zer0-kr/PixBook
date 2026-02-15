"use client";

import { useState, useCallback } from "react";
import { PixelCard } from "@/components/ui";
import BookInfo from "./BookInfo";
import ReadingRecord from "./ReadingRecord";
import ReadingNotes from "./ReadingNotes";
import DeleteBookButton from "./DeleteBookButton";
import type { UserBook, ReadingNote } from "@/types";

interface BookDetailViewProps {
  userBook: UserBook;
  notes: ReadingNote[];
}

export default function BookDetailView({
  userBook: initialUserBook,
  notes,
}: BookDetailViewProps) {
  const [userBook, setUserBook] = useState(initialUserBook);

  const handleUpdate = useCallback((updated: Partial<UserBook>) => {
    setUserBook((prev) => ({ ...prev, ...updated }));
  }, []);

  if (!userBook.book) {
    return (
      <div className="p-4">
        <p className="text-sm text-brown-lighter">책 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* Book info section */}
      <PixelCard hoverable={false}>
        <BookInfo book={userBook.book} />
      </PixelCard>

      {/* Reading record section */}
      <PixelCard hoverable={false}>
        <h3 className="font-pixel text-xs text-brown mb-4">독서 기록</h3>
        <ReadingRecord userBook={userBook} onUpdate={handleUpdate} />
      </PixelCard>

      {/* Reading notes section */}
      <PixelCard hoverable={false}>
        <ReadingNotes userBookId={userBook.id} initialNotes={notes} />
      </PixelCard>

      {/* Delete button */}
      <div className="flex justify-end">
        <DeleteBookButton userBookId={userBook.id} />
      </div>
    </div>
  );
}
