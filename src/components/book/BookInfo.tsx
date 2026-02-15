"use client";

import Image from "next/image";
import type { Book } from "@/types";

interface BookInfoProps {
  book: Book;
}

export default function BookInfo({ book }: BookInfoProps) {
  return (
    <div className="flex gap-4 sm:gap-6">
      {/* Cover image */}
      <div className="shrink-0 w-28 sm:w-36">
        <div className="relative aspect-[2/3] border-3 border-brown bg-cream-dark overflow-hidden shadow-pixel">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 112px, 144px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="font-pixel text-[8px] text-brown-lighter">
                No Cover
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Book metadata */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base sm:text-lg font-bold text-brown mb-1 leading-tight">
          {book.title}
        </h2>
        <p className="text-sm text-brown-light mb-3">{book.author}</p>

        <dl className="space-y-1 text-xs text-brown-lighter">
          {book.publisher && (
            <div className="flex gap-2">
              <dt className="font-bold text-brown shrink-0">출판사</dt>
              <dd className="truncate">{book.publisher}</dd>
            </div>
          )}
          {book.page_count > 0 && (
            <div className="flex gap-2">
              <dt className="font-bold text-brown shrink-0">쪽수</dt>
              <dd>{book.page_count}쪽</dd>
            </div>
          )}
          {book.category && (
            <div className="flex gap-2">
              <dt className="font-bold text-brown shrink-0">카테고리</dt>
              <dd className="truncate">{book.category}</dd>
            </div>
          )}
          {book.isbn13 && (
            <div className="flex gap-2">
              <dt className="font-bold text-brown shrink-0">ISBN</dt>
              <dd className="font-mono">{book.isbn13}</dd>
            </div>
          )}
        </dl>

        {/* Aladin link */}
        {book.aladin_link && (
          <a
            href={book.aladin_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-bold text-pixel-blue hover:underline"
          >
            알라딘에서 보기 &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
