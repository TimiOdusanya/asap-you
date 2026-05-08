import { StoreCartPageSkeleton } from "@/components/store/skeletons/store-cart-page-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoreCartLoading() {
  return (
    <div className="min-h-[60vh] bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-6xl">
        <Skeleton className="mb-6 h-4 w-32 rounded-md" />
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48 rounded-md sm:h-10" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <StoreCartPageSkeleton />
      </div>
    </div>
  );
}
