"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, Store } from "lucide-react";
import { formatCheckoutMoney } from "@/components/store/checkout/store-checkout-blocks";
import { fetchOrderById, orderDetailQueryKey } from "@/services/store/orders.api";
import type { OrderDto, PaymentMethod, PaymentStatus } from "@/types/order";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: "Card",
  bank_transfer: "Bank transfer",
  cash: "Cash on delivery",
  wallet: "Wallet",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

function vendorDisplay(order: OrderDto) {
  if (order.vendorId && typeof order.vendorId === "object") {
    return {
      name: order.vendorId.businessName,
      logo: order.vendorId.logo,
    };
  }
  return { name: "Store", logo: undefined };
}

export function StoreOrderTrackingDetails({ orderId }: { orderId: string }) {
  const { data, isPending } = useQuery({
    queryKey: orderDetailQueryKey(orderId),
    queryFn: () => fetchOrderById(orderId),
  });

  if (isPending) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-border-muted bg-white p-6">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const order = data?.data;
  if (!order) return null;

  const vendor = vendorDisplay(order);
  const itemCount = order.items.reduce((n, item) => n + item.quantity, 0);

  return (
    <div className="rounded-2xl border border-border-muted bg-white p-5">
      <h2 className="text-sm font-semibold text-content-neutral-primary">Order details</h2>

      <div className="mt-4 flex items-center gap-3 border-b border-border-muted pb-4">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
          {vendor.logo ? (
            <Image
              src={vendor.logo}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Store className="size-5 text-content-neutral-muted" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-content-neutral-primary">{vendor.name}</p>
          <p className="text-xs text-content-neutral-muted">
            {itemCount} item{itemCount === 1 ? "" : "s"} · Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-border-muted/80">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.variantId ?? "default"}`} className="flex gap-3 py-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <Package className="size-5 text-content-neutral-muted" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-content-neutral-primary">{item.name}</p>
              <p className="text-xs text-content-neutral-muted">
                Qty {item.quantity} × {formatCheckoutMoney(item.unitPrice)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-content-neutral-primary">
              {formatCheckoutMoney(item.totalPrice)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-border-muted pt-4 text-sm">
        <div className="flex justify-between text-content-neutral-secondary">
          <dt>Subtotal</dt>
          <dd className="font-medium tabular-nums text-content-neutral-primary">
            {formatCheckoutMoney(order.pricing.subtotal)}
          </dd>
        </div>
        <div className="flex justify-between text-content-neutral-secondary">
          <dt>Delivery fee</dt>
          <dd className="font-medium tabular-nums text-content-neutral-primary">
            {formatCheckoutMoney(order.pricing.deliveryFee)}
          </dd>
        </div>
        <div className="flex justify-between text-content-neutral-secondary">
          <dt>Service charge</dt>
          <dd className="font-medium tabular-nums text-content-neutral-primary">
            {formatCheckoutMoney(order.pricing.serviceCharge)}
          </dd>
        </div>
        {order.pricing.discount > 0 ? (
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Discount</dt>
            <dd className="font-medium tabular-nums text-green-600">
              −{formatCheckoutMoney(order.pricing.discount)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border-muted pt-3 text-base font-semibold text-content-neutral-primary">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatCheckoutMoney(order.pricing.total)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border-muted pt-4 text-xs text-content-neutral-muted">
        <p>
          Payment:{" "}
          <span className="font-medium text-content-neutral-secondary">
            {PAYMENT_METHOD_LABELS[order.payment.method]}
          </span>
        </p>
        <p>
          Status:{" "}
          <span className="font-medium text-content-neutral-secondary">
            {PAYMENT_STATUS_LABELS[order.payment.status]}
          </span>
        </p>
      </div>

      {order.notes ? (
        <p className="mt-3 rounded-xl bg-surface-muted/60 px-3 py-2 text-xs text-content-neutral-secondary">
          Note: {order.notes}
        </p>
      ) : null}
    </div>
  );
}
