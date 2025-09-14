import React from "react";

interface SkeletonTableLoaderProps {
  rows?: number;
  columns?: number;
}

const SkeletonTableLoader: React.FC<SkeletonTableLoaderProps> = ({
  rows = 5,
  columns = 3,
}) => {
  return (
    <div className="w-full  bg-skeleton-base rounded-lg overflow-hidden p-4">
      <div className="grid grid-cols-3 mb-3 rounded-lg ">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse bg-skeleton-base-foreground"
          />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-10 m-2 rounded-md animate-pulse bg-skeleton-base-foreground"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTableLoader;
