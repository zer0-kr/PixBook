"use client";

import { useState } from "react";
import type { Book } from "@/types";

interface BookSpineProps {
  book: Book;
  spineColor: string;
  heightPx: number;
}

const SPINE_WIDTH = 120;

export default function BookSpine({ book, spineColor, heightPx }: BookSpineProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Ensure a minimum visible height so very short books are still clickable.
  const clampedHeight = Math.max(heightPx, 6);

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden border-2 border-brown"
      style={{
        width: SPINE_WIDTH,
        height: clampedHeight,
        backgroundColor: spineColor,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Title text — only shown if spine is tall enough */}
      {clampedHeight >= 14 && (
        <span
          className="truncate px-1 text-center text-[10px] font-bold leading-tight"
          style={{
            color: isLightColor(spineColor) ? "#3D2C2E" : "#FFF8E7",
            maxWidth: SPINE_WIDTH - 8,
          }}
        >
          {book.title}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap border-2 border-brown bg-cream px-2 py-1 text-xs font-bold text-brown shadow-pixel-sm">
          {book.title} ({book.page_count || 200}p)
        </div>
      )}
    </div>
  );
}

/**
 * Rough heuristic: if the background is light, use dark text and vice versa.
 */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Perceived brightness
  return r * 0.299 + g * 0.587 + b * 0.114 > 150;
}
