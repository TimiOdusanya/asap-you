"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { AdminDashboardSkeleton } from "@/components/admin/admin-page-skeletons";
import {
  adminDashboardQueryKey,
  fetchAdminDashboard,
} from "@/services/admin/admin.api";
import { formatAdminDate, orderStatusBadgeVariant } from "@/lib/admin-mappers";

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string;
  hint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border-muted bg-white p-5 transition hover:bg-surface-subtle"
    >
      <p className="text-xs font-medium text-content-neutral-muted">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xl font-semibold text-content-neutral-primary">{value}</p>
          <p className="mt-0.5 text-xs text-content-neutral-muted">{hint}</p>
        </div>
        <ArrowUpRightIcon
          className="size-4 text-content-neutral-muted transition group-hover:text-content-neutral-secondary"
          aria-hidden
        />
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const { data, isPending } = useQuery({
    queryKey: adminDashboardQueryKey,
    queryFn: fetchAdminDashboard,
    refetchInterval: 60_000,
  });

  const stats = data?.data;

  return (
    <AdminPageShell
      title="Overview"
      subtitle="A live snapshot of marketplace health, risk, and growth."
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-full border-border-muted">
            <Link href="/admin/orders">Orders</Link>
          </Button>
          <Button asChild className="rounded-full bg-surface-brand hover:bg-surface-brand/90">
            <Link href="/admin/vendors">Verification queue</Link>
          </Button>
        </div>
      }
    >
      {isPending || !stats ? (
        <AdminDashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Customers"
              value={String(stats.users.byRole.customer ?? 0)}
              hint={`${stats.blockedCustomers} blocked`}
              href="/admin/customers"
            />
            <StatCard
              label="Vendors"
              value={String(stats.vendors.total)}
              hint={`${stats.pendingVendorVerifications} pending approval`}
              href="/admin/vendors"
            />
            <StatCard
              label="Riders"
              value={String(stats.riders.total)}
              hint={`${stats.pendingRiderApprovals} pending approval`}
              href="/admin/riders"
            />
            <StatCard
              label="Orders (24h)"
              value={String(stats.ordersLast24h.total)}
              hint={`${stats.ordersLast24h.byStatus.length} status groups`}
              href="/admin/orders"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <AdminSectionCard
              title="Today at a glance"
              subtitle="Fast signals to spot issues early."
              right={
                <AdminBadge
                  variant={
                    stats.pendingVendorVerifications + stats.pendingRiderApprovals > 0
                      ? "warning"
                      : "success"
                  }
                >
                  {stats.pendingVendorVerifications + stats.pendingRiderApprovals} pending
                </AdminBadge>
              }
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border-muted bg-surface-canvas p-4">
                  <p className="text-xs font-medium text-content-neutral-muted">Orders last 24h</p>
                  <p className="mt-2 text-2xl font-semibold text-content-neutral-primary">
                    {stats.ordersLast24h.total}
                  </p>
                  <div className="mt-3 space-y-1 text-sm">
                    {stats.ordersLast24h.byStatus.slice(0, 4).map((row) => (
                      <div key={row.status} className="flex items-center justify-between">
                        <span className="text-content-neutral-secondary">
                          {row.status.replaceAll("_", " ")}
                        </span>
                        <span className="font-semibold text-content-neutral-primary">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-border-muted bg-surface-canvas p-4">
                  <p className="text-xs font-medium text-content-neutral-muted">Platform users</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-content-neutral-secondary">Active users</span>
                      <span className="font-semibold text-content-neutral-primary">
                        {stats.users.active}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-content-neutral-secondary">Inactive users</span>
                      <span className="font-semibold text-content-neutral-primary">
                        {stats.users.inactive}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-content-neutral-secondary">Active riders</span>
                      <span className="font-semibold text-content-neutral-primary">
                        {stats.riders.active}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AdminSectionCard>

            <AdminSectionCard title="Verification queue" subtitle="Review submitted vendors and riders.">
              <div className="space-y-3">
                <Link
                  href="/admin/vendors"
                  className="flex items-center justify-between rounded-xl border border-border-muted bg-surface-canvas px-4 py-3 hover:bg-surface-subtle"
                >
                  <span className="text-sm text-content-neutral-secondary">
                    Vendors pending verification
                  </span>
                  <span className="text-sm font-semibold text-content-neutral-primary">
                    {stats.pendingVendorVerifications}
                  </span>
                </Link>
                <Link
                  href="/admin/riders"
                  className="flex items-center justify-between rounded-xl border border-border-muted bg-surface-canvas px-4 py-3 hover:bg-surface-subtle"
                >
                  <span className="text-sm text-content-neutral-secondary">
                    Riders pending approval
                  </span>
                  <span className="text-sm font-semibold text-content-neutral-primary">
                    {stats.pendingRiderApprovals}
                  </span>
                </Link>
                <Link
                  href="/admin/customers"
                  className="flex items-center justify-between rounded-xl border border-border-muted bg-surface-canvas px-4 py-3 hover:bg-surface-subtle"
                >
                  <span className="text-sm text-content-neutral-secondary">Blocked customers</span>
                  <span className="text-sm font-semibold text-content-neutral-primary">
                    {stats.blockedCustomers}
                  </span>
                </Link>
              </div>
            </AdminSectionCard>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AdminSectionCard
              title="Recent orders"
              subtitle="Latest events across the marketplace."
              right={
                <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                  <Link href="/admin/orders">View all</Link>
                </Button>
              }
            >
              {stats.recentOrders.length === 0 ? (
                <p className="text-sm text-content-neutral-muted">No orders yet.</p>
              ) : (
                <AdminTable className="border-0">
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
                    {stats.recentOrders.map((o) => (
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
              title="Recent reviews"
              subtitle="Sentiment snapshot across vendors and riders."
              right={
                <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                  <Link href="/admin/reviews">View all</Link>
                </Button>
              }
            >
              {stats.recentReviews.length === 0 ? (
                <p className="text-sm text-content-neutral-muted">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentReviews.map((r) => (
                    <div key={r._id} className="rounded-xl border border-border-muted bg-surface-canvas p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-content-neutral-primary">
                            {r.customerName || "Customer"}
                          </p>
                          <p className="mt-0.5 truncate text-sm text-content-neutral-secondary">
                            {r.targetType.toUpperCase()}
                          </p>
                        </div>
                        <AdminBadge variant="neutral">{r.rating}/5</AdminBadge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-content-neutral-secondary">
                        {r.comment || "No comment"}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-content-neutral-muted">
                        <span className="inline-flex items-center gap-1">
                          <ClockCounterClockwiseIcon className="size-3.5" aria-hidden />
                          {formatAdminDate(r.createdAt)}
                        </span>
                        <Link href="/admin/reviews" className="text-surface-brand hover:underline">
                          Moderate
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AdminSectionCard>
          </div>
        </>
      )}
    </AdminPageShell>
  );
}
