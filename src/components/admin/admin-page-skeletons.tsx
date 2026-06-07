import { Skeleton } from "@/components/ui/skeleton";

export function AdminToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-muted bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-muted bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border-muted">
            {Array.from({ length: cols }).map((_, idx) => (
              <th key={idx} className="px-4 py-3 text-left">
                <Skeleton className="h-4 w-20 rounded-md" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border-muted/50">
              {Array.from({ length: cols }).map((__, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`} className="px-4 py-3">
                  <Skeleton className="h-4 w-full max-w-[140px] rounded-md" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-border-muted bg-white p-5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="mt-4 h-8 w-28 rounded-md" />
          <Skeleton className="mt-4 h-3 w-36 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function AdminReviewCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-border-muted bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="mt-4 h-3 w-full rounded-md" />
          <Skeleton className="mt-2 h-3 w-5/6 rounded-md" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-4">
      <AdminCardsSkeleton count={4} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border-muted bg-white p-5">
          <Skeleton className="h-5 w-40 rounded-md" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
        <div className="rounded-2xl border border-border-muted bg-white p-5">
          <Skeleton className="h-5 w-36 rounded-md" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminTableSkeleton rows={5} cols={5} />
        <AdminReviewCardsSkeleton count={3} />
      </div>
    </div>
  );
}

export function AdminDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
      <div className="flex flex-col gap-4 lg:col-span-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    </div>
  );
}
