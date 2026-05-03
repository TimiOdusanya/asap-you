import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const DEFAULT_COUNT = 6;

export function ProductGridSkeleton({
  className,
  count = DEFAULT_COUNT,
  viewMode = "grid",
}: {
  className?: string;
  count?: number;
  viewMode?: "grid" | "list";
}) {
  if (viewMode === "list") {
    return (
      <div className={cn("space-y-4", className)} role="status" aria-label="Loading products">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-border-muted bg-white p-4"
          >
            <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3 max-w-xs" />
              <Skeleton className="h-3 w-full max-w-sm" />
              <Skeleton className="mt-auto h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-border-muted bg-white"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
