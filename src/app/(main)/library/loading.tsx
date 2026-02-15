export default function LibraryLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
        <div className="h-4 w-16 bg-cream-dark animate-pulse mx-auto md:mx-0" />
      </div>

      <div className="p-4 md:p-6">
        {/* Filter bar skeleton */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-cream-dark border-3 border-brown/20 animate-pulse"
            />
          ))}
        </div>

        {/* Book card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="pixel-card-static p-4 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="w-16 h-24 bg-cream-dark border-2 border-brown/20 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-cream-dark w-3/4" />
                  <div className="h-3 bg-cream-dark w-1/2" />
                  <div className="h-3 bg-cream-dark w-1/3" />
                  <div className="h-6 bg-cream-dark w-20 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
