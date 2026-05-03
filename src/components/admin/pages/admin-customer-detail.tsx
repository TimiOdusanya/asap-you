"use client";

import React from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminKvGrid } from "@/components/admin/admin-kv";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { mockCustomers, mockOrders, mockReviews } from "@/components/admin/mock-admin-data";

export default function AdminCustomerDetailPage({ id }: { id: string }) {
  const customer = mockCustomers.find((c) => c.id === id) ?? null;

  if (!customer) {
    return (
      <AdminPageShell title="Customer" subtitle="Customer not found.">
        <EmptyState
          title="Customer not found"
          description="This customer ID doesn’t exist in the current mock dataset. Once endpoints are connected, this will look up the real record."
          action={{ label: "Back to customers", href: "/admin/customers" }}
          actionIcon={<ArrowLeftIcon className="size-4 shrink-0" aria-hidden />}
        />
      </AdminPageShell>
    );
  }

  const orders = mockOrders.filter((o) => o.customerName === customer.name);
  const reviews = mockReviews.filter((r) => r.authorName === customer.name);

  return (
    <AdminPageShell
      title={customer.name}
      subtitle="Customer profile, preferences, history, and moderation actions."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AdminActionPanel
            backHref="/admin/customers"
            status={customer.status}
            actionsLabel="Customer actions"
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-8">
          <AdminSectionCard title="Profile" subtitle="Customer profile and preferences.">
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Name", value: customer.name },
                { label: "Email", value: customer.email },
                { label: "Phone", value: customer.phone ?? "—" },
                { label: "Created", value: customer.createdAt },
                { label: "Last active", value: customer.lastActiveAt ?? "—" },
                { label: "Last known address", value: customer.profile?.lastKnownAddress ?? "—" },
                { label: "Orders", value: customer.ordersCount },
                { label: "Total spent", value: `₦${customer.totalSpent.toLocaleString()}` },
              ]}
            />
            <div className="mt-4 rounded-xl border border-border-muted bg-surface-canvas p-4">
              <p className="text-xs font-medium text-content-neutral-muted">Preferences</p>
              <p className="mt-1 text-sm text-content-neutral-secondary">
                Language: {customer.profile?.preferences?.language ?? "—"} • Currency:{" "}
                {customer.profile?.preferences?.currency ?? "—"}
              </p>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="Orders"
            subtitle="Products and totals from this customer."
            right={<AdminBadge variant="neutral">{orders.length} orders</AdminBadge>}
          >
            {orders.length === 0 ? (
              <EmptyState
                size="sm"
                title="No orders yet"
                description="Once order endpoints are connected, this will show the customer’s purchase history."
              />
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
                    <tr key={o.id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                      <AdminTd className="text-content-neutral-primary">{o.id}</AdminTd>
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
          </AdminSectionCard>

          <AdminSectionCard
            title="Reviews"
            subtitle="Moderation surface for customer feedback."
            right={<AdminBadge variant="neutral">{reviews.length} reviews</AdminBadge>}
          >
            {reviews.length === 0 ? (
              <EmptyState
                size="sm"
                title="No reviews yet"
                description="Once review endpoints are connected, this will list what the customer has rated."
              />
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-border-muted bg-surface-canvas p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-content-neutral-primary">
                        {r.target.toUpperCase()}: {r.targetName}
                      </p>
                      <AdminBadge variant="neutral">{r.rating}/5</AdminBadge>
                    </div>
                    <p className="mt-2 text-sm text-content-neutral-secondary">{r.comment}</p>
                    <p className="mt-2 text-xs text-content-neutral-muted">{r.createdAt}</p>
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

