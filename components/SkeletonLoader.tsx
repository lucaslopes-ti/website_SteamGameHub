export function GameCardSkeleton() {
  return (
    <div className="bg-steam-dark rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-steam-blue skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-steam-darker rounded w-3/4 skeleton" />
        <div className="h-4 bg-steam-darker rounded w-full skeleton" />
        <div className="h-4 bg-steam-darker rounded w-5/6 skeleton" />
        <div className="flex justify-between">
          <div className="h-4 bg-steam-darker rounded w-16 skeleton" />
          <div className="h-4 bg-steam-darker rounded w-24 skeleton" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-steam-darker rounded w-20 skeleton" />
          <div className="h-6 bg-steam-darker rounded w-20 skeleton" />
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
    <div className="animate-pulse space-y-8">
      <div className="h-64 md:h-96 bg-steam-blue rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-10 bg-steam-dark rounded w-3/4" />
          <div className="h-6 bg-steam-dark rounded w-full" />
          <div className="h-6 bg-steam-dark rounded w-5/6" />
          <div className="h-32 bg-steam-dark rounded" />
        </div>
        <div className="md:col-span-1">
          <div className="bg-steam-dark rounded-lg p-6 space-y-4">
            <div className="h-8 bg-steam-darker rounded w-1/2" />
            <div className="h-4 bg-steam-darker rounded w-full" />
            <div className="h-4 bg-steam-darker rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

