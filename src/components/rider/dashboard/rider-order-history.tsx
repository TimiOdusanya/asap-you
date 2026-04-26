"use client";

import React, { useState } from "react";
import { GlobeIcon, CheckCircleIcon, XCircleIcon, TimerIcon } from "@phosphor-icons/react";
import RiderStatCard from "./rider-stat-card";
import RiderDeliveryTable, { type Delivery } from "./rider-delivery-table";
import RiderPagination from "./rider-pagination";

const mockOrders: Delivery[] = Array.from({ length: 15 }, (_, i) => ({
  orderId: "DEL001",
  customer: "Alice Johnson",
  address: "123 Main St, Downto...",
  dropOff: "123 Main St, Downto...",
  items: "2x Pizza, 1x Coke",
  eta: "15 min",
  date: "02/10/24",
  priority: (["High", "Medium", "Urgent"] as const)[i % 3],
  status: i % 4 === 2 ? "Delivered" : "In Progress",
  earnings: 2500,
}));

const RiderOrderHistory = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All Status");

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Order History</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-content-neutral-primary">Product Dashboard</h2>
          <button className="text-xs sm:text-sm text-surface-brand hover:underline cursor-pointer">See all reports</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <RiderStatCard label="Total Orders" value={12} iconBg="bg-blue-50"
            icon={<GlobeIcon className="size-4 text-blue-500" />} valueColor="text-content-neutral-primary" />
          <RiderStatCard label="Delivered" value={10} iconBg="bg-yellow-50"
            icon={<CheckCircleIcon className="size-4 text-yellow-500" />} valueColor="text-yellow-500" />
          <RiderStatCard label="Cancelled" value={2} iconBg="bg-red-50"
            icon={<XCircleIcon className="size-4 text-red-400" />} valueColor="text-red-400" />
          <RiderStatCard label="Average Delivery Time" value="20 mins" iconBg="bg-green-50"
            icon={<TimerIcon className="size-4 text-surface-brand" />} valueColor="text-surface-brand" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5 border-b border-border-muted">
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="text-sm border border-border-muted rounded-lg px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-surface-brand/30 cursor-pointer">
            {["All Status", "In Progress", "Delivered", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 border border-border-muted rounded-lg px-3 py-2 text-sm text-content-neutral-muted cursor-pointer hover:bg-surface-subtle">
            <span>📅</span> Pick a date
          </div>
          <div className="flex items-center gap-2 border border-border-muted rounded-lg px-3 py-2 text-sm text-content-neutral-muted cursor-pointer hover:bg-surface-subtle">
            <span>⏱</span> 0:00
          </div>
        </div>
        <RiderDeliveryTable deliveries={mockOrders} showStatus showEarnings showDate showDropOff={false} />
        <RiderPagination currentPage={page} totalPages={30} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default RiderOrderHistory;
