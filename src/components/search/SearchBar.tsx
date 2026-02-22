"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    (query: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onSearch(query.trim());
      }, 300);
    },
    [onSearch]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Search icon */}
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brown-lighter">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="pixel-art"
        >
          <rect x="5" y="1" width="6" height="1" fill="currentColor" />
          <rect x="3" y="2" width="2" height="1" fill="currentColor" />
          <rect x="11" y="2" width="2" height="1" fill="currentColor" />
          <rect x="2" y="3" width="1" height="2" fill="currentColor" />
          <rect x="13" y="3" width="1" height="2" fill="currentColor" />
          <rect x="1" y="5" width="1" height="3" fill="currentColor" />
          <rect x="14" y="5" width="1" height="3" fill="currentColor" />
          <rect x="2" y="8" width="1" height="2" fill="currentColor" />
          <rect x="13" y="8" width="1" height="2" fill="currentColor" />
          <rect x="3" y="10" width="2" height="1" fill="currentColor" />
          <rect x="11" y="10" width="2" height="1" fill="currentColor" />
          <rect x="5" y="11" width="6" height="1" fill="currentColor" />
          <rect x="11" y="11" width="2" height="1" fill="currentColor" />
          <rect x="12" y="12" width="2" height="1" fill="currentColor" />
          <rect x="13" y="13" width="2" height="1" fill="currentColor" />
          <rect x="14" y="14" width="2" height="1" fill="currentColor" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="책 제목, 저자, ISBN으로 검색..."
        className="pixel-input w-full py-3 pl-10 pr-10 text-base text-brown"
        autoFocus
      />
      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-lighter hover:text-brown"
          aria-label="검색어 지우기"
        >
          ✕
        </button>
      )}
    </div>
  );
}
