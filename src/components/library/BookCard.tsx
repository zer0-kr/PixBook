"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/ui";
import type { UserBook } from "@/types";

type ViewMode = "grid" | "list" | "cover";

interface BookCardProps {
  userBook: UserBook;
  viewMode?: ViewMode;
}

function BookCard({ userBook, viewMode = "grid" }: BookCardProps) {
  const book = userBook.book;

  if (!book) return null;

  if (viewMode === "list") {
    return (
      <Link href={`/book/${userBook.id}`} className="block min-w-0">
        <div className="pixel-card p-2 flex flex-row gap-3">
          {/* Cover */}
          <div className="relative w-[60px] flex-shrink-0 aspect-[2/3] bg-cream-dark border-2 border-brown overflow-hidden">
            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={book.title}
                fill
                sizes="60px"
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="font-pixel text-[8px] text-brown-lighter text-center px-1">
                  No Cover
                </span>
              </div>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 flex flex-col justify-center min-w-0">
            <h3 className="text-sm font-bold text-brown line-clamp-1 leading-tight">
              {book.title}
            </h3>
            <p className="text-xs text-brown-lighter truncate">
              {book.author}
              {book.publisher && <span> · {book.publisher}</span>}
            </p>
            {(userBook.rating || book.page_count > 0) && (
              <div className="flex items-center gap-2 mt-0.5">
                {userBook.rating && <StarRating value={userBook.rating} size="sm" />}
                {book.page_count > 0 && (
                  <span className="text-xs text-brown-lighter">{book.page_count}p</span>
                )}
              </div>
            )}
            {userBook.one_line_review && (
              <p className="text-xs text-brown-lighter italic line-clamp-1 mt-0.5">
                &ldquo;{userBook.one_line_review}&rdquo;
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (viewMode === "cover") {
    return (
      <Link href={`/book/${userBook.id}`} className="block min-w-0">
        <div className="pixel-card p-2 h-full flex flex-col">
          <div className="relative w-full aspect-[2/3] mb-1 bg-cream-dark border-2 border-brown overflow-hidden">
            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={book.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
          <h3 className="text-xs font-bold text-brown line-clamp-1 leading-tight">
            {book.title}
          </h3>
        </div>
      </Link>
    );
  }

  // Grid view (default)
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
