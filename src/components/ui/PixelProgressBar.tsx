interface PixelProgressBarProps {
  value: number;
  maxValue?: number;
  label?: string;
  color?: string;
}

export default function PixelProgressBar({
  value,
  maxValue = 100,
  label,
  color = "bg-pixel-blue",
}: PixelProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs font-bold text-brown">
          <span>{label}</span>
          <span>
            {value}/{maxValue}
          </span>
        </div>
      )}
      <div className="h-5 w-full border-3 border-brown bg-cream-dark shadow-pixel-inset">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
