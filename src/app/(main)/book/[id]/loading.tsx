export default function BookDetailLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
        <div className="h-4 w-32 bg-cream-dark animate-pulse mx-auto md:mx-0" />
      </div>

      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        {/* Book info section */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="flex gap-4">
            {/* Cover */}
            <div className="w-28 h-40 bg-cream-dark border-3 border-brown/20 shrink-0" />
            {/* Details */}
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-cream-dark w-3/4" />
              <div className="h-3 bg-cream-dark w-1/2" />
              <div className="h-3 bg-cream-dark w-1/3" />
              <div className="h-3 bg-cream-dark w-1/4" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-24 bg-cream-dark border-2 border-brown/20" />
                <div className="h-8 w-24 bg-cream-dark border-2 border-brown/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Status / Rating section */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-20 mb-4" />
          <div className="h-8 bg-cream-dark w-full mb-3" />
          <div className="h-5 bg-cream-dark w-32" />
        </div>

        {/* Notes section */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-16 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 bg-cream-dark/50 border border-brown/10">
                <div className="h-3 bg-cream-dark w-full mb-2" />
                <div className="h-3 bg-cream-dark w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
