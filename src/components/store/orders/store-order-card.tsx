"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Store } from "lucide-react";
import {
  isLiveDeliveryStatus,
  isOngoingOrderStatus,
  ORDER_PROGRESS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "@/lib/order-status";
import type { OrderDto } from "@/types/order";
import { cn } from "@/lib/utils";

function vendorMeta(order: OrderDto) {
  if (order.vendorId && typeof order.vendorId === "object") {
    return {
      name: order.vendorId.businessName,
      logo: order.vendorId.logo,
    };
  }
  return { name: "Store", logo: undefined };
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StoreOrderCard({ order }: { order: OrderDto }) {
  const firstItem = order.items[0];
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const vendor = vendorMeta(order);
  const ongoing = isOngoingOrderStatus(order.status);
  const live = isLiveDeliveryStatus(order.status);
  const progress = ORDER_PROGRESS[order.status];

  return (
    <Link
      href={`/store/orders/${order.orderId}`}
      className={cn(
        "group relative flex gap-4 overflow-hidden rounded-2xl border bg-white p-4 transition-all sm:p-5",
        "hover:border-primary/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
        ongoing ? "border-primary/20 shadow-sm" : "border-border-muted"
      )}
    >
      {ongoing ? (
        <span className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden />
      ) : null}

      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-2xl bg-surface-muted ring-1 ring-black/5 sm:size-20">
        {firstItem?.image ? (
          <Image
            src={firstItem.image}
            alt={firstItem.name}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        ) : vendor.logo ? (
          <Image
            src={vendor.logo}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Package className="size-7 text-content-neutral-muted" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Store className="size-3.5 shrink-0 text-content-neutral-muted" aria-hidden />
              <p className="truncate text-sm font-semibold text-content-neutral-primary">
                {vendor.name}
              </p>
            </div>
            <p className="mt-0.5 truncate text-sm text-content-neutral-secondary">
              {firstItem?.name}
              {itemCount > 1 ? ` · +${itemCount - 1} more` : ""}
            </p>
            <p className="mt-1 font-mono text-[11px] text-content-neutral-muted">
              {order.orderId}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
              ORDER_STATUS_COLORS[order.status],
              live && "animate-pulse"
            )}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        {ongoing && progress > 0 ? (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] font-medium uppercase tracking-wide text-content-neutral-muted">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  live ? "bg-gradient-to-r from-primary to-cyan-500" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-base font-bold tabular-nums text-content-neutral-primary">
              ₦{order.pricing.total.toLocaleString("en-NG")}
            </p>
            <p className="mt-0.5 text-xs text-content-neutral-muted">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              ongoing
                ? "bg-primary text-primary-foreground group-hover:bg-primary/90"
                : "bg-surface-muted text-content-neutral-secondary group-hover:bg-surface-subtle"
            )}
          >
            {ongoing ? (live ? "Track live" : "Track order") : "View details"}
            <ArrowRight className="size-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
