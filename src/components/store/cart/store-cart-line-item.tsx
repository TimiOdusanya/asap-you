"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductMedia } from "@/components/store/shared/store-supermarket-product-detail-parts";
import type { CartItemDto } from "@/types/store-api";
import { cn } from "@/lib/utils";

function formatMoney(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

interface StoreCartLineItemProps {
  line: CartItemDto;
  lineUpdating: boolean;
  removeBusy: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export function StoreCartLineItem({
  line,
  lineUpdating,
  removeBusy,
  onDecrease,
  onIncrease,
  onRemove,
}: StoreCartLineItemProps) {
  return (
    <li className="flex gap-4 py-4 first:pt-0 last:pb-0 sm:gap-5">
      <Link
        href={`/store/supermarket/${line.productId}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-24"
      >
        <ProductMedia
          src={line.image?.trim() || "/images/landing/vendor/vendor-hero-1.png"}
          alt={line.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row">
        <div className="min-w-0">
          <Link
            href={`/store/supermarket/${line.productId}`}
            className="block font-medium text-content-neutral-primary hover:underline"
          >
            {line.name}
          </Link>
          <p className="mt-1 text-sm text-content-neutral-secondary">
            {formatMoney(line.price)} each
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          <div className="inline-flex items-center rounded-full border border-border-muted bg-surface-subtle p-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full text-content-neutral-primary transition-colors hover:bg-surface-muted",
                line.quantity <= 1 && "pointer-events-none opacity-40"
              )}
              disabled={lineUpdating}
              onClick={onDecrease}
            >
              <Minus className="size-4" aria-hidden />
            </button>
            <span className="min-w-8 text-center text-sm font-medium tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="inline-flex size-9 items-center justify-center rounded-full text-content-neutral-primary transition-colors hover:bg-surface-muted"
              disabled={lineUpdating}
              onClick={onIncrease}
            >
              <Plus className="size-4" aria-hidden />
            </button>
          </div>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
            <p className="text-base font-semibold text-content-neutral-primary">
              {formatMoney(line.price * line.quantity)}
            </p>
            <button
              type="button"
              disabled={removeBusy}
              onClick={onRemove}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-content-negative transition-colors hover:bg-surface-muted"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
