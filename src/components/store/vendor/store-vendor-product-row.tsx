"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  ProductMedia,
  formatStoreMoney,
} from "@/components/store/shared/store-supermarket-product-detail-parts";
import type { CartItemDto, ProductDto } from "@/types/store-api";
import {
  getMaxPurchasableQuantity,
  isProductOutOfStock,
} from "@/lib/product-availability";
import { cn } from "@/lib/utils";

interface StoreVendorProductRowProps {
  product: ProductDto;
  line?: CartItemDto;
  addBusy: boolean;
  updateBusy: boolean;
  authed: boolean;
  onRequireAuth: () => void;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function StoreVendorProductRow({
  product,
  line,
  addBusy,
  updateBusy,
  authed,
  onRequireAuth,
  onAdd,
  onIncrement,
  onDecrement,
}: StoreVendorProductRowProps) {
  const img = product.images[0]?.trim() || PRODUCT_IMAGE_PLACEHOLDER;
  const outOfStock = isProductOutOfStock(product);
  const maxQty = getMaxPurchasableQuantity(product);
  const qty = line?.quantity ?? 0;
  const inCart = qty > 0;

  const handleAdd = () => {
    if (outOfStock) return;
    if (!authed) {
      onRequireAuth();
      return;
    }
    onAdd();
  };

  return (
    <article
      className={cn(
        "group flex gap-3 py-4 sm:gap-4 sm:py-5 rounded-lg border border-border-muted sm:px-4",
        outOfStock && "opacity-75 bg-surface-subtle/40"
      )}
    >
      <Link
        href={`/store/supermarket/${product._id}`}
        className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-surface-muted ring-1 ring-border-muted/60 sm:size-24"
      >
        <ProductMedia
          src={img}
          alt={product.name}
          fill
          sizes="96px"
          className={cn(
            "object-cover transition-transform duration-200 group-hover:scale-[1.04]",
            outOfStock && "grayscale"
          )}
        />
        {outOfStock ? (
          <span className="absolute inset-x-0 bottom-0 bg-content-negative/90 py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-white">
            Out of stock
          </span>
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:gap-6">
        <div className="min-w-0 flex-1">
          <Link
            href={`/store/supermarket/${product._id}`}
            className="font-[family-name:var(--font-manrope)] text-[15px] font-semibold leading-snug text-content-neutral-primary transition-colors hover:text-primary sm:text-base"
          >
            {product.name}
          </Link>
          {product.description ? (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-content-neutral-secondary">
              {product.description}
            </p>
          ) : null}
          {outOfStock ? (
            <p className="mt-1.5 text-xs font-medium text-content-negative">
              Currently unavailable — check back later
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-xs font-medium uppercase tracking-wide text-content-neutral-muted">
              From
            </span>
            <span className="text-base font-bold tabular-nums text-content-neutral-primary sm:text-lg">
              {formatStoreMoney(product.price)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex shrink-0 flex-col items-stretch gap-1.5 sm:mt-0 sm:items-end sm:justify-center">
          {outOfStock ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full cursor-not-allowed rounded-full border-border-muted text-content-neutral-muted sm:w-auto sm:px-5"
              disabled
            >
              Out of stock
            </Button>
          ) : !inCart ? (
            <Button
              type="button"
              size="sm"
              className="w-full gap-1.5 rounded-full px-4 sm:w-auto sm:px-5"
              disabled={addBusy}
              onClick={handleAdd}
            >
              <ShoppingBag className="size-4" aria-hidden />
              Add
            </Button>
          ) : (
            <div className="flex flex-col items-stretch gap-1 sm:items-end">
              <div className="inline-flex items-center justify-end rounded-full border border-border-muted bg-surface-subtle/80 p-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  disabled={updateBusy}
                  onClick={() => {
                    if (!authed) {
                      onRequireAuth();
                      return;
                    }
                    onDecrement();
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-9 px-1 text-center text-sm font-bold tabular-nums text-content-neutral-primary">
                  {qty}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  disabled={updateBusy || qty >= maxQty}
                  onClick={() => {
                    if (!authed) {
                      onRequireAuth();
                      return;
                    }
                    onIncrement();
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <p
                className={cn(
                  "text-center text-[11px] text-content-neutral-muted sm:text-right",
                  qty >= maxQty && "text-content-warning"
                )}
              >
                {qty >= maxQty ? "Max in cart" : maxQty > 0 ? `Up to ${maxQty}` : "Out of stock"}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
