export function GameCardSkeleton() {
  return (
    <div className="bg-senai-blueDark rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-senai-blue skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-senai-dark rounded w-3/4 skeleton" />
        <div className="h-4 bg-senai-dark rounded w-full skeleton" />
        <div className="h-4 bg-senai-dark rounded w-5/6 skeleton" />
        <div className="flex justify-between">
          <div className="h-4 bg-senai-dark rounded w-16 skeleton" />
          <div className="h-4 bg-senai-dark rounded w-24 skeleton" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-senai-dark rounded w-20 skeleton" />
          <div className="h-6 bg-senai-dark rounded w-20 skeleton" />
        </div>
      </div>
    </div>
  );
}

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GameDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8 max-w-7xl mx-auto">
      <div className="h-72 md:h-[420px] bg-slate-800/40 border border-white/5 rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="h-12 bg-slate-800/40 border border-white/5 rounded-xl w-3/4" />
          <div className="h-6 bg-slate-800/30 border border-white/5 rounded-lg w-full" />
          <div className="h-6 bg-slate-800/30 border border-white/5 rounded-lg w-5/6" />
          <div className="flex gap-3 pt-2">
            <div className="h-12 bg-slate-800/50 border border-white/5 rounded-xl w-36" />
            <div className="h-12 bg-slate-800/50 border border-white/5 rounded-xl w-36" />
          </div>
          <div className="h-44 bg-slate-900/40 border border-white/5 rounded-2xl mt-6" />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="h-14 bg-slate-800/40 rounded-xl w-full" />
            <div className="h-8 bg-slate-800/30 rounded-lg w-3/4" />
            <div className="h-8 bg-slate-800/30 rounded-lg w-2/3" />
            <div className="h-8 bg-slate-800/30 rounded-lg w-4/5" />
            <div className="flex gap-2 pt-2">
              <div className="h-7 bg-slate-800/40 rounded-lg w-20" />
              <div className="h-7 bg-slate-800/40 rounded-lg w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

