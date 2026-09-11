import React from "react";

export function SkeletonCard() {
  return (
    <div className="flex-none w-[180px] sm:w-[200px] md:w-[220px] rounded-xl overflow-hidden bg-dark-surface border border-dark-border/40 animate-pulse">
      <div className="aspect-[2/3] bg-dark-card w-full" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-dark-card rounded w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-3 bg-dark-card rounded w-1/4" />
          <div className="h-3 bg-dark-card rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] bg-dark-surface animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-dark-card/60" />
      <div className="absolute bottom-16 left-6 md:left-16 max-w-2xl space-y-4">
        <div className="h-8 bg-dark-border/60 rounded w-1/3" />
        <div className="h-12 bg-dark-border/60 rounded w-4/5" />
        <div className="h-4 bg-dark-border/60 rounded w-full" />
        <div className="h-4 bg-dark-border/60 rounded w-2/3" />
        <div className="flex gap-4 pt-4">
          <div className="h-12 bg-dark-border/80 rounded-xl w-36" />
          <div className="h-12 bg-dark-border/60 rounded-xl w-36" />
        </div>
      </div>
    </div>
  );
}
