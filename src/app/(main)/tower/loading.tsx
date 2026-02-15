export default function TowerLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
        <div className="h-4 w-16 bg-cream-dark animate-pulse mx-auto md:mx-0" />
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tower scene skeleton */}
          <div className="flex-1 flex justify-center">
            <div className="w-48 h-80 bg-cream-dark border-3 border-brown/20 animate-pulse flex flex-col justify-end items-center p-4 gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-32 h-4 bg-brown/10 border border-brown/20"
                />
              ))}
            </div>
          </div>

          {/* Stats sidebar skeleton */}
          <div className="w-full md:w-64 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="pixel-card-static p-4 animate-pulse"
              >
                <div className="h-3 bg-cream-dark w-1/2 mb-2" />
                <div className="h-6 bg-cream-dark w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
