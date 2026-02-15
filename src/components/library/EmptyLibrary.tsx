"use client";

import Link from "next/link";
import { PixelButton } from "@/components/ui";

export default function EmptyLibrary() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Pixel-art styled empty state */}
      <div className="mb-6 text-6xl select-none" aria-hidden="true">
        <span className="pixel-art inline-block">
          {"[ ]"}
        </span>
      </div>

      <p className="font-pixel text-sm text-brown mb-2">
        아직 책이 없어요!
      </p>
      <p className="text-sm text-brown-lighter mb-8">
        검색에서 책을 찾아 서재에 추가해보세요.
      </p>

      <Link href="/search">
        <PixelButton variant="primary" size="lg">
          책 검색하러 가기
        </PixelButton>
      </Link>
    </div>
  );
}
