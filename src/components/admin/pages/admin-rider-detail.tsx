"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminActionPanel } from "@/components/admin/admin-action-panel";
import { AdminKvGrid } from "@/components/admin/admin-kv";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { AdminDetailSkeleton } from "@/components/admin/admin-page-skeletons";
import { adminRiderQueryKey, fetchAdminRider } from "@/services/admin/admin.api";
import {
  displayName,
  entityIdString,
  formatAdminDate,
  orderStatusBadgeVariant,
  riderVerificationStatus,
  userStatus,
} from "@/lib/admin-mappers";

export default function AdminRiderDetailPage({ id }: { id: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: adminRiderQueryKey(id),
    queryFn: () => fetchAdminRider(id),
  });

  if (isPending) {
    return (
      <AdminPageShell title="Rider" subtitle="Loading rider profile…">
        <AdminDetailSkeleton />
      </AdminPageShell>
    );
  }

  const rider = data?.data.rider;
  if (isError || !rider) {
    return (
      <AdminPageShell title="Rider" subtitle="Rider not found.">
        <EmptyState
          title="Rider not found"
          description="This rider ID does not exist or could not be loaded."
          action={{ label: "Back to riders", href: "/admin/riders" }}
        />
      </AdminPageShell>
    );
  }

  const user = data.data.user;
  const recentOrders = data.data.recentOrders ?? [];
  const reviews = data.data.reviews ?? [];
  const riderId = entityIdString(rider);
  const verification = riderVerificationStatus(rider);
  const status = userStatus(rider.isActive);
  const userId = String(rider.userId);

  return (
    <AdminPageShell
      title={displayName({ user })}
      subtitle="Full rider profile, onboarding details, documents, and performance."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <AdminActionPanel
            backHref="/admin/riders"
            status={status}
            verificationStatus={verification}
            actionsLabel="Rider actions"
            userId={userId}
            riderId={riderId}
          />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-8">
          <AdminSectionCard title="Profile" subtitle="Basic and onboarding details.">
            <AdminKvGrid
              columns={2}
              items={[
                { label: "Name", value: displayName({ user }) },
                { label: "Email", value: user?.email ?? "—" },
                { label: "Phone", value: user?.phone ?? "—" },
                { label: "Vehicle type", value: rider.vehicleType },
                { label: "Created", value: formatAdminDate(rider.createdAt) },
                { label: "Deliveries", value: rider.stats?.totalDeliveries ?? 0 },
                {
                  label: "Avg rating",
                  value: rider.stats?.averageRating
                    ? `${rider.stats.averageRating.toFixed(1)}/5`
                    : "—",
                },
                { label: "Total earnings", value: `₦${(rider.stats?.totalEarnings ?? 0).toLocaleString()}` },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard title="Documents & payouts" subtitle="Captured during onboarding.">
            <AdminKvGrid
              columns={2}
              items={[
                {
                  label: "License",
                  value: rider.license ? (
                    <a className="text-surface-brand hover:underline" href={rider.license} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    "—"
                  ),
                },
                {
                  label: "Profile photo",
                  value: rider.photo ? (
                    <a className="text-surface-brand hover:underline" href={rider.photo} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    "—"
                  ),
                },
                { label: "Bank name", value: rider.bankAccount.bankName },
                { label: "Account number", value: rider.bankAccount.accountNumber },
                { label: "Account holder", value: rider.bankAccount.accountHolderName },
                { label: "Bank code", value: rider.bankAccount.bankCode ?? "—" },
              ]}
            />
          </AdminSectionCard>

          <AdminSectionCard
            title="Delivery history"
            subtitle="Recent deliveries assigned to this rider."
            right={<AdminBadge variant="neutral">{recentOrders.length} records</AdminBadge>}
          >
            {recentOrders.length === 0 ? (
              <EmptyState size="sm" title="No deliveries yet" description="This rider has no delivery history." />
            ) : (
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
                    <tr key={o._id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                      <AdminTd className="text-content-neutral-primary">{o.orderId}</AdminTd>
                      <AdminTd>{o.customerName}</AdminTd>
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
            title="Ratings"
            subtitle="Reviews for this rider."
            right={<AdminBadge variant="neutral">{reviews.length} reviews</AdminBadge>}
          >
            {reviews.length === 0 ? (
              <EmptyState size="sm" title="No rider reviews" description="This rider has not received reviews yet." />
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-xl border border-border-muted bg-surface-canvas p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-content-neutral-primary">
                        {r.customerName || "Customer"}
                      </p>
                      <AdminBadge variant={r.isActive ? "neutral" : "danger"}>
                        {r.isActive ? `${r.rating}/5` : "Hidden"}
                      </AdminBadge>
                    </div>
                    <p className="mt-2 text-sm text-content-neutral-secondary">{r.comment ?? "—"}</p>
                    <p className="mt-2 text-xs text-content-neutral-muted">{formatAdminDate(r.createdAt)}</p>
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
