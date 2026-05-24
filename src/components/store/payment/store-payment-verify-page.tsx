"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import { verifyPayment } from "@/services/store/orders.api";
import {
  clearPendingPaymentReference,
  readPendingPaymentReference,
} from "@/lib/pending-payment-reference";

function resolvePaymentReference(searchParams: URLSearchParams): string | null {
  return (
    searchParams.get("reference")?.trim() ||
    searchParams.get("trxref")?.trim() ||
    readPendingPaymentReference()
  );
}

export function StorePaymentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);
  const [reference] = React.useState(() => resolvePaymentReference(searchParams));
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const verifyMut = useMutation({
    mutationFn: (ref: string) => verifyPayment(ref),
    onSuccess: (res) => {
      clearPendingPaymentReference();
      const firstOrder = res.data.orders[0];
      toast.success("Payment confirmed", {
        description: res.message || "Your order is now being processed.",
      });
      if (firstOrder) {
        router.replace(`/store/orders/${firstOrder.orderId}`);
      } else {
        router.replace("/store/orders");
      }
    },
    onError: (err: unknown) => {
      const msg = isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          "We could not verify your payment. Please try again."
        : "We could not verify your payment. Please try again.";
      setErrorMessage(msg);
    },
  });

  const hasAttemptedRef = React.useRef(false);

  React.useEffect(() => {
    if (!hydrated || !token || !reference || hasAttemptedRef.current) return;
    hasAttemptedRef.current = true;
    verifyMut.mutate(reference);
  }, [hydrated, token, reference, verifyMut.mutate]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="size-10 text-amber-500" />
        <h1 className="text-xl font-semibold text-content-neutral-primary">Sign in to confirm payment</h1>
        <p className="text-sm text-content-neutral-secondary">
          We received your payment return. Sign in with the same account you used at checkout to
          finish verification.
        </p>
        <Button className="rounded-full px-8" onClick={openSignIn}>
          Sign in
        </Button>
      </div>
    );
  }

  if (!reference) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="size-10 text-red-400" />
        <h1 className="text-xl font-semibold text-content-neutral-primary">Missing payment reference</h1>
        <p className="text-sm text-content-neutral-secondary">
          We could not find a Paystack reference on this page. Start checkout again or open your
          orders list.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full">
            <Link href="/store/cart">Back to cart</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/store/orders">My orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertCircle className="size-10 text-red-400" />
        <h1 className="text-xl font-semibold text-content-neutral-primary">Payment not verified</h1>
        <p className="text-sm text-content-neutral-secondary">{errorMessage}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            className="rounded-full"
            onClick={() => {
              setErrorMessage(null);
              verifyMut.mutate(reference);
            }}
            disabled={verifyMut.isPending}
          >
            {verifyMut.isPending ? "Verifying…" : "Try again"}
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/store/orders">My orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Loader2 className="size-10 animate-spin text-primary" />
      <h1 className="text-xl font-semibold text-content-neutral-primary">Confirming your payment</h1>
      <p className="text-sm text-content-neutral-secondary">
        Please wait while we verify your payment with Paystack…
      </p>
      <p className="text-xs text-content-neutral-muted">Reference: {reference}</p>
    </div>
  );
}
