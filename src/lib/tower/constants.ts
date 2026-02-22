import type { TowerMilestone } from "@/types";

/**
 * Height milestones for the book tower, sorted ascending.
 * Each milestone maps to a character unlock threshold so the tower goals
 * and character collection feel connected.
 */
export const TOWER_MILESTONES: TowerMilestone[] = [
  { height_cm: 1, label: "도토리", description: "Acorn" },
  { height_cm: 5, label: "마카롱", description: "Macaron" },
  { height_cm: 10, label: "머그컵", description: "Coffee Mug" },
  { height_cm: 20, label: "운동화", description: "Sneaker" },
  { height_cm: 48, label: "우산", description: "Umbrella" },
  { height_cm: 90, label: "기린", description: "Giraffe" },
  { height_cm: 170, label: "풍차", description: "Windmill" },
  { height_cm: 300, label: "스핑크스", description: "Sphinx" },
  { height_cm: 500, label: "피사의 사탑", description: "Leaning Tower" },
  { height_cm: 1000, label: "도쿄타워", description: "Tokyo Tower" },
  { height_cm: 3330, label: "N서울타워", description: "Namsan Tower" },
  { height_cm: 5550, label: "롯데월드타워", description: "Lotte World Tower" },
  { height_cm: 10000, label: "구름 위 성", description: "Cloud Castle" },
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
