"use client";

import { useEffect, useCallback, type ReactNode } from "react";

interface PixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function PixelModal({
  isOpen,
  onClose,
  title,
  children,
}: PixelModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-brown/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="pixel-border relative z-10 w-full max-w-lg bg-cream p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-3 border-brown pb-3">
          <h2 className="font-pixel text-sm text-brown">{title}</h2>
          <button
            onClick={onClose}
            className="pixel-btn bg-pixel-red px-2 py-1 text-xs text-white"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
