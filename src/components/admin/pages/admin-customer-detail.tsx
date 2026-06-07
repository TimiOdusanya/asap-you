"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminKvGrid } from "@/components/admin/admin-kv";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { AdminDetailSkeleton } from "@/components/admin/admin-page-skeletons";
import { adminUserQueryKey, fetchAdminUser } from "@/services/admin/admin.api";
import {
  displayName,
  formatAdminDate,
  orderStatusBadgeVariant,
  orderVendorName,
  userIdString,
  userStatus,
} from "@/lib/admin-mappers";

export default function AdminCustomerDetailPage({ id }: { id: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: adminUserQueryKey(id),
    queryFn: () => fetchAdminUser(id),
  });

  if (isPending) {
    return (
      <AdminPageShell title="Customer" subtitle="Loading customer profile…">
        <AdminDetailSkeleton />
      </AdminPageShell>
    );
  }

  const customer = data?.data.user;
  if (isError || !customer) {
    return (
      <AdminPageShell title="Customer" subtitle="Customer not found.">
        <EmptyState
          title="Customer not found"
          description="This customer ID does not exist or could not be loaded."
          action={{ label: "Back to customers", href: "/admin/customers" }}
          actionIcon={<ArrowLeftIcon className="size-4 shrink-0" aria-hidden />}
        />
      </AdminPageShell>
    );
  }

  const orders = data.data.orders ?? [];
  const reviews = data.data.reviews ?? [];
  const status = userStatus(customer.isActive);
  const userId = userIdString(customer);

  return (
    <AdminPageShell
      title={displayName(customer)}
      subtitle="Customer profile, preferences, history, and moderation actions."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AdminActionPanel
            backHref="/admin/customers"
            status={status}
            actionsLabel="Customer actions"
            userId={userId}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-8">
          <AdminSectionCard title="Profile" subtitle="Customer profile and preferences.">
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Name", value: displayName(customer) },
                { label: "Email", value: customer.email },
                { label: "Phone", value: customer.phone ?? "—" },
                { label: "Created", value: formatAdminDate(customer.createdAt) },
                { label: "Last active", value: formatAdminDate(customer.updatedAt) },
                { label: "Orders", value: customer.ordersCount ?? orders.length },
                {
                  label: "Total spent",
                  value: `₦${(customer.totalSpent ?? 0).toLocaleString()}`,
                },
              ]}
            />
            {customer.preferences ? (
              <div className="mt-4 rounded-xl border border-border-muted bg-surface-canvas p-4">
                <p className="text-xs font-medium text-content-neutral-muted">Preferences</p>
                <p className="mt-1 text-sm text-content-neutral-secondary">
                  Language: {customer.preferences.language ?? "—"} • Currency:{" "}
                  {customer.preferences.currency ?? "—"}
                </p>
              </div>
            ) : null}
          </AdminSectionCard>

          <AdminSectionCard
            title="Orders"
            subtitle="Products and totals from this customer."
            right={<AdminBadge variant="neutral">{orders.length} orders</AdminBadge>}
          >
            {orders.length === 0 ? (
              <EmptyState size="sm" title="No orders yet" description="This customer has not placed any orders." />
            ) : (
              <AdminTable>
                <thead>
                  <tr className="border-b border-border-muted">
                    <AdminTh>Order</AdminTh>
                    <AdminTh>Vendor</AdminTh>
                    <AdminTh>Status</AdminTh>
                    <AdminTh>Total</AdminTh>
                    <AdminTh>Date</AdminTh>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                      <tr key={o._id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                        <AdminTd className="text-content-neutral-primary">{o.orderId}</AdminTd>
                        <AdminTd>{orderVendorName(o.vendorId)}</AdminTd>
                        <AdminTd>
                          <AdminBadge variant={orderStatusBadgeVariant(o.status)}>
                            {o.status.replaceAll("_", " ")}
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
            )}
          </AdminSectionCard>

          <AdminSectionCard
            title="Reviews"
            subtitle="Moderation surface for customer feedback."
            right={<AdminBadge variant="neutral">{reviews.length} reviews</AdminBadge>}
          >
            {reviews.length === 0 ? (
              <EmptyState size="sm" title="No reviews yet" description="This customer has not left any reviews." />
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={String(r._id)}
                    className="rounded-xl border border-border-muted bg-surface-canvas p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-content-neutral-primary">
                        {r.targetType.toUpperCase()}
                        {r.productName ? `: ${r.productName}` : ""}
                      </p>
                      <AdminBadge variant={r.isActive ? "neutral" : "danger"}>
                        {r.isActive ? `${r.rating}/5` : "Hidden"}
                      </AdminBadge>
                    </div>
                    <p className="mt-2 text-sm text-content-neutral-secondary">{r.comment ?? "—"}</p>
                    <p className="mt-2 text-xs text-content-neutral-muted">
                      {formatAdminDate(r.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </AdminSectionCard>
        </div>
      </div>
    </AdminPageShell>
  );
}
