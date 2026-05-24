"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { CheckCircleIcon, XCircleIcon, GlobeIcon } from "@phosphor-icons/react";
import RiderStatCard from "./rider-stat-card";
import RiderPagination from "./rider-pagination";
import {
  fetchRiderDeliveries,
  fetchRiderProfile,
  riderDeliveriesQueryKey,
  riderProfileQueryKey,
} from "@/services/rider/rider-deliveries.api";
import { isActiveDeliveryStatus } from "@/lib/rider-order-utils";
import type { OrderDto, OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Partial<Record<OrderStatus, string>> = {
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  on_the_way: "bg-cyan-100 text-cyan-700",
  picked_up: "bg-indigo-100 text-indigo-700",
};

const FILTER_OPTIONS = [
  { label: "All", value: "" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const PAGE_SIZE = 10;

function orderDetailHref(order: OrderDto): string {
  if (isActiveDeliveryStatus(order.status)) {
    return "/rider/dashboard/active-deliveries";
  }
  return `/rider/dashboard/order-history/${encodeURIComponent(order.orderId)}`;
}

const RiderOrderHistory = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: profileRes } = useQuery({
    queryKey: riderProfileQueryKey,
    queryFn: fetchRiderProfile,
  });
  const stats = profileRes?.data?.stats;

  const { data, isPending } = useQuery({
    queryKey: riderDeliveriesQueryKey(page, PAGE_SIZE, statusFilter || undefined),
    queryFn: () => fetchRiderDeliveries(page, PAGE_SIZE, statusFilter || undefined),
  });

  const orders: OrderDto[] = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Order History</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <RiderStatCard label="Total Deliveries" value={stats?.totalDeliveries ?? 0} iconBg="bg-blue-50"
            icon={<GlobeIcon className="size-4 text-blue-500" />} valueColor="text-content-neutral-primary" />
          <RiderStatCard label="Completed" value={stats?.completedDeliveries ?? 0} iconBg="bg-green-50"
            icon={<CheckCircleIcon className="size-4 text-green-500" />} valueColor="text-green-600" />
          <RiderStatCard label="Avg Rating" value={stats ? `${stats.averageRating.toFixed(1)} ⭐` : "–"} iconBg="bg-yellow-50"
            icon={<XCircleIcon className="size-4 text-yellow-500" />} valueColor="text-yellow-600" />
        </div>
      </div>

      <div className="flex gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { setStatusFilter(opt.value); setPage(1); }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              statusFilter === opt.value
                ? "bg-primary text-white"
                : "bg-white border border-border-muted text-content-neutral-secondary hover:bg-surface-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        {isPending ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Package className="size-10 text-content-neutral-muted" />
            <p className="text-sm text-content-neutral-muted">No deliveries found</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-border-muted">
              {orders.map((order) => {
                const firstItem = order.items[0];
                return (
                  <li key={order._id}>
                    <Link
                      href={orderDetailHref(order)}
                      className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-subtle"
                    >
                      <div className="flex size-9 items-center justify-center rounded-full bg-surface-muted shrink-0">
                        <Package className="size-4 text-content-neutral-muted" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-content-neutral-primary truncate">
                          #{order.orderId}
                        </p>
                        <p className="text-xs text-content-neutral-muted truncate">
                          {firstItem?.name ?? "Order"} · {order.customerName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                            STATUS_COLOR[order.status] ?? "bg-surface-muted text-content-neutral-secondary"
                          )}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                        <ChevronRight className="size-4 text-content-neutral-muted" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <RiderPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default RiderOrderHistory;
