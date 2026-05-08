import { Skeleton } from "@/components/ui/skeleton";

export function StoreWishlistGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border-muted bg-surface-canvas shadow-sm"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
