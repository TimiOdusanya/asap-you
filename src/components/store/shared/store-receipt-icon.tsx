"use client";

import { Receipt } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Chowdeck-style receipt icon for orders. */
export function StoreReceiptIcon({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Receipt
      className={cn("shrink-0", className)}
      size={size}
      weight="regular"
      aria-hidden
    />
  );
}
