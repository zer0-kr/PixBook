"use client";

import type { UserBook } from "@/types";
import { calculateBookHeight, cmToPixels, formatHeight } from "@/lib/tower/calculator";
import { TOWER_MILESTONES } from "@/lib/tower/constants";
import BookTower from "./BookTower";

interface TowerSceneProps {
  completedBooks: UserBook[];
  totalHeightCm: number;
  zoom: number;
}

/** Height of the ground strip in pixels. */
const GROUND_HEIGHT = 40;

/**
 * Full visual scene: gradient sky, pixel clouds, ground strip, height markers,
 * milestone flags, the book tower, and the character on top.
 */
export default function TowerScene({
  completedBooks,
  totalHeightCm,
  zoom,
}: TowerSceneProps) {
  // Total tower height in px (from book calculations)
  const towerHeightPx = completedBooks.reduce((sum, ub) => {
    if (!ub.book) return sum;
    return sum + cmToPixels(calculateBookHeight(ub.book.page_count), zoom);
  }, 0);

  // Scene needs at least the tower + ground + character + some breathing room
  const sceneHeightPx = Math.max(400, towerHeightPx + GROUND_HEIGHT + 80);

  // Height markers for the ruler
  const markers = buildHeightMarkers(totalHeightCm, zoom);

  // Milestone markers (only those within the current tower height)
  const milestoneMarkers = TOWER_MILESTONES.filter(
    (m) => m.height_cm <= totalHeightCm,
  );

  return (
    <div className="relative w-full flex-1 min-h-0 overflow-auto border-3 border-brown">
      <div
        className="relative w-full"
        style={{
          minHeight: sceneHeightPx,
          background:
            "linear-gradient(to bottom, #87CEEB 0%, #B0E0FF 40%, #D4EFFF 70%, #E8F6FF 100%)",
        }}
      >
        {/* Pixel clouds */}
        <Cloud top={30} left="15%" />
        <Cloud top={60} left="60%" />
        <Cloud top={100} left="35%" />

        {/* Height ruler on the left */}
        <div className="absolute bottom-0 left-0 w-10" style={{ height: towerHeightPx + GROUND_HEIGHT }}>
          {markers.map((m) => (
            <div
              key={m.cm}
              className="absolute left-0 flex items-center"
              style={{ bottom: GROUND_HEIGHT + cmToPixels(m.cm, zoom) }}
            >
              <div className="h-px w-3 bg-brown/40" />
              <span className="ml-0.5 text-[7px] text-brown/60 whitespace-nowrap">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Milestone flags on the right side of the tower */}
        {milestoneMarkers.map((m) => (
          <div
            key={m.height_cm}
            className="absolute flex items-center gap-1"
            style={{
              bottom: GROUND_HEIGHT + cmToPixels(m.height_cm, zoom),
              left: "calc(50% + 80px)",
            }}
          >
            <span className="text-xs">&#9873;</span>
            <span className="whitespace-nowrap border border-brown/30 bg-cream/90 px-1 text-[8px] font-bold text-brown">
              {m.label}
            </span>
          </div>
        ))}

        {/* Tower + character container, anchored at the bottom */}
        <div
          className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center"
          style={{ paddingBottom: GROUND_HEIGHT }}
        >
          {/* Book stack */}
          <BookTower completedBooks={completedBooks} zoom={zoom} />
        </div>

        {/* Ground strip */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{ height: GROUND_HEIGHT }}
        >
          {/* Grass */}
          <div className="h-3 w-full bg-pixel-green" />
          {/* Dirt */}
          <div className="h-full w-full bg-[#8B6914]" />
        </div>

        {/* Height label overlay at top of tower */}
        {totalHeightCm > 0 && (
          <div
            className="absolute left-1/2 -translate-x-1/2 border-2 border-brown bg-cream px-2 py-0.5 text-[10px] font-bold text-brown shadow-pixel-sm"
            style={{
              bottom: GROUND_HEIGHT + towerHeightPx + 48,
            }}
          >
            {formatHeight(totalHeightCm)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

interface HeightMarker {
  cm: number;
  label: string;
}

function buildHeightMarkers(totalCm: number, zoom: number): HeightMarker[] {
  // Choose step size depending on total height
  let stepCm: number;
  if (totalCm <= 5) stepCm = 1;
  else if (totalCm <= 20) stepCm = 2;
  else if (totalCm <= 100) stepCm = 10;
  else stepCm = 50;

  const markers: HeightMarker[] = [];
  for (let cm = stepCm; cm <= totalCm; cm += stepCm) {
    // Skip if resulting pixel offset too small to read
    if (cmToPixels(cm, zoom) < 20) continue;
    markers.push({ cm, label: formatHeight(cm) });
  }
  return markers;
}

function Cloud({ top, left }: { top: number; left: string }) {
  return (
    <div
      className="pixel-art absolute select-none text-white opacity-60"
      style={{ top, left, fontSize: 28 }}
      aria-hidden
    >
      &#9729;
    </div>
  );
}
