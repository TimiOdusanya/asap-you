import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const DEFAULT_COUNT = 14;

export function CategoryGridSkeleton({
  className,
  count = DEFAULT_COUNT,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-8",
        className
      )}
      role="status"
      aria-label="Loading categories"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2"
        >
          <Skeleton className="size-[72px] max-w-full rounded-2xl sm:h-[100px] sm:w-[100px]" />
          <Skeleton className="h-3 w-12 rounded-md sm:w-16" />
        </div>
      ))}
    </div>
  );
}
