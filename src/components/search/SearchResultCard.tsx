"use client";

import { useState } from "react";
import Image from "next/image";
import type { AladinItem } from "@/lib/aladin/types";
import { PixelButton, PixelBadge } from "@/components/ui";

interface SearchResultCardProps {
  item: AladinItem;
  isInLibrary: boolean;
  isAdding: boolean;
  onAdd: (item: AladinItem) => void;
}

export default function SearchResultCard({
  item,
  isInLibrary,
  isAdding,
  onAdd,
}: SearchResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="pixel-card-static cursor-pointer bg-cream p-3 transition-all"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex gap-3">
        {/* Cover image */}
        <div className="relative h-[120px] w-[80px] shrink-0 border-2 border-brown bg-cream-dark">
          {item.cover && !imgError ? (
            <Image
              src={item.cover}
              alt={item.title}
              fill
              sizes="80px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-1 text-center text-[10px] text-brown-lighter">
              {item.title.slice(0, 20)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold text-brown">
              {item.title}
            </h3>
            {isInLibrary && (
              <PixelBadge variant="reading">서재에 있음</PixelBadge>
            )}
          </div>
          <p className="line-clamp-1 text-xs text-brown-light">
            {item.author}
          </p>
          <p className="text-xs text-brown-lighter">
            {item.publisher}
            {item.pubDate && ` · ${item.pubDate.slice(0, 4)}`}
          </p>
          {item.categoryName && (
            <p className="line-clamp-1 text-[10px] text-brown-lighter">
              {item.categoryName}
            </p>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 border-t-2 border-brown/20 pt-3">
          {item.description && (
            <p className="mb-3 text-xs leading-relaxed text-brown-light">
              {item.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brown-lighter">
              ISBN: {item.isbn13}
            </span>
            {isInLibrary ? (
              <PixelBadge variant="completed">이미 서재에 있습니다</PixelBadge>
            ) : (
              <PixelButton
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(item);
                }}
                disabled={isAdding}
              >
                {isAdding ? "추가 중..." : "서재에 추가"}
              </PixelButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
