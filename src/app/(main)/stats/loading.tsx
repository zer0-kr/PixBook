export default function StatsLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
        <div className="h-4 w-16 bg-cream-dark animate-pulse mx-auto md:mx-0" />
      </div>

      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Year summary cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="pixel-card-static p-4 animate-pulse text-center"
            >
              <div className="h-6 w-6 bg-cream-dark mx-auto mb-2" />
              <div className="h-5 bg-cream-dark w-12 mx-auto mb-1" />
              <div className="h-3 bg-cream-dark w-16 mx-auto" />
            </div>
          ))}
        </div>

        {/* Monthly chart skeleton */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-24 mb-4" />
          <div className="flex items-end gap-1 h-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full bg-cream-dark border border-brown/20"
                  style={{ height: `${20 + Math.random() * 60}%` }}
                />
                <div className="h-2 bg-cream-dark w-6 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Calendar skeleton */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-32 mb-4" />
          <div className="h-24 bg-cream-dark w-full" />
        </div>

        {/* Genre breakdown skeleton */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-20 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 bg-cream-dark w-16" />
                <div className="flex-1 h-5 bg-cream-dark border border-brown/20" />
                <div className="h-3 bg-cream-dark w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
