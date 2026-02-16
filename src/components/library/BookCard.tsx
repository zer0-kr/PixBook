"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui";
import type { UserBook } from "@/types";

interface BookCardProps {
  userBook: UserBook;
}

function BookCard({ userBook }: BookCardProps) {
  const book = userBook.book;

  if (!book) return null;

  return (
    <Link href={`/book/${userBook.id}`} className="block min-w-0">
      <div className="pixel-card p-2 sm:p-3 h-full flex flex-col">
        {/* Cover image */}
        <div className="relative w-full aspect-[2/3] mb-2 sm:mb-3 bg-cream-dark border-2 border-brown overflow-hidden">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="font-pixel text-[8px] text-brown-lighter text-center px-2">
                No Cover
              </span>
            </div>
          )}

        </div>

        {/* Book info */}
        <div className="flex-1 flex flex-col min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-brown line-clamp-2 mb-1 leading-tight">
            {book.title}
          </h3>
          <p className="text-xs text-brown-lighter truncate mb-2">
            {book.author}
          </p>

          {/* Rating */}
          {userBook.rating && (
            <div className="mt-auto">
              <StarRating value={userBook.rating} size="sm" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(BookCard);
