function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function SkeletonLoaderCol() {
  return (
    <div className="flex flex-col gap-4 mt-5">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default SkeletonLoader;

function SkeletonCard() {
  return (
    <div className="bg-skeleton-base p-4 rounded min-h-[200px] animate-pulse flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
        <div className="bg-skeleton-base-foreground h-4 w-full p-3 rounded"></div>
        <div className="bg-skeleton-base-foreground h-4 w-full p-3 rounded"></div>
        <div className="bg-skeleton-base-foreground h-4 w-full p-3 rounded "></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-skeleton-base-foreground h-[100px] w-full p-3 rounded"></div>
        <div className="bg-skeleton-base-foreground h-[100px] w-full p-3 rounded"></div>
        <div className="bg-skeleton-base-foreground h-[100px] w-full p-3 rounded "></div>
      </div>
    </div>
  );
}
