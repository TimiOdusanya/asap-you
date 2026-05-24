"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Loader2, MapPin, Package, User } from "lucide-react";
import {
  fetchRiderOrderById,
  riderDeliveryDetailQueryKey,
} from "@/services/rider/rider-deliveries.api";
import { formatOrderAddress, formatRiderMoney, riderEarningFromOrder } from "@/lib/rider-order-utils";
import { cn } from "@/lib/utils";

interface Props {
  orderId: string;
}

export function RiderOrderDetail({ orderId }: Props) {
  const { data, isPending, isError } = useQuery({
    queryKey: riderDeliveryDetailQueryKey(orderId),
    queryFn: () => fetchRiderOrderById(orderId),
  });

  const order = data?.data;

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-surface-brand" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="rounded-xl border border-border-muted bg-white p-8 text-center">
        <p className="text-sm text-content-neutral-muted">Order not found or not assigned to you.</p>
        <Link href="/rider/dashboard/order-history" className="mt-4 inline-block text-sm text-surface-brand hover:underline">
          ← Back to history
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/rider/dashboard/order-history"
        className="inline-flex items-center gap-1 text-sm text-content-neutral-secondary hover:text-content-neutral-primary"
      >
        <ChevronLeft className="size-4" /> Order history
      </Link>

      <div className="rounded-xl border border-border-muted bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-content-neutral-primary">#{order.orderId}</h1>
            <p className="text-sm text-content-neutral-muted mt-1 capitalize">
              {order.status.replace(/_/g, " ")} · {new Date(order.createdAt).toLocaleString("en-NG")}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold capitalize",
              order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-surface-muted text-content-neutral-secondary"
            )}
          >
            {order.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border-muted bg-white p-5 space-y-4">
          <h2 className="font-semibold text-content-neutral-primary flex items-center gap-2">
            <User className="size-4" /> Customer
          </h2>
          <p className="text-sm text-content-neutral-primary">{order.customerName}</p>
          <p className="text-sm text-content-neutral-secondary">{order.customerPhone}</p>
        </div>
        <div className="rounded-xl border border-border-muted bg-white p-5 space-y-4">
          <h2 className="font-semibold text-content-neutral-primary flex items-center gap-2">
            <MapPin className="size-4" /> Delivery address
          </h2>
          <p className="text-sm text-content-neutral-secondary">
            {formatOrderAddress(order.delivery.address)}
          </p>
          {order.delivery.instructions && (
            <p className="text-xs text-content-neutral-muted">Note: {order.delivery.instructions}</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border-muted bg-white p-5">
        <h2 className="font-semibold text-content-neutral-primary flex items-center gap-2 mb-4">
          <Package className="size-4" /> Items
        </h2>
        <ul className="divide-y divide-border-muted">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.variantId ?? "base"}`} className="flex justify-between py-3 text-sm">
              <span className="text-content-neutral-primary">
                {item.name} × {item.quantity}
              </span>
              <span className="text-content-neutral-secondary">₦{item.totalPrice.toLocaleString("en-NG")}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border-muted pt-4 text-sm font-semibold">
          <span className="text-content-neutral-secondary">Your delivery fee</span>
          <span className="text-surface-brand">{formatRiderMoney(riderEarningFromOrder(order))}</span>
        </div>
      </div>
    </div>
  );
}
