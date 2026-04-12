import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Opinionated empty / zero-data panel: gradient frame, optional icon or image, title,
 * description, optional hint, and optional action slot (e.g. `<Button />`).
 *
 * @example
 * <EmptyState
 *   icon={<Package className="text-content-link" weight="duotone" />}
 *   title="No orders yet"
 *   description="When you place one, it will show up here."
 *   action={<Button type="button">Browse store</Button>}
 * />
 */

const sizeStyles = {
  sm: {
    container: "px-4 py-6",
    media: "size-12 rounded-xl",
    iconInner: "size-6",
    title: "text-sm",
    description: "text-xs",
    actionGap: "mt-4",
  },
  md: {
    container: "px-5 py-8 sm:px-6 sm:py-9",
    media: "size-14 rounded-2xl sm:size-16",
    iconInner: "size-7 sm:size-8",
    title: "text-base sm:text-lg",
    description: "text-sm",
    actionGap: "mt-5",
  },
  lg: {
    container: "px-6 py-10 sm:px-8 sm:py-12",
    media: "size-16 rounded-2xl sm:size-20",
    iconInner: "size-9 sm:size-10",
    title: "text-lg sm:text-xl",
    description: "text-base",
    actionGap: "mt-6",
  },
} as const;

export interface EmptyStateProps {
  className?: string;
  align?: "center" | "left";
  size?: keyof typeof sizeStyles;
  image?: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  hint?: string;
}

export function EmptyState({
  className,
  align = "center",
  size = "md",
  image,
  icon,
  title,
  description,
  action,
  hint,
}: EmptyStateProps) {
  const s = sizeStyles[size];
  const isLeft = align === "left";

  const media = image ? (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border border-border-subtle bg-surface-canvas shadow-sm ring-1 ring-black/5",
        s.media,
        !isLeft && "mx-auto"
      )}
    >
      {image}
    </div>
  ) : icon ? (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br from-surface-brand-soft via-surface-brand-tint/90 to-surface-subtle text-content-link shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)] ring-1 ring-surface-brand-muted/40",
        s.media,
        !isLeft && "mx-auto"
      )}
      aria-hidden
    >
      <span
        className={cn(
          "flex items-center justify-center [&_svg]:size-full",
          s.iconInner
        )}
      >
        {icon}
      </span>
    </div>
  ) : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-subtle bg-gradient-to-b from-surface-brand-tint/40 via-surface-subtle to-surface-muted/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        s.container,
        className
      )}
      role="region"
      aria-label={title}
    >
      <div
        className="pointer-events-none absolute -left-1/4 top-0 h-32 w-[150%] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(76,175,80,0.14),transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 translate-x-1/3 translate-y-1/3 rounded-full bg-surface-brand-muted/15 blur-2xl"
        aria-hidden
      />

      <div
        className={cn(
          "relative",
          isLeft
            ? "flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5"
            : "flex flex-col items-center text-center"
        )}
      >
        {media}

        <div className={cn("min-w-0", isLeft ? "flex-1 pt-0.5" : "w-full")}>
          <p
            className={cn(
              "font-semibold tracking-tight text-content-neutral-primary",
              s.title,
              !isLeft && media && "mt-5",
              !isLeft && !media && "mt-0"
            )}
          >
            {title}
          </p>

          {description ? (
            <p
              className={cn(
                "mt-2 leading-relaxed text-content-neutral-secondary",
                s.description,
                !isLeft && "mx-auto max-w-[22rem]"
              )}
            >
              {description}
            </p>
          ) : null}

          {hint ? (
            <p
              className={cn(
                "mt-1.5 text-xs leading-relaxed text-content-neutral-muted",
                !isLeft && "mx-auto max-w-[22rem]"
              )}
            >
              {hint}
            </p>
          ) : null}

          {action ? (
            <div
              className={cn(
                s.actionGap,
                !isLeft &&
                  "flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center sm:gap-3"
              )}
            >
              {action}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
