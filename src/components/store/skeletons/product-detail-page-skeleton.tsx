import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface-canvas px-6 py-4">
          <Skeleton className="h-4 w-64 max-w-full rounded-md" />
        </div>
        <div className="p-6">
          <Skeleton className="mb-6 h-5 w-40 rounded-md" />
          <div className="rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <Skeleton className="h-96 w-full rounded-lg" />
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />
                  <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />
                  <Skeleton className="h-24 w-24 shrink-0 rounded-lg" />
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-10 w-[90%] rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-10 w-48 rounded-md" />
                <Skeleton className="h-12 w-full max-w-[280px] rounded-full" />
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-11 w-[188px] rounded-md" />
                  <Skeleton className="h-11 w-[188px] rounded-md" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-canvas rounded-lg p-10">
            <Skeleton className="mb-6 h-8 w-64 rounded-md" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-lg p-2">
                  <Skeleton className="aspect-square w-full rounded-lg sm:h-48" />
                  <Skeleton className="h-4 w-[85%] rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
