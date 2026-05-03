import { cn } from "@/lib/utils";

export function AdminBadge({
  variant,
  children,
  className,
}: {
  variant: "success" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  const styles =
    variant === "success"
      ? "bg-green-50 text-green-700 border-green-100"
      : variant === "warning"
        ? "bg-yellow-50 text-yellow-800 border-yellow-100"
        : variant === "danger"
          ? "bg-red-50 text-red-700 border-red-100"
          : "bg-surface-subtle text-content-neutral-secondary border-border-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        styles,
        className
      )}
    >
      {children}
    </span>
  );
}

