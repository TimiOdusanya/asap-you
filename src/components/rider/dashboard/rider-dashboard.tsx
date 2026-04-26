"use client";

import React, { useState } from "react";
import { GlobeIcon, CurrencyNgnIcon, TimerIcon, StarIcon, FunnelIcon } from "@phosphor-icons/react";
import RiderStatCard from "./rider-stat-card";
import RiderDeliveryTable, { type Delivery } from "./rider-delivery-table";
import RiderPagination from "./rider-pagination";

const mockDeliveries: Delivery[] = Array.from({ length: 3 }, (_, i) => ({
  orderId: "DEL001", customer: "Alice Johnson", address: "123 Main St, Do...",
  dropOff: "123 Main St, Do...", items: "3 items", eta: "15 min",
  priority: (["High", "High", "High"] as const)[i], status: "In Progress",
}));

const RiderDashboard = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Dashboard</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-content-neutral-primary">Product Dashboard</h2>
          <button className="text-xs sm:text-sm text-surface-brand hover:underline cursor-pointer">See all reports</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <RiderStatCard label="Today's Deliveries" value={12} iconBg="bg-blue-50"
            icon={<GlobeIcon className="size-4 text-blue-500" />} valueColor="text-content-neutral-primary" />
          <RiderStatCard label="Total Earnings" value="₦500,000" iconBg="bg-yellow-50"
            icon={<CurrencyNgnIcon className="size-4 text-yellow-500" />} valueColor="text-yellow-500" />
          <RiderStatCard label="Average Time" value="24 mins" iconBg="bg-red-50"
            icon={<TimerIcon className="size-4 text-red-400" />} valueColor="text-red-400" />
          <RiderStatCard label="Customers Ratings" value="4.8" iconBg="bg-green-50"
            icon={<StarIcon className="size-4 text-surface-brand" />} valueColor="text-surface-brand" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-muted">
          <h2 className="text-base font-semibold text-content-neutral-primary">Active Deliveries</h2>
          <div className="flex items-center gap-2">
            <input placeholder="Search here..." className="text-sm border border-border-muted rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-surface-brand/30 w-36 sm:w-48 bg-surface-subtle" />
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border-muted rounded-lg text-sm text-content-neutral-secondary hover:bg-surface-muted cursor-pointer">
              <FunnelIcon className="size-4" /> Filter
            </button>
          </div>
        </div>
        <RiderDeliveryTable deliveries={mockDeliveries} showStatus showActions showDropOff={false} />
        <RiderPagination currentPage={page} totalPages={30} onPageChange={setPage} />
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border-muted">
          <div>
            <h2 className="text-base font-semibold text-content-neutral-primary">Live Map</h2>
            <p className="text-xs text-content-neutral-muted mt-0.5">Track your deliveries in real-time</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-surface-brand font-medium">
            <span className="w-2 h-2 rounded-full bg-surface-brand animate-pulse" /> Live
          </span>
        </div>
        <div className="relative min-h-[300px] bg-[#e8f4fd] flex flex-col items-center justify-center gap-4 p-6">
          <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-content-neutral-primary border border-border-muted shadow-sm">
            <span className="w-2 h-2 rounded-full bg-surface-brand" /> You are here
          </span>
          <GlobeIcon className="size-10 text-surface-brand opacity-50" />
          <div className="text-center">
            <p className="font-medium text-content-neutral-primary">Interactive Map</p>
            <p className="text-sm text-content-neutral-muted">Real-time delivery tracking</p>
          </div>
          <div className="flex items-center gap-6 mt-2">
            {[{ color: "bg-blue-500", label: "Current" }, { color: "bg-red-500", label: "Pick up" }, { color: "bg-surface-brand", label: "Delivered" }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-content-neutral-secondary">
                <span className={`w-3 h-3 rounded-full ${color}`} /> {label}
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 right-4 text-right">
            <p className="text-lg font-semibold text-content-neutral-primary">2.4</p>
            <p className="text-xs text-content-neutral-muted">miles to next</p>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border-muted border-t border-border-muted">
          {[{ label: "Active Routes", value: 3 }, { label: "Miles Today", value: "12.8" }, { label: "Avg Speed", value: 18 }].map(({ label, value }) => (
            <div key={label} className="p-4 text-center">
              <p className="text-lg font-semibold text-content-neutral-primary">{value}</p>
              <p className="text-xs text-content-neutral-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
