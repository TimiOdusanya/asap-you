"use client";

import React, { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { fetchVendorOrders, vendorOrdersQueryKey } from "@/services/vendor/vendor-orders.api";
import type { OrderDto, OrderStatus } from "@/types/order";

function statusVariant(status: OrderStatus): "success" | "danger" | "warning" | "neutral" {
  if (status === "delivered") return "success";
  if (status === "cancelled" || status === "failed") return "danger";
  if (status === "pending") return "warning";
  return "neutral";
}

export default function AdminOrdersPage() {
  const [q, setQ] = useState("");

  const { data, isPending } = useQuery({
    queryKey: vendorOrdersQueryKey(),
    queryFn: () => fetchVendorOrders(1, 100),
    refetchInterval: 30_000,
  });

  const allOrders: OrderDto[] = data?.data ?? [];

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return allOrders;
    return allOrders.filter((o) =>
      [
        o.orderId,
        o.customerName,
        o.status,
        typeof o.vendorId === "object" ? o.vendorId.businessName : "",
      ].some((x) => x.toLowerCase().includes(needle))
    );
  }, [q, allOrders]);

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
        <AdminBadge variant="neutral">{isPending ? "…" : rows.length} total</AdminBadge>
      </div>

      {isPending ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={q ? "No orders match your search." : "Orders placed by customers will appear here."}
        />
      ) : (
        <AdminTable>
          <thead>
            <tr className="border-b border-border-muted">
              <AdminTh>Order ID</AdminTh>
              <AdminTh>Customer</AdminTh>
              <AdminTh>Vendor</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Payment</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh>Date</AdminTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => {
              const vendorName =
                typeof o.vendorId === "object" ? o.vendorId.businessName : String(o.vendorId);
              return (
                <tr key={o._id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                  <AdminTd className="font-mono text-xs text-content-neutral-primary">
                    #{o.orderId}
                  </AdminTd>
                  <AdminTd>{o.customerName}</AdminTd>
                  <AdminTd>{vendorName || "—"}</AdminTd>
                  <AdminTd>
                    <AdminBadge variant={statusVariant(o.status)}>
                      {o.status.replaceAll("_", " ")}
                    </AdminBadge>
                  </AdminTd>
                  <AdminTd>
                    <AdminBadge
                      variant={
                        o.payment.status === "completed"
                          ? "success"
                          : o.payment.status === "failed" || o.payment.status === "refunded"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {o.payment.status}
                    </AdminBadge>
                  </AdminTd>
                  <AdminTd className="text-content-neutral-primary">
                    ₦{o.pricing.total.toLocaleString()}
                  </AdminTd>
                  <AdminTd>
                    {new Date(o.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </AdminTd>
                </tr>
              );
            })}
          </tbody>
        </AdminTable>
      )}
    </AdminPageShell>
  );
}

