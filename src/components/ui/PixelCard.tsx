interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function PixelCard({
  children,
  className = "",
  hoverable = true,
}: PixelCardProps) {
  return (
    <div
      className={`${hoverable ? "pixel-card" : "pixel-card-static"} p-4 ${className}`}
    >
      {children}
    </div>
  );
}
