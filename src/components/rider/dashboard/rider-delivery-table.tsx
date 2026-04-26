"use client";

import React from "react";

export interface Delivery {
  orderId: string;
  customer: string;
  address: string;
  dropOff: string;
  items: string;
  eta: string;
  priority: "High" | "Medium" | "Urgent";
  status?: string;
  earnings?: number;
  date?: string;
}

interface Props {
  deliveries: Delivery[];
  showStatus?: boolean;
  showEarnings?: boolean;
  showDate?: boolean;
  showDropOff?: boolean;
  showActions?: boolean;
}

const priorityColor: Record<string, string> = {
  High: "text-[#e8a020] font-medium",
  Medium: "text-[#2b7be8] font-medium",
  Urgent: "text-[#e83a3a] font-medium",
};

const statusColor: Record<string, string> = {
  "In Progress": "text-surface-brand font-medium",
  Delivered: "text-[#2b7be8] font-medium",
  Cancelled: "text-[#e83a3a] font-medium",
};

const RiderDeliveryTable = ({ deliveries, showStatus, showEarnings, showDate, showDropOff = true, showActions }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border-muted">
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted w-8">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Order Id</th>
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Customer</th>
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">
              {showDropOff ? "Pick up Address" : "Address"}
            </th>
            {showDropOff && (
              <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Drop off Address</th>
            )}
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Items</th>
            {showDate && <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Date</th>}
            {showStatus && <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Status</th>}
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">ETA</th>
            {showEarnings && <th className="text-right px-3 py-3 font-medium text-content-neutral-muted">Earnings</th>}
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Priority</th>
            {showActions && <th className="text-left px-3 py-3 font-medium text-content-neutral-muted">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d, i) => (
            <tr key={i} className="border-b border-border-muted/50 hover:bg-surface-subtle transition-colors">
              <td className="px-3 py-3"><input type="checkbox" className="rounded" /></td>
              <td className="px-3 py-3 text-content-neutral-primary">{d.orderId}</td>
              <td className="px-3 py-3 text-content-neutral-secondary">{d.customer}</td>
              <td className="px-3 py-3 text-content-neutral-secondary max-w-[120px] truncate">{d.address}</td>
              {showDropOff && (
                <td className="px-3 py-3 text-content-neutral-secondary max-w-[120px] truncate">{d.dropOff}</td>
              )}
              <td className="px-3 py-3 text-content-neutral-secondary">{d.items}</td>
              {showDate && <td className="px-3 py-3 text-content-neutral-secondary">{d.date}</td>}
              {showStatus && (
                <td className={`px-3 py-3 ${statusColor[d.status ?? ""] ?? "text-content-neutral-secondary"}`}>{d.status}</td>
              )}
              <td className="px-3 py-3 text-content-neutral-secondary">{d.eta}</td>
              {showEarnings && <td className="px-3 py-3 text-right text-content-neutral-primary">{d.earnings?.toLocaleString()}</td>}
              <td className={`px-3 py-3 ${priorityColor[d.priority] ?? ""}`}>{d.priority}</td>
              {showActions && (
                <td className="px-3 py-3">
                  <button className="text-surface-brand hover:underline text-sm cursor-pointer">View</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiderDeliveryTable;
