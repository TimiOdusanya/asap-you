import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import { cn } from "@/lib/utils";

export type EmptyStateAction =
  | { label: string; href: string; external?: boolean }
  | { label: string; onClick: () => void };

export interface EmptyStateProps {
  title: string;
  description: string;
  /** When omitted, a default store icon is shown. */
  icon?: React.ReactNode;
  /** When omitted and `icon` is also omitted, a default illustration is shown. */
  illustrationSrc?: string;
  illustrationAlt?: string;
  action?: EmptyStateAction;
  /** Shown before the action label (e.g. a leading icon). */
  actionIcon?: React.ReactNode;
  /** Tighter padding and typography for compact panels (e.g. address picker). */
  size?: "default" | "sm";
  /** Optional extra line under the description. */
  hint?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  illustrationSrc = EMPTY_STATE_ILLUSTRATION.platform,
  illustrationAlt = "",
  action,
  actionIcon,
  size = "default",
  hint,
  className,
  children,
}: EmptyStateProps) {
  const isSm = size === "sm";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl bg-white text-center",
        isSm ? "px-4 py-8" : "px-6 py-12 sm:px-10 sm:py-16",
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-2xl bg-surface-subtle text-content-neutral-secondary sm:mb-5",
            isSm
              ? "size-12 [&_svg]:size-6"
              : "size-16 sm:size-20 [&_svg]:size-8 sm:[&_svg]:size-10"
          )}
          aria-hidden
        >
          {icon}
        </div>
      ) : illustrationSrc ? (
        <div
          className={cn(
            "mb-4 w-full overflow-hidden rounded-2xl border border-border-muted bg-surface-subtle sm:mb-5",
            isSm ? "max-w-[260px]" : "max-w-[420px]"
          )}
          aria-hidden={illustrationAlt ? undefined : true}
        >
          <Image
            src={illustrationSrc}
            alt={illustrationAlt}
            width={700}
            height={400}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      ) : (
        <div
          className={cn(
            "mb-4 flex items-center justify-center rounded-2xl bg-surface-subtle text-content-neutral-secondary sm:mb-5",
            isSm
              ? "size-12 [&_svg]:size-6"
              : "size-16 sm:size-20 [&_svg]:size-8 sm:[&_svg]:size-10"
          )}
          aria-hidden
        >
          <Store className="size-8 sm:size-10" strokeWidth={1.5} />
        </div>
      )}
      <h2
        className={cn(
          "font-semibold text-content-neutral-primary",
          isSm ? "text-sm" : "text-base sm:text-lg"
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "mt-2 text-content-neutral-secondary",
          isSm
            ? "max-w-xs text-xs leading-relaxed"
            : "max-w-sm text-sm leading-relaxed sm:max-w-md sm:text-base"
        )}
      >
        {description}
      </p>
      {hint ? (
        <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-content-neutral-muted sm:max-w-sm">
          {hint}
        </p>
      ) : null}
      {action ? (
        <div className={cn("mt-6", !isSm && "sm:mt-8")}>
          {"href" in action ? (
            <Button
              asChild
              className="rounded-full bg-surface-brand px-8 hover:bg-surface-brand/90"
            >
              <Link
                href={action.href}
                {...(action.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {actionIcon}
                {action.label}
              </Link>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={action.onClick}
              className="rounded-full bg-surface-brand px-8 hover:bg-surface-brand/90"
            >
              {actionIcon}
              {action.label}
            </Button>
          )}
        </div>
      ) : null}
      {children}
    </div>
  );
}
