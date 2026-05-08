"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { StoreCheckoutPageSkeleton } from "@/components/store/skeletons/store-checkout-page-skeleton";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import { CART_QUERY_KEY, fetchCart } from "@/services/store/cart.api";
import {
  STORE_DELIVERY_FEE,
  STORE_SERVICE_FEE,
} from "@/lib/store-checkout-fees";
import {
  StoreCheckoutCartLines,
  StoreCheckoutDeliveryCard,
  StoreCheckoutSummaryColumn,
  type CheckoutPaymentMethod,
} from "@/components/store/checkout/store-checkout-blocks";

export function StoreCheckoutPage() {
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);

  const [returningCustomer, setReturningCustomer] = React.useState(false);
  const [payment, setPayment] = React.useState<CheckoutPaymentMethod>("cod");

  const { data: cartRes, isPending } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    enabled: Boolean(hydrated && token),
  });

  const items = cartRes?.success && cartRes.data ? cartRes.data.items : [];
  const subtotalFromApi = cartRes?.data?.subtotal;
  const subtotal =
    subtotalFromApi ??
    items.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + STORE_DELIVERY_FEE + STORE_SERVICE_FEE;

  const handlePay = () => {
    toast.success("Checkout recorded", {
      description:
        "Payment capture will connect to your provider on the backend.",
    });
  };

  if (!hydrated || (token && isPending)) {
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

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] bg-surface-subtle px-4 py-10 sm:px-6">
        <EmptyState
          className="mx-auto w-full max-w-lg"
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.cart}
          illustrationAlt=""
          title="Your cart is empty"
          description="Add something from the store before checkout."
          action={{ label: "Browse store", href: "/store" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-6xl">
        <nav className="mb-6 flex flex-wrap gap-x-2 gap-y-1 text-xs text-content-neutral-muted sm:text-sm">
          <Link href="/store" className="hover:text-content-link">
            Store
          </Link>
          <span className="text-border-strong">/</span>
          <Link href="/store/supermarkets" className="hover:text-content-link">
            Supermarket
          </Link>
          <span className="text-border-strong">/</span>
          <span className="text-content-neutral-primary">Checkout</span>
        </nav>

        <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-semibold tracking-tight text-content-neutral-primary sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-content-neutral-secondary sm:text-base">
          Review your order and delivery details.
        </p>

        <StoreCheckoutCartLines items={items} />

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
          <StoreCheckoutDeliveryCard />
          <StoreCheckoutSummaryColumn
            subtotal={subtotal}
            total={total}
            payment={payment}
            setPayment={setPayment}
            onPay={handlePay}
          />
        </div>
      </div>
    </div>
  );
}
