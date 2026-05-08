import { Skeleton } from "@/components/ui/skeleton";

export function StoreCheckoutPageSkeleton() {
  return (
    <div className="min-h-screen bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-6xl">
        <Skeleton className="mb-6 h-4 w-56 max-w-full rounded-md" />
        <Skeleton className="h-9 w-40 max-w-[200px] rounded-md sm:h-10" />
        <Skeleton className="mt-2 h-4 w-full max-w-md rounded-md" />
        <div className="mt-8 rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:p-6">
          <Skeleton className="h-6 w-36 rounded-md" />
          <ul className="mt-4 space-y-4 divide-y divide-border-muted">
            {Array.from({ length: 2 }).map((_, i) => (
              <li key={i} className="flex gap-4 pt-4 first:pt-0">
                <Skeleton className="size-20 shrink-0 rounded-xl sm:size-24" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-20 shrink-0 self-start" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border-muted bg-surface-canvas p-4 sm:p-6">
            <Skeleton className="h-6 w-48 rounded-md" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
              <Skeleton className="mt-2 h-11 w-full rounded-full sm:w-48" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-border-muted bg-surface-canvas p-4 sm:p-6">
              <Skeleton className="h-6 w-36 rounded-md" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
              <Skeleton className="mt-6 h-12 w-full rounded-full" />
            </div>
            <div className="rounded-2xl border border-border-muted bg-surface-canvas p-4 sm:p-6">
              <Skeleton className="h-6 w-40 rounded-md" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
