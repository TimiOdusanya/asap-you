import React, { Suspense } from "react";
import { StoreCheckoutPage } from "@/components/store/checkout/store-checkout-page";
import { StoreCheckoutPageSkeleton } from "@/components/store/skeletons/store-checkout-page-skeleton";

export default function StoreCheckoutRoutePage() {
  return (
    <Suspense fallback={<StoreCheckoutPageSkeleton />}>
      <StoreCheckoutPage />
    </Suspense>
  );
}
