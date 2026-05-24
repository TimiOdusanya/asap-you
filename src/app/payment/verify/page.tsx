import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { StorePaymentVerifyPage } from "@/components/store/payment/store-payment-verify-page";

export default function PaymentVerifyRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <StorePaymentVerifyPage />
    </Suspense>
  );
}
