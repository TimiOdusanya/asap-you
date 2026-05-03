"use client";

import React, { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { mockOrders } from "@/components/admin/mock-admin-data";

export default function AdminOrdersPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return mockOrders;
    return mockOrders.filter((o) =>
      [o.id, o.customerName, o.vendorName, o.status].some((x) => x.toLowerCase().includes(needle))
    );
  }, [q]);

  return (
    <AdminPageShell title="Orders" subtitle="Track marketplace order flow and exceptions.">
      <div className="flex flex-col gap-3 rounded-2xl border border-border-muted bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-neutral-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders"
            className="h-10 rounded-lg border-border-muted bg-white pl-9 text-sm"
          />
        </div>
        <AdminBadge variant="neutral">{rows.length} total</AdminBadge>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Once endpoints are connected, this page will show live orders with filters, pagination, and detail drill-down."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr className="border-b border-border-muted">
              <AdminTh>Order</AdminTh>
              <AdminTh>Customer</AdminTh>
              <AdminTh>Vendor</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh>Date</AdminTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                <AdminTd className="text-content-neutral-primary">{o.id}</AdminTd>
                <AdminTd>{o.customerName}</AdminTd>
                <AdminTd>{o.vendorName}</AdminTd>
                <AdminTd>
                  <AdminBadge
                    variant={
                      o.status === "delivered"
                        ? "success"
                        : o.status === "cancelled"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {o.status.replaceAll("_", " ")}
                  </AdminBadge>
                </AdminTd>
                <AdminTd className="text-content-neutral-primary">₦{o.total.toLocaleString()}</AdminTd>
                <AdminTd>{o.createdAt}</AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </AdminPageShell>
  );
}

