import type { ReadingStatus } from "@/types";

/** Spine color palette for book tower display and color picker */
export const SPINE_COLORS = [
  "#E74C3C", // red
  "#3498DB", // blue
  "#2ECC71", // green
  "#F1C40F", // yellow
  "#9B59B6", // purple
  "#E67E22", // orange
  "#FF6B9D", // pink
  "#1ABC9C", // teal
  "#3D2C2E", // brown
  "#8B9DC3", // silver-blue
];

export const STATUS_LABELS: Record<ReadingStatus, string> = {
  want_to_read: "읽고 싶은",
  reading: "읽는 중",
  completed: "완독",
  dropped: "중단",
};
