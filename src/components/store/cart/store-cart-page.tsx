"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductMedia } from "@/components/store/shared/store-supermarket-product-detail-parts";
import { StoreCartPageSkeleton } from "@/components/store/skeletons/store-cart-page-skeleton";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import {
  CART_QUERY_KEY,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/services/store/cart.api";
import type { CartGetResponse } from "@/types/store-api";
import {
  STORE_DELIVERY_FEE,
  STORE_SERVICE_FEE,
} from "@/lib/store-checkout-fees";
import { cn } from "@/lib/utils";

function formatMoney(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function StoreCartPage() {
  const queryClient = useQueryClient();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);
  const authed = Boolean(hydrated && token);

  const { data: cartRes, isPending, isError, refetch } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    enabled: authed,
  });

  const items = cartRes?.success && cartRes.data ? cartRes.data.items : [];
  const subtotalFromApi = cartRes?.data?.subtotal;
  const subtotal =
    subtotalFromApi ??
    items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + STORE_DELIVERY_FEE + STORE_SERVICE_FEE;

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });

  const updateMut = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem(productId, { quantity }),

    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previous = queryClient.getQueryData<CartGetResponse>(CART_QUERY_KEY);
      queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
        if (!old?.success || !old.data) return old;
        const newItems = old.data.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        const itemCount = newItems.reduce((n, i) => n + i.quantity, 0);
        const subtotal = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
        return {
          ...old,
          data: {
            ...old.data,
            items: newItems,
            itemCount,
            subtotal,
          },
        };
      });
      return { previous };
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
      }
      toast.error("Could not update quantity");
    },

    onSuccess: (res, _variables, context) => {
      if (res.success && res.data?.items) {
        queryClient.setQueryData<CartGetResponse>(CART_QUERY_KEY, (old) => {
          if (!old?.success || !old.data) return old;
          const items = res.data.items;
          const itemCount = items.reduce((n, i) => n + i.quantity, 0);
          const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
          return {
            ...old,
            data: {
              ...old.data,
              items,
              itemCount,
              subtotal,
            },
          };
        });
      } else if (context?.previous) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previous);
        toast.error(res.message ?? "Could not update quantity");
      }
    },
  });

  const removeMut = useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onSuccess: (res) => {
      invalidate();
      toast.success(res.message ?? "Removed from cart");
    },
    onError: () => toast.error("Could not remove item"),
  });

  const setQty = (productId: string, qty: number) => {
    if (qty < 1) return;
    updateMut.mutate({ productId, quantity: qty });
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
              {!authed
                ? "Sign in to view and manage your cart."
                : items.length === 0
                  ? "Add items from the store to see them here."
                  : `${items.length} line${items.length === 1 ? "" : "s"} · ${cartRes?.data?.itemCount ?? items.reduce((n, i) => n + i.quantity, 0)} items`}
            </p>
          </div>
          {authed && items.length > 0 ? (
            <Button
              asChild
              variant="outline"
              className="w-fit rounded-full border-border-muted"
            >
              <Link href="/store">Continue shopping</Link>
            </Button>
          ) : null}
        </div>
                                                
        {!hydrated ? (
          <StoreCartPageSkeleton />
        ) : !authed ? (
          <EmptyState
            className="mx-auto w-full max-w-lg"
            illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
            illustrationAlt=""
            title="Sign in to view your cart"
            description="We will load your basket from your account when you are signed in."
            action={{ label: "Sign in", onClick: openSignIn }}
          />
        ) : isPending ? (
          <StoreCartPageSkeleton />
        ) : isError ? (
          <EmptyState
            className="mx-auto w-full max-w-lg"
            illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
            illustrationAlt=""
            title="Could not load your cart"
            description="Check your connection and try again."
            action={{ label: "Try again", onClick: () => void refetch() }}
          />
        ) : items.length === 0 ? (
          <EmptyState
            className="mx-auto w-full max-w-lg"
            illustrationSrc={EMPTY_STATE_ILLUSTRATION.cart}
            illustrationAlt=""
            title="Your cart is empty"
            description="Start browsing the store."
            action={{ label: "Browse store", href: "/store" }}
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,360px)] lg:items-start">
            <ul className="flex flex-col gap-4">
              {items.map((line) => {
                const lineUpdating =
                  updateMut.isPending && updateMut.variables?.productId === line.productId;
                return (
                  <li
                    key={line.productId}
                    className="flex gap-4 rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:gap-5 sm:p-5"
                  >
                    <Link
                      href={`/store/supermarket/${line.productId}`}
                      className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-28"
                    >
                      <ProductMedia
                        src={
                          line.image?.trim() ||
                          "/images/landing/vendor/vendor-hero-1.png"
                        }
                        alt={line.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row">
                      <div className="min-w-0">
                        <Link
                          href={`/store/supermarket/${line.productId}`}
                          className="mt-0.5 block font-medium text-content-neutral-primary hover:underline"
                        >
                          {line.name}
                        </Link>
                        <p className="mt-2 text-sm font-semibold text-content-neutral-primary">
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
                            onClick={() => setQty(line.productId, line.quantity - 1)}
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
                            onClick={() => setQty(line.productId, line.quantity + 1)}
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
                            disabled={removeMut.isPending}
                            onClick={() => removeMut.mutate(line.productId)}
                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-content-negative transition-colors hover:bg-surface-muted cursor-pointer"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
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
                      Standard delivery time depends on your location and the vendor&apos;s schedule.
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
                      {formatMoney(STORE_DELIVERY_FEE)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-content-neutral-secondary">
                    <dt>Service fee</dt>
                    <dd className="font-medium text-content-neutral-primary">
                      {formatMoney(STORE_SERVICE_FEE)}
                    </dd>
                  </div>
                  <div className="border-t border-border-muted pt-3">
                    <div className="flex justify-between text-base font-semibold text-content-neutral-primary">
                      <dt>Total</dt>
                      <dd>{formatMoney(total)}</dd>
                    </div>
                  </div>
                </dl>

                <Button asChild className="mt-6 w-full rounded-full py-6 text-base">
                  <Link href="/store/checkout">Proceed to checkout</Link>
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
