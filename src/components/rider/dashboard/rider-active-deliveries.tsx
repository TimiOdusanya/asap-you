"use client";

import React, { useState } from "react";
import { FunnelIcon } from "@phosphor-icons/react";
import RiderDeliveryTable, { type Delivery } from "./rider-delivery-table";
import RiderPagination from "./rider-pagination";

const priorities = ["High", "Medium", "Urgent"] as const;
const statuses = ["All Status", "In Progress", "Delivered", "Cancelled"];

const mockDeliveries: Delivery[] = Array.from({ length: 15 }, (_, i) => ({
  orderId: "DEL001",
  customer: "Alice Johnson",
  address: "123 Main St, Downto...",
  dropOff: "123 Main St, Downto...",
  items: "2x Pizza, 1x Coke",
  eta: "15 mins",
  priority: priorities[i % 3],
  status: "In Progress",
}));

const RiderActiveDeliveries = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All Status");
  const [priority, setPriority] = useState("All Priority");
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Active Deliveries</h1>

      <div className="bg-white rounded-xl border border-border-muted overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5 border-b border-border-muted">
          <div className="relative flex-1 min-w-[160px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here..."
              className="w-full text-sm border border-border-muted rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-1 focus:ring-surface-brand/30 bg-surface-subtle"
            />
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-content-neutral-muted" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="text-sm border border-border-muted rounded-lg px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-surface-brand/30 cursor-pointer">
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}
            className="text-sm border border-border-muted rounded-lg px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-surface-brand/30 cursor-pointer">
            {["All Priority", "High", "Medium", "Urgent"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <RiderDeliveryTable deliveries={mockDeliveries} />
        <RiderPagination currentPage={page} totalPages={30} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default RiderActiveDeliveries;
