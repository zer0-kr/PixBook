export default function CharactersLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
        <div className="h-4 w-24 bg-cream-dark animate-pulse mx-auto md:mx-0" />
      </div>

      <div className="p-4 md:p-6">
        {/* Character grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="pixel-card-static p-4 animate-pulse"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-cream-dark border-2 border-brown/20" />
                <div className="h-3 bg-cream-dark w-16" />
                <div className="h-2 bg-cream-dark w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
