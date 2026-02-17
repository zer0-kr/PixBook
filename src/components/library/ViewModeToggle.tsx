"use client";

type ViewMode = "grid" | "list" | "cover";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_MODES: Array<{ mode: ViewMode; label: string; icon: React.ReactNode }> = [
  { mode: "grid", label: "그리드 뷰", icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="1" width="4" height="4" /><rect x="6" y="1" width="4" height="4" /><rect x="11" y="1" width="4" height="4" />
      <rect x="1" y="6" width="4" height="4" /><rect x="6" y="6" width="4" height="4" /><rect x="11" y="6" width="4" height="4" />
      <rect x="1" y="11" width="4" height="4" /><rect x="6" y="11" width="4" height="4" /><rect x="11" y="11" width="4" height="4" />
    </svg>
  )},
  { mode: "list", label: "리스트 뷰", icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="2" width="14" height="3" />
      <rect x="1" y="7" width="14" height="3" />
      <rect x="1" y="12" width="14" height="3" />
    </svg>
  )},
  { mode: "cover", label: "커버 뷰", icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" />
      <rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" />
    </svg>
  )},
];

export type { ViewMode };

export default function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
  return (
    <div className="flex gap-0.5">
      {VIEW_MODES.map(({ mode, label, icon }) => (
        <button
          key={mode}
          aria-label={label}
          onClick={() => onViewModeChange(mode)}
          className={`pixel-btn p-1.5 transition-colors ${
            viewMode === mode
              ? "bg-pixel-blue text-white"
              : "bg-cream-dark text-brown hover:bg-cream-dark/80"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
