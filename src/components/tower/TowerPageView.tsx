"use client";

import { useState } from "react";
import type { UserBook, Character } from "@/types";
import PixelButton from "@/components/ui/PixelButton";
import TowerScene from "./TowerScene";
import TowerStats from "./TowerStats";

interface TowerPageViewProps {
  completedBooks: UserBook[];
  totalHeightCm: number;
  totalBooksCompleted: number;
  totalPagesRead: number;
  activeCharacter: Character | null;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 1;

export default function TowerPageView({
  completedBooks,
  totalHeightCm,
  totalBooksCompleted,
  totalPagesRead,
  activeCharacter,
}: TowerPageViewProps) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));

  return (
    <div className="flex flex-col gap-4 p-4 lg:flex-row">
      {/* Tower scene (main area) */}
      <div className="flex-1">
        {/* Zoom controls */}
        <div className="mb-2 flex items-center gap-2">
          <PixelButton size="sm" variant="secondary" onClick={zoomOut} disabled={zoom <= MIN_ZOOM}>
            -
          </PixelButton>
          <span className="text-xs font-bold text-brown">
            {Math.round(zoom * 100)}%
          </span>
          <PixelButton size="sm" variant="secondary" onClick={zoomIn} disabled={zoom >= MAX_ZOOM}>
            +
          </PixelButton>
        </div>

        <TowerScene
          completedBooks={completedBooks}
          totalHeightCm={totalHeightCm}
          activeCharacter={activeCharacter}
          zoom={zoom}
        />
      </div>

      {/* Stats sidebar */}
      <div className="w-full shrink-0 lg:w-72">
        <TowerStats
          totalHeightCm={totalHeightCm}
          totalBooksCompleted={totalBooksCompleted}
          totalPagesRead={totalPagesRead}
          activeCharacter={activeCharacter}
        />
      </div>
    </div>
  );
}
