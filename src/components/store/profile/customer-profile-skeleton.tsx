import { Skeleton } from "@/components/ui/skeleton";

export function CustomerProfileSkeleton() {
  return (
    <div className="min-h-[60vh] bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-5xl">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>

        <div className="mb-8 flex flex-col gap-6 border-b border-border-muted pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 shrink-0 rounded-2xl sm:size-20" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-8 w-[min(280px,70vw)] max-w-full rounded-lg sm:h-9" />
              <Skeleton className="h-4 w-56 max-w-full rounded-md sm:w-72" />
              <Skeleton className="h-3 w-40 max-w-full rounded-md sm:w-48" />
            </div>
          </div>
          <Skeleton className="h-11 w-36 shrink-0 rounded-full" />
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />
          ))}
        </div>

        <div className="rounded-2xl border border-border-muted bg-surface-canvas p-6 shadow-sm sm:p-8">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-full max-w-md rounded-md" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
