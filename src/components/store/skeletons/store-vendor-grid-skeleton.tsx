import { Skeleton } from "@/components/ui/skeleton";

export function StoreVendorGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl sm:h-48 sm:aspect-auto" />
          <div className="space-y-2 py-3 sm:space-y-2 sm:py-4">
            <Skeleton className="h-4 w-[88%] max-w-[200px] rounded-md" />
            <div className="flex justify-between gap-2">
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
