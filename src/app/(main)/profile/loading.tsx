export default function ProfileLoading() {
  return (
    <>
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b-3 border-brown bg-cream px-4 py-3">
        <div className="h-4 w-16 bg-cream-dark animate-pulse mx-auto md:mx-0" />
      </div>

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        {/* Nickname section */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-16 mb-4" />
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-cream-dark border-2 border-brown/20" />
            <div className="w-16 h-10 bg-cream-dark border-2 border-brown/20" />
          </div>
        </div>

        {/* Account info */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-20 mb-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 bg-cream-dark w-12" />
              <div className="h-3 bg-cream-dark w-32" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-cream-dark w-12" />
              <div className="h-3 bg-cream-dark w-24" />
            </div>
          </div>
        </div>

        {/* Tower stats */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-20 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-5 bg-cream-dark w-12 mx-auto mb-1" />
                <div className="h-2 bg-cream-dark w-10 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Export section */}
        <div className="pixel-card-static p-4 animate-pulse">
          <div className="h-3 bg-cream-dark w-28 mb-4" />
          <div className="h-3 bg-cream-dark w-3/4 mb-3" />
          <div className="flex gap-2">
            <div className="w-28 h-8 bg-cream-dark border-2 border-brown/20" />
            <div className="w-28 h-8 bg-cream-dark border-2 border-brown/20" />
          </div>
        </div>
      </div>
    </>
  );
}
