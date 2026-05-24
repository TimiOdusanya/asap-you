"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreCartLineItem } from "@/components/store/cart/store-cart-line-item";
import { formatVendorCategoryLabel } from "@/lib/vendor-category-tiles";
import { computeStoreOrderTotals, type StoreCheckoutFees } from "@/lib/store-checkout-fees";
import type { CartVendorGroup } from "@/lib/group-cart-items-by-vendor";
import type { CartItemDto } from "@/types/store-api";
import { cn } from "@/lib/utils";

function formatMoney(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

function StoreLogo({ src, name }: { src?: string; name: string }) {
  const logo = src?.trim() || "/images/landing/vendor/vendor-hero-1.png";
  const remote = logo.startsWith("http://") || logo.startsWith("https://");

  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-surface-muted shadow-md ring-1 ring-black/5 sm:size-16">
      {remote ? (
        <img src={logo} alt="" className="size-full object-cover" />
      ) : (
        <Image src={logo} alt="" fill className="object-cover" sizes="64px" />
      )}
      <span className="sr-only">{name}</span>
    </div>
  );
}

interface StoreCartVendorSectionProps {
  group: CartVendorGroup;
  storeName?: string;
  storeLogo?: string;
  storeCategory?: string;
  storeIndex: number;
  totalStores: number;
  checkoutFees?: StoreCheckoutFees;
  lineUpdatingProductId: string | null;
  removeBusyProductId: string | null;
  onSetQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export function StoreCartVendorSection({
  group,
  storeName,
  storeLogo,
  storeCategory,
  storeIndex,
  totalStores,
  checkoutFees,
  lineUpdatingProductId,
  removeBusyProductId,
  onSetQty,
  onRemove,
}: StoreCartVendorSectionProps) {
  const displayName = storeName ?? "Store";
  const totals = computeStoreOrderTotals(group.subtotal, checkoutFees);
  const checkoutHref = `/store/checkout?vendorId=${encodeURIComponent(group.vendorId)}`;

  return (
    <article
      className="overflow-hidden rounded-3xl border border-border-muted bg-surface-canvas shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03]"
      aria-labelledby={`cart-vendor-${group.vendorId}`}
    >
      <div className="relative border-b border-border-muted bg-gradient-to-br from-primary/8 via-surface-brand-soft/40 to-surface-canvas px-4 py-4 sm:px-6 sm:py-5">
        {totalStores > 1 ? (
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-content-neutral-muted">
            Store {storeIndex} of {totalStores}
          </p>
        ) : null}
        <div className="flex items-start gap-4">
          <StoreLogo src={storeLogo} name={displayName} />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                {storeName ? (
                  <h2
                    id={`cart-vendor-${group.vendorId}`}
                    className="font-[family-name:var(--font-manrope)] text-lg font-bold leading-tight text-content-neutral-primary sm:text-xl"
                  >
                    {displayName}
                  </h2>
                ) : (
                  <Skeleton className="h-6 w-40 rounded-md sm:h-7" aria-hidden />
                )}
                {storeCategory ? (
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-content-neutral-muted">
                    {formatVendorCategoryLabel(storeCategory)}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/store/vendor/${group.vendorId}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border-muted bg-surface-canvas/90 px-3 py-1.5 text-xs font-medium text-content-neutral-secondary transition-colors hover:border-primary/30 hover:text-primary"
              >
                Add more
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-content-neutral-secondary">
              <Package className="size-4 shrink-0 opacity-70" aria-hidden />
              {group.itemCount} item{group.itemCount === 1 ? "" : "s"} from this store
            </p>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-border-muted/80 px-4 sm:px-6">
        {group.items.map((line: CartItemDto) => (
          <StoreCartLineItem
            key={line.productId}
            line={line}
            lineUpdating={lineUpdatingProductId === line.productId}
            removeBusy={removeBusyProductId === line.productId}
            onDecrease={() => onSetQty(line.productId, line.quantity - 1)}
            onIncrease={() => onSetQty(line.productId, line.quantity + 1)}
            onRemove={() => onRemove(line.productId)}
          />
        ))}
      </ul>

      <div className="border-t border-border-muted bg-surface-subtle/50 px-4 py-4 sm:px-6 sm:py-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Items subtotal</dt>
            <dd className="font-medium tabular-nums text-content-neutral-primary">
              {formatMoney(totals.subtotal)}
            </dd>
          </div>
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Delivery</dt>
            <dd className="font-medium tabular-nums text-content-neutral-primary">
              {formatMoney(totals.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Service fee</dt>
            <dd className="font-medium tabular-nums text-content-neutral-primary">
              {formatMoney(totals.serviceFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border-muted pt-3 text-base">
            <dt className="font-semibold text-content-neutral-primary">Store total</dt>
            <dd className="font-bold tabular-nums text-content-neutral-primary">
              {formatMoney(totals.total)}
            </dd>
          </div>
        </dl>

        <Button
          asChild
          className={cn(
            "mt-4 w-full rounded-full py-6 text-base font-semibold shadow-md",
            "bg-primary hover:bg-primary/90"
          )}
        >
          <Link href={checkoutHref}>
            {storeName ? `Checkout ${displayName}` : "Checkout this store"}
            <ArrowRight className="ml-2 size-4" aria-hidden />
          </Link>
        </Button>
        <p className="mt-2.5 text-center text-[11px] leading-relaxed text-content-neutral-muted sm:text-xs">
          You&apos;ll pay for this store only. Other stores in your cart checkout separately.
        </p>
      </div>
    </article>
  );
}
