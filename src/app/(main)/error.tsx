"use client";

import { useEffect } from "react";
import { PixelButton } from "@/components/ui";
import { logError } from "@/lib/logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MainError({ error, reset }: ErrorProps) {
  useEffect(() => {
    logError("Page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      {/* Pixel art error icon */}
      <div className="pixel-card-static p-6 mb-6 bg-pixel-red/10">
        <div className="text-4xl mb-2">💥</div>
        <div className="font-pixel text-sm text-pixel-red mb-1">
          ERROR
        </div>
        <div className="w-32 h-1 bg-pixel-red mx-auto mb-4" />
        <p className="text-sm text-brown mb-1 font-bold">
          앗! 문제가 발생했습니다
        </p>
        <p className="text-xs text-brown-lighter max-w-xs">
          페이지를 불러오는 중 오류가 발생했습니다.
          <br />
          다시 시도해 주세요.
        </p>
      </div>

      <PixelButton onClick={reset} variant="primary">
        다시 시도
      </PixelButton>
    </div>
  );
}
