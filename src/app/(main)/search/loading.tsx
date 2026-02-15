export default function SearchLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
        <div className="h-4 w-20 bg-cream-dark animate-pulse mx-auto md:mx-0" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Search bar skeleton */}
        <div className="mb-6">
          <div className="h-10 w-full bg-cream-dark border-3 border-brown/20 animate-pulse" />
        </div>

        {/* Search result skeletons */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="pixel-card-static p-4 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-16 h-24 bg-cream-dark border-2 border-brown/20 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cream-dark w-3/4" />
                  <div className="h-3 bg-cream-dark w-1/2" />
                  <div className="h-3 bg-cream-dark w-1/3" />
                </div>
                <div className="w-20 h-8 bg-cream-dark border-2 border-brown/20 self-center shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
