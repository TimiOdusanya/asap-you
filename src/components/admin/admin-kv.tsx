import { cn } from "@/lib/utils";

export function AdminKvGrid({
  items,
  columns = 2,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const cols =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2";

  return (
    <dl className={cn("grid gap-4", cols, className)}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-xs font-medium text-content-neutral-muted">
            {it.label}
          </dt>
          <dd className="mt-1 truncate text-sm text-content-neutral-primary">
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

