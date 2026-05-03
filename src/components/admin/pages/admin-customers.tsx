"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ExportIcon,
  EyeIcon,
  LockKeyOpenIcon,
  MagnifyingGlassIcon,
  ProhibitIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { mockCustomers } from "@/components/admin/mock-admin-data";
import { toast } from "sonner";

function TableSkeleton() {
  return (
    <div className="rounded-2xl border border-border-muted bg-white p-4" role="status" aria-label="Loading customers">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function AdminCustomersPage() {
  const [q, setQ] = useState("");
  const isLoading = false;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return mockCustomers;
    return mockCustomers.filter((c) =>
      [c.name, c.email, c.phone ?? ""].some((v) => v.toLowerCase().includes(needle))
    );
  }, [q]);

  return (
    <AdminPageShell
      title="Customers"
      subtitle="View, block, and investigate shopper activity."
      actions={
        <Button
          variant="outline"
          className="rounded-full border-border-muted gap-2"
          onClick={() => toast.info("Export will be wired once endpoints are connected.")}
        >
          <ExportIcon className="size-4" aria-hidden />
          Export
        </Button>
      }
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-border-muted bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-neutral-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, or phone"
            className="h-10 rounded-lg border-border-muted bg-white pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <AdminBadge variant="neutral">{rows.length} total</AdminBadge>
          <AdminBadge variant="warning">
            {rows.filter((c) => c.status === "blocked").length} blocked
          </AdminBadge>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try a different search. Once we connect the admin endpoints, this list will reflect live customer accounts."
          action={{ label: "Back to overview", href: "/admin/dashboard" }}
          actionIcon={<ArrowLeftIcon className="size-4 shrink-0" aria-hidden />}
        />
      ) : (
        <AdminTable>
          <thead>
            <tr className="border-b border-border-muted">
              <AdminTh>Customer</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Orders</AdminTh>
              <AdminTh>Total spent</AdminTh>
              <AdminTh>Last active</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                <AdminTd>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-content-neutral-primary">{c.name}</p>
                    <p className="truncate text-xs text-content-neutral-muted">{c.email}</p>
                  </div>
                </AdminTd>
                <AdminTd>
                  {c.status === "active" ? (
                    <AdminBadge variant="success">Active</AdminBadge>
                  ) : c.status === "blocked" ? (
                    <AdminBadge variant="danger">Blocked</AdminBadge>
                  ) : (
                    <AdminBadge variant="neutral">Deleted</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd className="text-content-neutral-primary">{c.ordersCount}</AdminTd>
                <AdminTd className="text-content-neutral-primary">
                  ₦{c.totalSpent.toLocaleString()}
                </AdminTd>
                <AdminTd>{c.lastActiveAt ?? "—"}</AdminTd>
                <AdminTd className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                      <Link href={`/admin/customers/${c.id}`} className="inline-flex items-center gap-1.5">
                        <EyeIcon className="size-4" aria-hidden />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full border-border-muted gap-1.5"
                      onClick={() => toast.info("Block/unblock will be wired once endpoints are connected.")}
                    >
                      {c.status === "blocked" ? (
                        <LockKeyOpenIcon className="size-4 shrink-0" aria-hidden />
                      ) : (
                        <ProhibitIcon className="size-4 shrink-0" aria-hidden />
                      )}
                      {c.status === "blocked" ? "Unblock" : "Block"}
                    </Button>
                  </div>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </AdminPageShell>
  );
}

