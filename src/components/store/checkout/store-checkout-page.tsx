"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { StoreCheckoutPageSkeleton } from "@/components/store/skeletons/store-checkout-page-skeleton";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import { groupCartItemsByVendor } from "@/lib/group-cart-items-by-vendor";
import { computeStoreOrderTotals } from "@/lib/store-checkout-fees";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import { CART_QUERY_KEY, fetchCart } from "@/services/store/cart.api";
import { fetchVendorById, vendorDetailQueryKey } from "@/services/store/vendor-detail.api";
import { fetchStoreSettings, STORE_SETTINGS_QUERY_KEY } from "@/services/store/settings.api";
import { checkout } from "@/services/store/orders.api";
import { savePendingPaymentReference } from "@/lib/pending-payment-reference";
import type { PaymentMethod } from "@/types/order";
import {
  StoreCheckoutCartLines,
  StoreCheckoutDeliveryCard,
  StoreCheckoutSummaryColumn,
  type CheckoutPaymentMethod,
} from "@/components/store/checkout/store-checkout-blocks";

export function StoreCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);

  const [returningCustomer, setReturningCustomer] = React.useState(false);
  const [payment, setPayment] = React.useState<CheckoutPaymentMethod>("cod");
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);

  const vendorIdParam = searchParams.get("vendorId")?.trim() || null;

  const { data: cartRes, isPending: cartPending } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    enabled: Boolean(hydrated && token),
  });

  const allItems = React.useMemo(
    () => (cartRes?.success && cartRes.data ? cartRes.data.items : []),
    [cartRes]
  );
  const vendorGroups = React.useMemo(() => groupCartItemsByVendor(allItems), [allItems]);

  const activeVendorId = React.useMemo(() => {
    if (vendorIdParam && vendorGroups.some((g) => g.vendorId === vendorIdParam)) {
      return vendorIdParam;
    }
    if (vendorGroups.length === 1) return vendorGroups[0].vendorId;
    return null;
  }, [vendorIdParam, vendorGroups]);

  const storeItems = React.useMemo(
    () => allItems.filter((i) => i.vendorId === activeVendorId),
    [allItems, activeVendorId]
  );

  const { data: vendor, isPending: vendorPending } = useQuery({
    queryKey: vendorDetailQueryKey(activeVendorId ?? ""),
    queryFn: () => fetchVendorById(activeVendorId!),
    enabled: Boolean(activeVendorId),
  });

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

  const subtotal = storeItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totals = computeStoreOrderTotals(subtotal, checkoutFees);

  const paymentMethodMap: Record<CheckoutPaymentMethod, PaymentMethod> = {
    cod: "cash",
    wallet: "wallet",
    card: "card",
    transfer: "bank_transfer",
  };

  const queryClient = useQueryClient();

  const checkoutMut = useMutation({
    mutationFn: () =>
      checkout({
        addressId: selectedAddressId!,
        paymentMethod: paymentMethodMap[payment],
        vendorId: activeVendorId ?? undefined,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      const firstOrder = res.data.orders[0];
      const paystackRef = res.data.payment?.reference;
      if (res.data.payment?.authorization_url && paystackRef) {
        savePendingPaymentReference(paystackRef);
        window.location.href = res.data.payment.authorization_url;
        return;
      }
      if (firstOrder) {
        toast.success("Order placed!", {
          description: `Order #${firstOrder.orderId} is being prepared.`,
        });
        router.push(`/store/orders/${firstOrder.orderId}`);
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Checkout failed. Please try again.";
      toast.error(msg);
    },
  });

  const handlePay = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address first.");
      return;
    }
    checkoutMut.mutate();
  };

  const isLoading = !hydrated || (token && (cartPending || (activeVendorId && vendorPending)));

  if (isLoading) {
    return <StoreCheckoutPageSkeleton />;
  }

  if (!token) {
    return (
      <div className="min-h-[50vh] bg-surface-subtle px-4 py-10 sm:px-6">
        <EmptyState
          className="mx-auto w-full max-w-lg"
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
          illustrationAlt=""
          title="Sign in to checkout"
          description="You need an account to complete your order."
          action={{ label: "Sign in", onClick: openSignIn }}
        >
          <Button asChild variant="outline" className="mt-3 rounded-full border-border-muted px-8">
            <Link href="/store/cart">Back to cart</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="min-h-[50vh] bg-surface-subtle px-4 py-10 sm:px-6">
        <EmptyState
          className="mx-auto w-full max-w-lg"
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.cart}
          illustrationAlt=""
          title="Your cart is empty"
          description="Add something from a store before checkout."
          action={{ label: "Browse store", href: "/store" }}
        />
      </div>
    );
  }

  if (!activeVendorId || storeItems.length === 0) {
    return (
      <div className="min-h-[50vh] bg-surface-subtle px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-lg">
          <EmptyState
            illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
            illustrationAlt=""
            title="Choose a store to checkout"
            description="Your cart has items from multiple stores. Pick which store you want to pay for first."
            action={{ label: "Back to cart", href: "/store/cart" }}
          />
          <ul className="mt-6 space-y-2">
            {vendorGroups.map((g) => (
              <li key={g.vendorId}>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto w-full justify-between rounded-2xl py-5"
                >
                  <Link href={`/store/checkout?vendorId=${encodeURIComponent(g.vendorId)}`}>
                    <span className="font-medium">Checkout store</span>
                    <span className="text-content-neutral-muted">
                      {g.itemCount} item{g.itemCount === 1 ? "" : "s"} ·{" "}
                      {g.items[0]?.name}
                      {g.items.length > 1 ? ` +${g.items.length - 1} more` : ""}
                    </span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const storeName = vendor?.businessName ?? "Store";

  return (
    <div className="min-h-screen bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-6xl">
        <nav className="mb-6 flex flex-wrap gap-x-2 gap-y-1 text-xs text-content-neutral-muted sm:text-sm">
          <Link href="/store" className="hover:text-content-link">
            Store
          </Link>
          <span className="text-border-strong">/</span>
          <Link href="/store/cart" className="hover:text-content-link">
            Cart
          </Link>
          <span className="text-border-strong">/</span>
          <span className="text-content-neutral-primary">{storeName}</span>
        </nav>

        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold tracking-tight text-content-neutral-primary sm:text-3xl">
          Checkout · {storeName}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-content-neutral-secondary sm:text-base">
          You&apos;re paying for items from this store only. Return to your cart to checkout other
          stores.
        </p>

        {vendorGroups.length > 1 ? (
          <p className="mt-3 text-sm">
            <button
              type="button"
              className="font-medium text-content-link hover:underline"
              onClick={() => router.push("/store/cart")}
            >
              ← Back to full cart
            </button>
          </p>
        ) : null}

        <StoreCheckoutCartLines items={storeItems} storeName={storeName} />

        <div className="mt-4 flex items-center gap-2">
          <Checkbox
            id="returning"
            checked={returningCustomer}
            onCheckedChange={(v) => setReturningCustomer(v === true)}
          />
          <Label htmlFor="returning" className="cursor-pointer text-sm font-normal">
            Returning customer?
          </Label>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start">
          <StoreCheckoutDeliveryCard
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
          />
          <StoreCheckoutSummaryColumn
            subtotal={totals.subtotal}
            deliveryFee={totals.deliveryFee}
            serviceFee={totals.serviceFee}
            total={totals.total}
            payment={payment}
            setPayment={setPayment}
            onPay={handlePay}
            isPaying={checkoutMut.isPending}
          />
        </div>
      </div>
    </div>
  );
}
