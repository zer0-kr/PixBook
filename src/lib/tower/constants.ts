import type { TowerMilestone } from "@/types";

/**
 * Height milestones for the book tower, sorted ascending.
 * Each entry maps a cumulative spine-height to a fun real-world comparison.
 * Based on realistic book thickness (~0.006 cm/page).
 */
export const TOWER_MILESTONES: TowerMilestone[] = [
  { height_cm: 2, label: "첫 발걸음", description: "First Step" },
  { height_cm: 5, label: "손바닥 높이", description: "Palm Height" },
  { height_cm: 10, label: "주먹 높이", description: "Fist Height" },
  { height_cm: 20, label: "연필 길이", description: "Pencil Length" },
  { height_cm: 50, label: "베개 높이", description: "Pillow Height" },
  { height_cm: 100, label: "1미터 돌파!", description: "1 Meter Breakthrough" },
  { height_cm: 170, label: "내 키만큼!", description: "As Tall As Me" },
  { height_cm: 300, label: "방 천장", description: "Room Ceiling" },
  { height_cm: 500, label: "전봇대", description: "Electric Pole" },
  { height_cm: 1000, label: "3층 건물", description: "3-Story Building" },
  { height_cm: 2000, label: "아파트", description: "Apartment" },
  { height_cm: 5000, label: "빌딩", description: "Building" },
  { height_cm: 10000, label: "고층빌딩", description: "Skyscraper" },
];

/**
 * Return the next milestone the user has not yet reached, or null if all
 * milestones have been reached.
 */
export function getNextMilestone(
  currentHeightCm: number,
): TowerMilestone | null {
  return TOWER_MILESTONES.find((m) => m.height_cm > currentHeightCm) ?? null;
}

/**
 * Return every milestone the user has already reached (height >= milestone).
 */
export function getReachedMilestones(
  currentHeightCm: number,
): TowerMilestone[] {
  return TOWER_MILESTONES.filter((m) => currentHeightCm >= m.height_cm);
}
