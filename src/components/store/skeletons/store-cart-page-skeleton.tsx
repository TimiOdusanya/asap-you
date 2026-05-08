import { Skeleton } from "@/components/ui/skeleton";

export function StoreCartPageSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-start">
      <ul className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <li
            key={i}
            className="flex gap-4 rounded-2xl border border-border-muted bg-surface-canvas p-4 sm:p-5"
          >
            <Skeleton className="size-24 shrink-0 rounded-xl sm:size-28" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
      <Skeleton className="h-80 rounded-2xl" />
    </div>
  );
}
