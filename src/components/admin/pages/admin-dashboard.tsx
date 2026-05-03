"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRightIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { mockCustomers, mockOrders, mockReviews, mockRiders, mockVendors } from "@/components/admin/mock-admin-data";

function StatCard({
  label,
  value,
  hint,
  delta,
  href,
}: {
  label: string;
  value: string;
  hint: string;
  delta?: { value: string; direction: "up" | "down" | "flat" };
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
        <div className="flex items-center gap-2">
          {delta ? (
            <AdminBadge
              variant={
                delta.direction === "up"
                  ? "success"
                  : delta.direction === "down"
                    ? "danger"
                    : "neutral"
              }
            >
              {delta.value}
            </AdminBadge>
          ) : null}
          <ArrowUpRightIcon
            className="size-4 text-content-neutral-muted transition group-hover:text-content-neutral-secondary"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

function MiniBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-sm bg-surface-brand/20"
          style={{ height: `${Math.round((v / max) * 36) + 8}px` }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const blockedCustomers = mockCustomers.filter((c) => c.status === "blocked").length;
  const unverifiedRiders = mockRiders.filter((r) => r.verificationStatus !== "verified").length;
  const unverifiedVendors = mockVendors.filter((v) => v.verificationStatus !== "verified").length;
  const pendingVerifications =
    mockVendors.filter((v) => v.verificationStatus === "pending").length +
    mockRiders.filter((r) => r.verificationStatus === "pending").length;

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Customers"
          value={String(mockCustomers.length)}
          hint={`${blockedCustomers} blocked`}
          delta={{ value: "+6.2%", direction: "up" }}
          href="/admin/customers"
        />
        <StatCard
          label="Vendors"
          value={String(mockVendors.length)}
          hint={`${unverifiedVendors} unverified`}
          delta={{ value: "2 pending", direction: "flat" }}
          href="/admin/vendors"
        />
        <StatCard
          label="Riders"
          value={String(mockRiders.length)}
          hint={`${unverifiedRiders} unverified`}
          delta={{ value: "+1.1%", direction: "up" }}
          href="/admin/riders"
        />
        <StatCard
          label="Orders"
          value={String(mockOrders.length)}
          hint="last 30 days • 2 cancelled"
          delta={{ value: "-0.4%", direction: "down" }}
          href="/admin/orders"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AdminSectionCard
          title="Today at a glance"
          subtitle="Fast signals to spot issues early."
          right={<AdminBadge variant={pendingVerifications > 0 ? "warning" : "success"}>{pendingVerifications} pending</AdminBadge>}
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border-muted bg-surface-canvas p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-content-neutral-muted">Order volume</p>
                <AdminBadge variant="success">+8%</AdminBadge>
              </div>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-2xl font-semibold text-content-neutral-primary">42</p>
                <MiniBars values={[10, 12, 18, 16, 24, 20, 26]} />
              </div>
              <p className="mt-2 text-xs text-content-neutral-muted">
                Compared to yesterday. Drill into Orders for breakdown.
              </p>
            </div>

            <div className="rounded-xl border border-border-muted bg-surface-canvas p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-content-neutral-muted">Quality signals</p>
                <AdminBadge variant="neutral">Last 24h</AdminBadge>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-content-neutral-secondary">Avg vendor rating</span>
                  <span className="font-semibold text-content-neutral-primary">4.6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-content-neutral-secondary">Avg rider rating</span>
                  <span className="font-semibold text-content-neutral-primary">4.7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-content-neutral-secondary">Cancellations</span>
                  <span className="font-semibold text-content-neutral-primary">2</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-content-neutral-muted">
                Watch cancellations and low ratings for fraud or service issues.
              </p>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Verification queue"
          subtitle="Review submitted vendors and riders."
          right={
            <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
              <Link href="/admin/vendors">Open</Link>
            </Button>
          }
        >
          <div className="space-y-3">
            <Link
              href="/admin/vendors"
              className="flex items-center justify-between rounded-xl border border-border-muted bg-surface-canvas px-4 py-3 hover:bg-surface-subtle"
            >
              <span className="text-sm text-content-neutral-secondary">
                Vendors pending verification
              </span>
              <span className="text-sm font-semibold text-content-neutral-primary">
                {mockVendors.filter((v) => v.verificationStatus === "pending").length}
              </span>
            </Link>
            <Link
              href="/admin/riders"
              className="flex items-center justify-between rounded-xl border border-border-muted bg-surface-canvas px-4 py-3 hover:bg-surface-subtle"
            >
              <span className="text-sm text-content-neutral-secondary">
                Riders pending verification
              </span>
              <span className="text-sm font-semibold text-content-neutral-primary">
                {mockRiders.filter((r) => r.verificationStatus === "pending").length}
              </span>
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center justify-between rounded-xl border border-border-muted bg-surface-canvas px-4 py-3 hover:bg-surface-subtle"
            >
              <span className="text-sm text-content-neutral-secondary">
                Blocked customers
              </span>
              <span className="text-sm font-semibold text-content-neutral-primary">
                {blockedCustomers}
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
              {mockOrders.slice(0, 5).map((o) => (
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
          title="Recent reviews"
          subtitle="Sentiment snapshot across vendors and riders."
          right={
            <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
              <Link href="/admin/reviews">View all</Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {mockReviews.slice(0, 5).map((r) => (
              <div key={r.id} className="rounded-xl border border-border-muted bg-surface-canvas p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-content-neutral-primary">
                      {r.authorName}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-content-neutral-secondary">
                      {r.target.toUpperCase()}: {r.targetName}
                    </p>
                  </div>
                  <AdminBadge variant="neutral">{r.rating}/5</AdminBadge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-content-neutral-secondary">
                  {r.comment}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-content-neutral-muted">
                  <span className="inline-flex items-center gap-1">
                    <ClockCounterClockwiseIcon className="size-3.5" aria-hidden />
                    {r.createdAt}
                  </span>
                  <Link href="/admin/reviews" className="text-surface-brand hover:underline">
                    Moderate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </div>
    </AdminPageShell>
  );
}

