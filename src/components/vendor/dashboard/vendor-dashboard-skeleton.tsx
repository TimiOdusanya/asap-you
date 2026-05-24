import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-4 sm:p-5 border border-border-muted">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-border-muted overflow-hidden">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-8 w-full rounded-full" />
      </div>
    </div>
  );
}

export function VendorDashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6" role="status" aria-label="Loading dashboard">
      <Skeleton className="h-8 w-40" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-48" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 flex-1 max-w-sm rounded-lg" />
          <Skeleton className="h-10 w-[130px] rounded-lg" />
          <Skeleton className="h-10 w-[130px] rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function VendorOrdersSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)} role="status" aria-label="Loading orders">
      {Array.from({ length: 3 }).map((_, section) => (
        <div key={section} className="space-y-3">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border-muted bg-white p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
