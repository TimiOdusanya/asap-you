"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MOCK_CART_LINES,
  MOCK_DELIVERY_FEE,
  MOCK_SERVICE_FEE,
  type MockCartLine,
} from "@/lib/mock-store-cart";
import { cn } from "@/lib/utils";

function formatMoney(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function StoreCartPage() {
  const [lines, setLines] = React.useState<MockCartLine[]>(MOCK_CART_LINES);

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const total = subtotal + MOCK_DELIVERY_FEE + MOCK_SERVICE_FEE;

  const setQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty } : l))
    );
  };

  const removeLine = (id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-[60vh] bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-6xl">
        <nav className="mb-6 text-sm text-content-neutral-muted">
          <Link href="/store" className="hover:text-content-link">
            Store
          </Link>
          <span className="mx-2 text-border-strong">/</span>
          <span className="text-content-neutral-primary">Cart</span>
        </nav>

        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold tracking-tight text-content-neutral-primary sm:text-3xl">
              Your cart
            </h1>
            <p className="mt-1 max-w-xl text-sm text-content-neutral-secondary sm:text-base">
              {lines.length === 0
                ? "Add items from the store to see them here."
                : `${lines.length} item${lines.length === 1 ? "" : "s"} from your favourite vendors.`}
            </p>
          </div>
          {lines.length > 0 ? (
            <Button
              asChild
              variant="outline"
              className="w-fit rounded-full border-border-muted"
            >
              <Link href="/store">Continue shopping</Link>
            </Button>
          ) : null}
        </div>

        {lines.length === 0 ? (
          <div className="rounded-3xl border border-border-muted bg-surface-canvas px-6 py-16 text-center shadow-sm">
            <p className="text-content-neutral-secondary">
              Your cart is empty. Start browsing the store.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/store">Browse store</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-start">
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-4 rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:gap-5 sm:p-5"
                >
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-28">
                    <Image
                      src={line.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-primary">
                        {line.storeName}
                      </p>
                      <h2 className="mt-0.5 font-medium text-content-neutral-primary">
                        {line.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-content-neutral-muted">
                        {line.variant}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-content-neutral-primary">
                        {formatMoney(line.unitPrice)} each
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                      <div className="inline-flex items-center rounded-full border border-border-muted bg-surface-subtle p-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className={cn(
                            "inline-flex size-9 items-center justify-center rounded-full text-content-neutral-primary transition-colors hover:bg-surface-muted",
                            line.qty <= 1 && "pointer-events-none opacity-40"
                          )}
                          onClick={() => setQty(line.id, line.qty - 1)}
                        >
                          <Minus className="size-4" aria-hidden />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium tabular-nums">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="inline-flex size-9 items-center justify-center rounded-full text-content-neutral-primary transition-colors hover:bg-surface-muted"
                          onClick={() => setQty(line.id, line.qty + 1)}
                        >
                          <Plus className="size-4" aria-hidden />
                        </button>
                      </div>
                      <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
                        <p className="text-base font-semibold text-content-neutral-primary">
                          {formatMoney(line.unitPrice * line.qty)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-content-negative transition-colors hover:bg-surface-muted"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border-muted bg-surface-canvas p-6 shadow-sm">
                <div className="flex items-start gap-3 rounded-xl bg-surface-brand-soft/60 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Truck className="size-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-content-neutral-primary">
                      Delivery estimate
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-content-neutral-secondary">
                      Standard delivery time is dependent on your location and the vendor&apos;s delivery time.
                    </p>
                  </div>
                </div>

                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-content-neutral-secondary">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-content-neutral-primary">
                      {formatMoney(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-content-neutral-secondary">
                    <dt>Delivery</dt>
                    <dd className="font-medium text-content-neutral-primary">
                      {formatMoney(MOCK_DELIVERY_FEE)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-content-neutral-secondary">
                    <dt>Service fee</dt>
                    <dd className="font-medium text-content-neutral-primary">
                      {formatMoney(MOCK_SERVICE_FEE)}
                    </dd>
                  </div>
                  <div className="border-t border-border-muted pt-3">
                    <div className="flex justify-between text-base font-semibold text-content-neutral-primary">
                      <dt>Total</dt>
                      <dd>{formatMoney(total)}</dd>
                    </div>
                  </div>
                </dl>

                <Button className="mt-6 w-full rounded-full py-6 text-base">
                  Proceed to checkout
                </Button>
                <p className="mt-3 text-center text-xs text-content-neutral-muted">
                  Secure checkout · You can review everything before you pay
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
