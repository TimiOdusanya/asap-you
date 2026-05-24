import { Skeleton } from "@/components/ui/skeleton";

export function StoreCartPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-border-muted bg-surface-canvas"
        >
          <div className="flex gap-4 border-b border-border-muted px-4 py-5 sm:px-6">
            <Skeleton className="size-14 shrink-0 rounded-2xl sm:size-16" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="space-y-4 px-4 py-4 sm:px-6">
            <div className="flex gap-4">
              <Skeleton className="size-20 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </div>
          <div className="space-y-3 border-t border-border-muted bg-surface-subtle/50 px-4 py-5 sm:px-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
