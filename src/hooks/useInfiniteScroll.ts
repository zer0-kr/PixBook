"use client";

import { useState, useRef, useEffect } from "react";

interface UseInfiniteScrollOptions {
  totalCount: number;
  pageSize?: number;
  resetDeps?: unknown[];
}

export function useInfiniteScroll({
  totalCount,
  pageSize = 20,
  resetDeps = [],
}: UseInfiniteScrollOptions) {
  const [displayCount, setDisplayCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = displayCount < totalCount;

  // Reset display count when resetDeps change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setDisplayCount(pageSize);
  }, resetDeps);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayCount((prev) => prev + pageSize);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, pageSize]);

  return { displayCount, sentinelRef, hasMore };
}
