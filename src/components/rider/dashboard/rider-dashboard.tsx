"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GlobeIcon, CurrencyNgnIcon, TimerIcon, StarIcon } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";
import RiderStatCard from "./rider-stat-card";
import RiderDeliveryTable from "./rider-delivery-table";
import RiderPagination from "./rider-pagination";
import {
  fetchActiveDelivery,
  fetchRiderDeliveries,
  fetchRiderProfile,
  riderActiveDeliveryQueryKey,
  riderDeliveriesQueryKey,
  riderProfileQueryKey,
} from "@/services/rider/rider-deliveries.api";
import {
  countDeliveredSince,
  formatOrderAddress,
  formatRiderMoney,
  isActiveDeliveryStatus,
  mapActiveDeliveryToRow,
  mapOrderToDeliveryRow,
  startOfDay,
} from "@/lib/rider-order-utils";

const PAGE_SIZE = 10;

const RiderDashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: profileRes, isPending: profileLoading } = useQuery({
    queryKey: riderProfileQueryKey,
    queryFn: fetchRiderProfile,
  });

  const { data: activeRes } = useQuery({
    queryKey: riderActiveDeliveryQueryKey,
    queryFn: fetchActiveDelivery,
    refetchInterval: 30_000,
  });

  const { data: deliveriesRes, isPending: deliveriesLoading } = useQuery({
    queryKey: riderDeliveriesQueryKey(page, PAGE_SIZE),
    queryFn: () => fetchRiderDeliveries(page, PAGE_SIZE),
  });

  const { data: todayRes } = useQuery({
    queryKey: riderDeliveriesQueryKey(1, 100, "delivered"),
    queryFn: () => fetchRiderDeliveries(1, 100, "delivered"),
  });

  const stats = profileRes?.data?.stats;
  const activeDelivery = activeRes?.data ?? null;
  const allOrders = deliveriesRes?.data ?? [];
  const totalPages = deliveriesRes?.pagination?.totalPages ?? 1;

  const activeRows = useMemo(() => {
    const fromList = allOrders
      .filter((o) => isActiveDeliveryStatus(o.status))
      .map(mapOrderToDeliveryRow);

    if (fromList.length > 0) return fromList;

    if (activeDelivery) return [mapActiveDeliveryToRow(activeDelivery)];
    return [];
  }, [allOrders, activeDelivery]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return activeRows;
    return activeRows.filter(
      (row) =>
        row.orderId.toLowerCase().includes(q) ||
        row.customer.toLowerCase().includes(q) ||
        row.address.toLowerCase().includes(q)
    );
  }, [activeRows, search]);

  const todayCount = countDeliveredSince(todayRes?.data ?? [], startOfDay(new Date()));
  const riderLocation = profileRes?.data?.location?.coordinates;

  const getViewHref = (orderId: string) => {
    const match = allOrders.find((o) => o.orderId === orderId);
    if (match && isActiveDeliveryStatus(match.status)) {
      return "/rider/dashboard/active-deliveries";
    }
    if (activeDelivery?.orderId === orderId) {
      return "/rider/dashboard/active-deliveries";
    }
    return `/rider/dashboard/order-history/${encodeURIComponent(orderId)}`;
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Dashboard</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-content-neutral-primary">Delivery overview</h2>
          <Link href="/rider/dashboard/earnings" className="text-xs sm:text-sm text-surface-brand hover:underline">
            View earnings
          </Link>
        </div>
        {profileLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-surface-brand" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <RiderStatCard
              label="Today's Deliveries"
              value={todayCount}
              iconBg="bg-blue-50"
              icon={<GlobeIcon className="size-4 text-blue-500" />}
              valueColor="text-content-neutral-primary"
            />
            <RiderStatCard
              label="Total Earnings"
              value={formatRiderMoney(stats?.totalEarnings ?? 0)}
              iconBg="bg-yellow-50"
              icon={<CurrencyNgnIcon className="size-4 text-yellow-500" />}
              valueColor="text-yellow-500"
            />
            <RiderStatCard
              label="Online Hours"
              value={stats?.onlineHours != null ? `${stats.onlineHours.toFixed(1)}h` : "—"}
              iconBg="bg-red-50"
              icon={<TimerIcon className="size-4 text-red-400" />}
              valueColor="text-red-400"
            />
            <RiderStatCard
              label="Customer Rating"
              value={stats ? stats.averageRating.toFixed(1) : "—"}
              iconBg="bg-green-50"
              icon={<StarIcon className="size-4 text-surface-brand" />}
              valueColor="text-surface-brand"
            />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-border-muted">
          <h2 className="text-base font-semibold text-content-neutral-primary">Active Deliveries</h2>
          <input
            placeholder="Search order or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-border-muted rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-surface-brand/30 w-full sm:w-48 bg-surface-subtle"
          />
        </div>
        {deliveriesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-surface-brand" />
          </div>
        ) : (
          <>
            <RiderDeliveryTable
              deliveries={filteredRows}
              showStatus
              showActions
              showDropOff={false}
              getViewHref={getViewHref}
            />
            {filteredRows.length === 0 && !deliveriesLoading && (
              <p className="px-4 pb-6 text-center text-sm text-content-neutral-muted">
                No active deliveries right now.{" "}
                <Link href="/rider/dashboard/active-deliveries" className="text-surface-brand hover:underline">
                  Check active delivery page
                </Link>
              </p>
            )}
            <RiderPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-muted">
          <div>
            <h2 className="text-base font-semibold text-content-neutral-primary">Live delivery</h2>
            <p className="text-xs text-content-neutral-muted mt-0.5">
              {activeDelivery ? `#${activeDelivery.orderId} · ${activeDelivery.customer.name}` : "No active route"}
            </p>
          </div>
          {activeDelivery && (
            <Link
              href="/rider/dashboard/active-deliveries"
              className="text-xs text-surface-brand font-medium hover:underline"
            >
              Open delivery →
            </Link>
          )}
        </div>
        <div className="relative min-h-[260px] bg-[#e8f4fd] flex flex-col items-center justify-center gap-4 p-6">
          {riderLocation && (
            <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-content-neutral-primary border border-border-muted shadow-sm">
              <span className="w-2 h-2 rounded-full bg-surface-brand animate-pulse" /> You are here
              <span className="text-content-neutral-muted">
                ({riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)})
              </span>
            </span>
          )}
          <GlobeIcon className="size-10 text-surface-brand opacity-50" />
          <div className="text-center max-w-md">
            {activeDelivery ? (
              <>
                <p className="font-medium text-content-neutral-primary capitalize">
                  {activeDelivery.status.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-content-neutral-muted mt-1">
                  Deliver to {formatOrderAddress(activeDelivery.delivery.address)}
                </p>
                {activeDelivery.vendor && (
                  <p className="text-sm text-content-neutral-secondary mt-1">
                    Pick up from {activeDelivery.vendor.businessName}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-medium text-content-neutral-primary">No active route</p>
                <p className="text-sm text-content-neutral-muted">Go online to receive delivery assignments</p>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border-muted border-t border-border-muted">
          {[
            { label: "Completed", value: stats?.completedDeliveries ?? 0 },
            { label: "Total trips", value: stats?.totalDeliveries ?? 0 },
            { label: "Status", value: profileRes?.data?.status ?? "offline" },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 text-center">
              <p className="text-lg font-semibold text-content-neutral-primary capitalize">{value}</p>
              <p className="text-xs text-content-neutral-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
