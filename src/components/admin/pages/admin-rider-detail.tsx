"use client";

import React from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminKvGrid } from "@/components/admin/admin-kv";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { mockRiders, mockOrders, mockReviews } from "@/components/admin/mock-admin-data";

export default function AdminRiderDetailPage({ id }: { id: string }) {
  const rider = mockRiders.find((r) => r.id === id) ?? null;

  if (!rider) {
    return (
      <AdminPageShell title="Rider" subtitle="Rider not found.">
        <EmptyState
          title="Rider not found"
          description="This rider ID doesn’t exist in the current mock dataset. Once endpoints are connected, this will look up the real record."
          action={{ label: "Back to riders", href: "/admin/riders" }}
        />
      </AdminPageShell>
    );
  }

  const riderReviews = mockReviews.filter((r) => r.target === "rider" && r.targetName === rider.name);
  const recentOrders = mockOrders.slice(0, 2);

  return (
    <AdminPageShell
      title={rider.name}
      subtitle="Full rider profile, onboarding details, documents, and performance."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AdminActionPanel
            backHref="/admin/riders"
            status={rider.status}
            verificationStatus={rider.verificationStatus}
            actionsLabel="Rider actions"
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-8">
          <AdminSectionCard title="Profile" subtitle="Basic and onboarding details.">
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Name", value: rider.name },
                { label: "Email", value: rider.email },
                { label: "Phone", value: rider.onboarding.basic.phone },
                { label: "Vehicle type", value: rider.onboarding.profile.vehicleType },
                { label: "Created", value: rider.createdAt },
                { label: "Submitted", value: rider.submittedAt ?? "—" },
                { label: "Deliveries", value: rider.deliveriesCount },
                { label: "Avg rating", value: rider.averageRating ? `${rider.averageRating.toFixed(1)}/5` : "—" },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard title="Documents & payouts" subtitle="Captured during onboarding.">
            <AdminKvGrid
              columns={2}
              items={[
                {
                  label: "License",
                  value: rider.onboarding.profile.licenseUrl ? (
                    <a className="text-surface-brand hover:underline" href={rider.onboarding.profile.licenseUrl}>
                      View
                    </a>
                  ) : (
                    "—"
                  ),
                },
                {
                  label: "Profile photo",
                  value: rider.onboarding.profile.photoUrl ? (
                    <a className="text-surface-brand hover:underline" href={rider.onboarding.profile.photoUrl}>
                      View
                    </a>
                  ) : (
                    "—"
                  ),
                },
                { label: "Bank name", value: rider.onboarding.profile.bankAccount.bankName },
                { label: "Account number", value: rider.onboarding.profile.bankAccount.accountNumber },
                { label: "Account holder", value: rider.onboarding.profile.bankAccount.accountHolderName },
                { label: "Bank code", value: rider.onboarding.profile.bankAccount.bankCode ?? "—" },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard
            title="History"
            subtitle="Recent deliveries (sample data until endpoints are wired)."
            right={<AdminBadge variant="neutral">{recentOrders.length} records</AdminBadge>}
          >
            <AdminTable>
              <thead>
                <tr className="border-b border-border-muted">
                  <AdminTh>Order</AdminTh>
                  <AdminTh>Customer</AdminTh>
                  <AdminTh>Status</AdminTh>
                  <AdminTh>Total</AdminTh>
                  <AdminTh>Date</AdminTh>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                    <AdminTd className="text-content-neutral-primary">{o.id}</AdminTd>
                    <AdminTd>{o.customerName}</AdminTd>
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
          </AdminSectionCard>

          <AdminSectionCard
            title="Ratings"
            subtitle="Reviews mentioning this rider."
            right={<AdminBadge variant="neutral">{riderReviews.length} reviews</AdminBadge>}
          >
            {riderReviews.length === 0 ? (
              <EmptyState
                size="sm"
                title="No rider reviews"
                description="Once endpoints are connected, this will show rider feedback and ratings trends."
              />
            ) : (
              <div className="space-y-3">
                {riderReviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-border-muted bg-surface-canvas p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-content-neutral-primary">
                        {r.authorName}
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

