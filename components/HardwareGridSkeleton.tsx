// Loading Skeleton for HardwareGrid
export default function HardwareGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-slate-900/40 backdrop-blur-md rounded-xl border border-slate-800 overflow-hidden animate-pulse"
        >
          {/* Header Skeleton */}
          <div className="p-5 pb-4 border-b border-slate-800/60">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-4 bg-slate-800 rounded" />
                  <div className="w-16 h-3 bg-slate-800 rounded" />
                </div>
                <div className="h-5 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
              <div className="w-16 h-6 bg-slate-800 rounded" />
            </div>
          </div>

          {/* Specs Skeleton */}
          <div className="px-5 py-4 space-y-3 border-b border-slate-800/60">
            <div className="flex justify-between">
              <div className="w-12 h-4 bg-slate-800 rounded" />
              <div className="w-20 h-4 bg-slate-800 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="w-8 h-4 bg-slate-800 rounded" />
              <div className="w-16 h-4 bg-slate-800 rounded" />
            </div>
          </div>

          {/* AI Intelligence Skeleton */}
          <div className="px-5 py-4 border-b border-slate-800/60 space-y-2">
            <div className="w-24 h-3 bg-slate-800 rounded mb-3" />
            <div className="h-2 bg-slate-800 rounded w-full" />
            <div className="h-2 bg-slate-800 rounded w-full" />
            <div className="h-2 bg-slate-800 rounded w-full" />
          </div>

          {/* Description Skeleton */}
          <div className="px-5 py-4 flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-full" />
            <div className="h-4 bg-slate-800 rounded w-2/3" />
            <div className="flex gap-1.5 mt-3">
              <div className="w-12 h-5 bg-slate-800 rounded" />
              <div className="w-16 h-5 bg-slate-800 rounded" />
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="p-5 pt-4 bg-slate-950/40 border-t border-slate-800/60 space-y-2">
            <div className="h-10 bg-slate-800 rounded-lg w-full" />
            <div className="flex gap-2">
              <div className="h-8 bg-slate-800 rounded-lg flex-1" />
              <div className="h-8 bg-slate-800 rounded-lg flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
