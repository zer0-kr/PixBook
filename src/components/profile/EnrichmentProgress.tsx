"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PixelButton, PixelProgressBar } from "@/components/ui";
import { logError } from "@/lib/logger";

const BATCH_SIZE = 5;

interface Candidate {
  id: string;
  title: string;
  author: string;
}

interface EnrichResult {
  enriched: number;
  failed: number;
  results: Array<{ bookId: string; status: string; title?: string }>;
}

export default function EnrichmentProgress() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [totalEnriched, setTotalEnriched] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/books/enrich/candidates", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setCandidates(data.candidates ?? []);
        setTotal(data.total ?? 0);
      })
      .catch((err) => {
        if (err.name !== "AbortError") logError("Failed to fetch enrich candidates:", err);
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  const runEnrichment = useCallback(async () => {
    setIsRunning(true);
    setProcessed(0);
    setTotalEnriched(0);

    let enrichedCount = 0;

    for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
      const batch = candidates.slice(i, i + BATCH_SIZE);
      const bookIds = batch.map((c) => c.id);

      try {
        const res = await fetch("/api/books/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookIds }),
        });

        if (res.ok) {
          const data: EnrichResult = await res.json();
          enrichedCount += data.enriched;
          setTotalEnriched(enrichedCount);
        }
      } catch (err) {
        logError("Enrich batch error:", err);
      }

      setProcessed(Math.min(i + BATCH_SIZE, candidates.length));
    }

    setIsRunning(false);
    router.refresh();
  }, [candidates, router]);

  // Don't render if loading or no candidates
  if (isLoading || total === 0) return null;

  const isDone = processed >= total;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-brown-lighter">
          표지 없는 책 <span className="font-bold text-brown">{total}권</span> 발견
        </p>
        {!isRunning && !isDone && (
          <PixelButton size="sm" onClick={runEnrichment}>
            표지 가져오기
          </PixelButton>
        )}
      </div>

      {(isRunning || isDone) && (
        <>
          <PixelProgressBar
            value={processed}
            maxValue={total}
            label={isRunning ? "보강 진행 중..." : "완료"}
            color={isDone ? "bg-pixel-green" : "bg-pixel-blue"}
          />
          {isDone && (
            <p className="text-xs text-brown-lighter">
              {totalEnriched}권 보강 완료, {total - totalEnriched}권 검색 실패
            </p>
          )}
        </>
      )}
    </div>
  );
}
