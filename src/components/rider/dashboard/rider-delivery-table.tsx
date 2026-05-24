"use client";

import React from "react";
import Link from "next/link";

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
  getViewHref?: (orderId: string) => string;
}

const priorityColor: Record<string, string> = {
  High: "text-[#e8a020] font-medium",
  Medium: "text-[#2b7be8] font-medium",
  Urgent: "text-[#e83a3a] font-medium",
};

const statusColor: Record<string, string> = {
  "in progress": "text-surface-brand font-medium",
  delivered: "text-[#2b7be8] font-medium",
  cancelled: "text-[#e83a3a] font-medium",
};

const RiderDeliveryTable = ({
  deliveries,
  showStatus,
  showEarnings,
  showDate,
  showDropOff = true,
  showActions,
  getViewHref,
}: Props) => {
  if (deliveries.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-content-neutral-muted">
        No deliveries to show
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border-muted">
            <th className="text-left px-3 py-3 font-medium text-content-neutral-muted w-8">
              <input type="checkbox" className="rounded" aria-label="Select all" />
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
          {deliveries.map((d) => (
            <tr key={d.orderId} className="border-b border-border-muted/50 hover:bg-surface-subtle transition-colors">
              <td className="px-3 py-3"><input type="checkbox" className="rounded" aria-label={`Select ${d.orderId}`} /></td>
              <td className="px-3 py-3 text-content-neutral-primary">{d.orderId}</td>
              <td className="px-3 py-3 text-content-neutral-secondary">{d.customer}</td>
              <td className="px-3 py-3 text-content-neutral-secondary max-w-[120px] truncate">{d.address}</td>
              {showDropOff && (
                <td className="px-3 py-3 text-content-neutral-secondary max-w-[120px] truncate">{d.dropOff}</td>
              )}
              <td className="px-3 py-3 text-content-neutral-secondary">{d.items}</td>
              {showDate && <td className="px-3 py-3 text-content-neutral-secondary">{d.date}</td>}
              {showStatus && (
                <td className={`px-3 py-3 capitalize ${statusColor[d.status?.toLowerCase() ?? ""] ?? "text-content-neutral-secondary"}`}>
                  {d.status}
                </td>
              )}
              <td className="px-3 py-3 text-content-neutral-secondary">{d.eta}</td>
              {showEarnings && (
                <td className="px-3 py-3 text-right text-content-neutral-primary">
                  {d.earnings != null ? `₦${d.earnings.toLocaleString("en-NG")}` : "—"}
                </td>
              )}
              <td className={`px-3 py-3 ${priorityColor[d.priority] ?? ""}`}>{d.priority}</td>
              {showActions && (
                <td className="px-3 py-3">
                  {getViewHref ? (
                    <Link href={getViewHref(d.orderId)} className="text-surface-brand hover:underline text-sm">
                      View
                    </Link>
                  ) : (
                    <span className="text-sm text-content-neutral-muted">—</span>
                  )}
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
