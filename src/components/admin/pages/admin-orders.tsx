"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { AdminTableSkeleton, AdminToolbarSkeleton } from "@/components/admin/admin-page-skeletons";
import { adminOrdersQueryKey, fetchAdminOrders } from "@/services/admin/admin.api";
import { formatAdminDate, orderStatusBadgeVariant, orderVendorName } from "@/lib/admin-mappers";
import type { OrderStatus } from "@/types/order";

function paymentVariant(status: string): "success" | "danger" | "warning" | "neutral" {
  if (status === "completed") return "success";
  if (status === "failed" || status === "refunded") return "danger";
  return "warning";
}

const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [q]);

  const { data, isPending, isFetching } = useQuery({
    queryKey: adminOrdersQueryKey({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
    queryFn: () => fetchAdminOrders({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
    refetchInterval: 30_000,
  });

  const rows = data?.data.orders ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPageShell title="Orders" subtitle="Track marketplace order flow and exceptions.">
      {isPending ? (
        <AdminToolbarSkeleton />
      ) : (
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
          <AdminBadge variant="neutral">{total} total</AdminBadge>
        </div>
      )}

      {isPending ? (
        <AdminTableSkeleton rows={10} cols={7} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={q ? "No orders match your search." : "Orders placed by customers will appear here."}
        />
      ) : (
        <>
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
              {rows.map((o) => (
                  <tr key={o._id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                    <AdminTd className="font-mono text-xs text-content-neutral-primary">
                      #{o.orderId}
                    </AdminTd>
                    <AdminTd>{o.customerName}</AdminTd>
                    <AdminTd>{orderVendorName(o.vendorId)}</AdminTd>
                    <AdminTd>
                      <AdminBadge variant={orderStatusBadgeVariant(o.status as OrderStatus)}>
                        {o.status.replaceAll("_", " ")}
                      </AdminBadge>
                    </AdminTd>
                    <AdminTd>
                      <AdminBadge variant={paymentVariant(o.payment.status)}>
                        {o.payment.status}
                      </AdminBadge>
                    </AdminTd>
                    <AdminTd className="text-content-neutral-primary">
                      ₦{o.pricing.total.toLocaleString()}
                    </AdminTd>
                    <AdminTd>{formatAdminDate(o.createdAt)}</AdminTd>
                  </tr>
              ))}
            </tbody>
          </AdminTable>

          {totalPages > 1 ? (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border-muted"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-content-neutral-muted">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border-muted"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </AdminPageShell>
  );
}
