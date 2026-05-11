import { Skeleton } from "@/components/ui/skeleton";

export function StoreVendorPageSkeleton() {
  return (
    <div className="min-h-screen bg-surface-subtle pb-10 pt-6 sm:pb-14 sm:pt-8">
      <div className="mx-auto max-w-[95%] md:max-w-[92%] lg:max-w-6xl">
        <Skeleton className="mb-5 h-3 w-36 rounded-md" />
        <div className="overflow-hidden rounded-3xl border border-border-muted bg-surface-canvas shadow-md">
          <div className="relative min-h-[200px] sm:min-h-[240px]">
            <Skeleton className="absolute inset-0 rounded-none opacity-40" />
            <div className="relative flex min-h-[200px] flex-col justify-between p-4 sm:min-h-[240px] sm:p-6">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="mt-10 flex items-end justify-between gap-4 sm:mt-0">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-10 w-56 max-w-[80%] rounded-md sm:h-12 sm:w-72" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
                <Skeleton className="size-28 shrink-0 rounded-2xl sm:size-36" />
              </div>
            </div>
          </div>
          <div className="grid gap-3 border-t border-border-muted p-4 sm:grid-cols-3 sm:p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-32 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-6 divide-y divide-border-muted">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 py-4 sm:gap-4 sm:py-5">
              <Skeleton className="size-[4.5rem] shrink-0 rounded-xl sm:size-24" />
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-[min(100%,220px)] rounded-md" />
                  <Skeleton className="h-3 w-full max-w-md rounded-md" />
                  <Skeleton className="h-3 w-2/3 max-w-sm rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
                <Skeleton className="mt-2 h-9 w-full rounded-full sm:mt-0 sm:w-24 sm:self-center" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
