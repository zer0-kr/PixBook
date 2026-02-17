import { createHash } from "crypto";
import type { ReadingStatus } from "@/types";

export interface ImportRowInput {
  title: string;
  author: string;
  publisher: string;
  status: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  droppedDate: string;
  rating: number;
}

const STATUS_MAP: Record<string, ReadingStatus> = {
  "읽은 책": "completed",
  "읽고 싶은 책": "want_to_read",
  "읽고 있는 책": "reading",
};

export function generateIsbn(title: string, author: string): string {
  const hash = createHash("sha256")
    .update(`${title}|${author}`)
    .digest("hex")
    .slice(0, 10);
  return `IMP-${hash}`;
}

export function mapStatus(row: ImportRowInput): ReadingStatus {
  if (row.droppedDate) return "dropped";
  return STATUS_MAP[row.status] ?? "want_to_read";
}

export function mapRating(rating: number): number | null {
  if (!rating || rating <= 0) return null;
  // 0.5 단위로 반올림
  const rounded = Math.round(rating * 2) / 2;
  return Math.max(0.5, Math.min(5, rounded));
}

export function isValidDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d);
}

export function computeCreatedAt(
  csvDate: string,
  rowIndex: number,
  baseTime: number
): string {
  if (isValidDate(csvDate)) {
    const d = new Date(csvDate + "T00:00:00Z");
    d.setSeconds(rowIndex);
    return d.toISOString();
  }
  return new Date(baseTime + rowIndex * 1000).toISOString();
}
