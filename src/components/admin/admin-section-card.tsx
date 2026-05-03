import { cn } from "@/lib/utils";

export function AdminSectionCard({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border-muted bg-white", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border-muted p-5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-content-neutral-primary">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-content-neutral-secondary">{subtitle}</p>
          ) : null}
        </div>
        {right ? <div className="flex items-center gap-2">{right}</div> : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

