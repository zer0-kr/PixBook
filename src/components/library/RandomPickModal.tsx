"use client";

import Image from "next/image";
import Link from "next/link";
import PixelModal from "@/components/ui/PixelModal";
import { PixelButton } from "@/components/ui";
import type { UserBook } from "@/types";

interface RandomPickModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: UserBook | null;
  onReshuffle: () => void;
}

export default function RandomPickModal({
  isOpen,
  onClose,
  book,
  onReshuffle,
}: RandomPickModalProps) {
  if (!book?.book) return null;

  const { book: bookData } = book;

  return (
    <PixelModal isOpen={isOpen} onClose={onClose} title="오늘의 추천 책">
      <div className="flex flex-col items-center text-center">
        {/* Cover */}
        <div className="relative w-32 aspect-[2/3] mb-4 bg-cream-dark border-2 border-brown overflow-hidden">
          {bookData.cover_url ? (
            <Image
              src={bookData.cover_url}
              alt={bookData.title}
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="font-pixel text-[10px] text-brown-lighter text-center px-2">
                No Cover
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="text-sm font-bold text-brown mb-1">{bookData.title}</h3>
        <p className="text-xs text-brown-lighter mb-4">
          {bookData.author}
          {bookData.publisher && <span> · {bookData.publisher}</span>}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <PixelButton variant="secondary" size="sm" onClick={onReshuffle}>
            다시 추천
          </PixelButton>
          <Link
            href={`/book/${book.id}`}
            onClick={onClose}
            className="pixel-btn inline-flex items-center justify-center gap-2 bg-pixel-blue text-white hover:bg-pixel-blue/90 px-2 py-1 text-xs"
          >
            상세보기
          </Link>
        </div>
      </div>
    </PixelModal>
  );
}
