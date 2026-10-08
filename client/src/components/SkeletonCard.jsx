import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="rounded-3xl glass-card overflow-hidden border border-slate-200/80 dark:border-slate-800/80 animate-pulse">
      {/* Image Area Skeleton */}
      <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800/60" />
      {/* Content Area Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800/80 rounded-md w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800/50 rounded-md w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-800/70 rounded-full w-20" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800/50 rounded-md w-12" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

