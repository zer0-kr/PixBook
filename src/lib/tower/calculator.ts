/**
 * Book tower height calculation utilities.
 *
 * BASE_CM_PER_PAGE approximates a physical book where 300 pages ~ 1.8 cm spine height.
 * Based on real paper thickness (~0.05–0.06 mm per page including cover).
 */

export const BASE_CM_PER_PAGE = 0.006;
const DEFAULT_PAGE_COUNT = 200;

/** Pixels per centimetre at zoom 1. Scaled up to maintain visual tower size. */
const BASE_PX_PER_CM = 40;

/**
 * Calculate the spine height (cm) of a book from its page count.
 * Falls back to DEFAULT_PAGE_COUNT (200 pages -> 1.2 cm) when the count is missing.
 */
export function calculateBookHeight(pageCount: number | null | undefined): number {
  const pages = pageCount && pageCount > 0 ? pageCount : DEFAULT_PAGE_COUNT;
  return Math.round(pages * BASE_CM_PER_PAGE * 100) / 100; // two decimal places
}

/**
 * Convert a height in centimetres to screen pixels, taking zoom into account.
 */
export function cmToPixels(cm: number, zoom: number = 1): number {
  return cm * BASE_PX_PER_CM * zoom;
}

/**
 * Human-readable height string.
 *  - Below 100 cm  -> "12cm"
 *  - 100 cm – 99 999 cm -> "1.2m"
 *  - 100 000 cm+   -> "1.2km"
 */
export function formatHeight(cm: number): string {
  if (cm < 100) {
    return `${Math.round(cm * 10) / 10}cm`;
  }
  if (cm < 100_000) {
    const m = cm / 100;
    return `${Math.round(m * 10) / 10}m`;
  }
  const km = cm / 100_000;
  return `${Math.round(km * 10) / 10}km`;
}
