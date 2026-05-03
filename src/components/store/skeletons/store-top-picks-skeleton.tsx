import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const DEFAULT_COUNT = 8;

export function StoreTopPicksSkeleton({
  className,
  count = DEFAULT_COUNT,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8",
        className
      )}
      role="status"
      aria-label="Loading stores"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl sm:h-48" />
          <div className="space-y-2 py-3 sm:py-4">
            <Skeleton className="h-4 w-4/5" />
            <div className="flex justify-between gap-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
