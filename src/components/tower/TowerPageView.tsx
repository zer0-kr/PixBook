"use client";

import { useState, useMemo } from "react";
import type { UserBook, Character } from "@/types";
import { BASE_CM_PER_PAGE } from "@/lib/tower/calculator";
import PixelButton from "@/components/ui/PixelButton";
import TowerScene from "./TowerScene";
import TowerStats from "./TowerStats";

interface TowerPageViewProps {
  completedBooks: UserBook[];
  activeCharacter: Character | null;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 1;

export default function TowerPageView({
  completedBooks,
  activeCharacter,
}: TowerPageViewProps) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));

  // Extract unique completion years (descending)
  const years = useMemo(() => {
    const s = new Set<number>();
    for (const ub of completedBooks) {
      if (ub.end_date) s.add(new Date(ub.end_date).getFullYear());
    }
    return Array.from(s).sort((a, b) => b - a);
  }, [completedBooks]);

  // Filter books by selected year
  const filteredBooks = useMemo(() => {
    if (selectedYear === "all") return completedBooks;
    return completedBooks.filter(
      (ub) => ub.end_date && new Date(ub.end_date).getFullYear() === selectedYear
    );
  }, [completedBooks, selectedYear]);

  // Recalculate stats from filtered books
  const { totalBooksCompleted, totalPagesRead, totalHeightCm } = useMemo(() => {
    const books = filteredBooks.length;
    const pages = filteredBooks.reduce((s, ub) => s + (ub.book?.page_count ?? 0), 0);
    return { totalBooksCompleted: books, totalPagesRead: pages, totalHeightCm: pages * BASE_CM_PER_PAGE };
  }, [filteredBooks]);

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col gap-4 p-4 lg:flex-row">
      {/* Tower scene (main area) */}
      <div className="flex min-h-0 flex-1 flex-col">
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
          completedBooks={filteredBooks}
          totalHeightCm={totalHeightCm}
          activeCharacter={activeCharacter}
          zoom={zoom}
        />
      </div>

      {/* Stats sidebar */}
      <div className="w-full shrink-0 lg:w-72">
        {/* Year filter dropdown */}
        <select
          value={selectedYear}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedYear(v === "all" ? "all" : Number(v));
          }}
          className="pixel-btn mb-2 bg-cream-dark px-2 py-1 text-xs font-bold text-brown"
        >
          <option value="all">전체</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>

        <TowerStats
          totalHeightCm={totalHeightCm}
          totalBooksCompleted={totalBooksCompleted}
          totalPagesRead={totalPagesRead}
          activeCharacter={activeCharacter}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}
