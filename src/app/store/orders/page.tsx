import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StoreReceiptIcon } from "@/components/store/shared/store-receipt-icon";
import { StoreOrderHistory } from "@/components/store/orders/store-order-history";

export default function OrderHistoryPage() {
  return (
    <div className="min-h-screen bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-2xl">
        <Link
          href="/store"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-content-neutral-secondary hover:text-content-neutral-primary"
        >
          <ChevronLeft className="size-4" /> Back to store
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <StoreReceiptIcon size={26} />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold tracking-tight text-content-neutral-primary sm:text-3xl">
              My orders
            </h1>
            <p className="mt-1 text-sm text-content-neutral-secondary">
              Track ongoing deliveries and browse your order history.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <StoreOrderHistory />
        </div>
      </div>
    </div>
  );
}
