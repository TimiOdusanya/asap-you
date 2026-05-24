"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StoreCartVendorSection } from "@/components/store/cart/store-cart-vendor-section";
import { StoreCartPageSkeleton } from "@/components/store/skeletons/store-cart-page-skeleton";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import { groupCartItemsByVendor } from "@/lib/group-cart-items-by-vendor";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import {
  CART_QUERY_KEY,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/services/store/cart.api";
import { fetchVendorById, vendorDetailQueryKey } from "@/services/store/vendor-detail.api";
import { fetchStoreSettings, STORE_SETTINGS_QUERY_KEY } from "@/services/store/settings.api";
import type { CartGetResponse } from "@/types/store-api";

function cartSummarySubtitle(
  storeCount: number,
  lineCount: number,
  itemCount: number
): string {
  const stores = storeCount === 1 ? "1 store" : `${storeCount} stores`;
  const lines = lineCount === 1 ? "1 line" : `${lineCount} lines`;
  const items = itemCount === 1 ? "1 item" : `${itemCount} items`;
  return `${stores} · ${lines} · ${items}`;
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

  const items = React.useMemo(
    () => (cartRes?.success && cartRes.data ? cartRes.data.items : []),
    [cartRes]
  );
  const vendorGroups = React.useMemo(() => groupCartItemsByVendor(items), [items]);
  const vendorIds = React.useMemo(
    () => vendorGroups.map((g) => g.vendorId),
    [vendorGroups]
  );

  const { data: settingsRes } = useQuery({
    queryKey: STORE_SETTINGS_QUERY_KEY,
    queryFn: fetchStoreSettings,
    staleTime: 5 * 60_000,
  });

  const checkoutFees = React.useMemo(() => {
    if (!settingsRes?.success || !settingsRes.data) return undefined;
    return {
      deliveryFee: settingsRes.data.deliveryFee,
      serviceChargeRate: settingsRes.data.serviceChargeRate,
    };
  }, [settingsRes]);

  const vendorQueries = useQueries({
    queries: vendorIds.map((vendorId) => ({
      queryKey: vendorDetailQueryKey(vendorId),
      queryFn: () => fetchVendorById(vendorId),
      enabled: authed && vendorIds.length > 0,
      staleTime: 60_000,
    })),
  });

  const vendorById = React.useMemo(() => {
    const m = new Map<string, NonNullable<(typeof vendorQueries)[0]["data"]>>();
    vendorIds.forEach((id, index) => {
      const v = vendorQueries[index]?.data;
      if (v) m.set(id, v);
    });
    return m;
  }, [vendorIds, vendorQueries]);

  const itemCount =
    cartRes?.data?.itemCount ?? items.reduce((n, i) => n + i.quantity, 0);

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
        const nextItemCount = newItems.reduce((n, i) => n + i.quantity, 0);
        const nextSubtotal = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
        return {
          ...old,
          data: {
            ...old.data,
            items: newItems,
            itemCount: nextItemCount,
            subtotal: nextSubtotal,
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
          const nextItems = res.data.items;
          const nextItemCount = nextItems.reduce((n, i) => n + i.quantity, 0);
          const nextSubtotal = nextItems.reduce((s, i) => s + i.price * i.quantity, 0);
          return {
            ...old,
            data: {
              ...old.data,
              items: nextItems,
              itemCount: nextItemCount,
              subtotal: nextSubtotal,
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
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success(res.message ?? "Removed from cart");
    },
    onError: () => toast.error("Could not remove item"),
  });

  const setQty = (productId: string, qty: number) => {
    if (qty < 1) return;
    updateMut.mutate({ productId, quantity: qty });
  };

  const lineUpdatingProductId =
    updateMut.isPending && updateMut.variables
      ? updateMut.variables.productId
      : null;
  const removeBusyProductId =
    removeMut.isPending && removeMut.variables ? removeMut.variables : null;

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-surface-subtle to-surface-muted/30 pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-3xl">
        <nav className="mb-6 text-sm text-content-neutral-muted">
          <Link href="/store" className="hover:text-content-link">
            Store
          </Link>
          <span className="mx-2 text-border-strong">/</span>
          <span className="text-content-neutral-primary">Cart</span>
        </nav>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold tracking-tight text-content-neutral-primary sm:text-3xl">
              Your cart
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-content-neutral-secondary sm:text-base">
              {!authed
                ? "Sign in to view and manage your cart."
                : items.length === 0
                  ? "Add items from a store to see them here."
                  : cartSummarySubtitle(vendorGroups.length, items.length, itemCount)}
            </p>
          </div>
          {authed && items.length > 0 ? (
            <Button
              asChild
              variant="outline"
              className="w-fit shrink-0 rounded-full border-border-muted"
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
          <div className="flex flex-col gap-6 sm:gap-8">
            {vendorGroups.length > 1 ? (
              <div className="flex gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3.5 sm:px-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <ShoppingBag className="size-4" aria-hidden />
                </div>
                <p className="text-sm leading-relaxed text-content-neutral-secondary">
                  <span className="font-medium text-content-neutral-primary">
                    One checkout per store.
                  </span>{" "}
                  Each store prepares and delivers separately — use the checkout button on each
                  card when you&apos;re ready.
                </p>
              </div>
            ) : null}

            {vendorGroups.map((group, index) => {
              const vendor = vendorById.get(group.vendorId);
              return (
                <StoreCartVendorSection
                  key={group.vendorId}
                  group={group}
                  storeIndex={index + 1}
                  totalStores={vendorGroups.length}
                  storeName={vendor?.businessName}
                  storeLogo={vendor?.logo}
                  storeCategory={vendor?.category}
                  checkoutFees={checkoutFees}
                  lineUpdatingProductId={lineUpdatingProductId}
                  removeBusyProductId={removeBusyProductId}
                  onSetQty={setQty}
                  onRemove={(productId) => removeMut.mutate(productId)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
