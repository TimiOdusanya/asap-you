import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { StoreOrderTracking } from "@/components/store/orders/store-order-tracking";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-2xl">
        <Link
          href="/store/orders"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-content-neutral-secondary hover:text-content-neutral-primary"
        >
          <ChevronLeft className="size-4" /> My orders
        </Link>
        <h1 className="text-2xl font-bold text-content-neutral-primary sm:text-3xl">
          Track Order
        </h1>
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            }
          >
            <StoreOrderTracking orderId={orderId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
