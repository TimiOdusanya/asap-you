"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  EyeIcon,
  LockKeyOpenIcon,
  MagnifyingGlassIcon,
  ProhibitIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { AdminTableSkeleton, AdminToolbarSkeleton } from "@/components/admin/admin-page-skeletons";
import { useAdminListMutations } from "@/components/admin/admin-action-panel";
import {
  adminUsersQueryKey,
  fetchAdminUsers,
} from "@/services/admin/admin.api";
import {
  displayName,
  formatAdminDate,
  userIdString,
  userStatus,
} from "@/lib/admin-mappers";

const PAGE_SIZE = 20;

export default function AdminCustomersPage() {
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const { blockUser } = useAdminListMutations();

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [q]);

  const { data, isPending, isFetching } = useQuery({
    queryKey: adminUsersQueryKey({ page, limit: PAGE_SIZE, role: "customer", search: debouncedQ || undefined }),
    queryFn: () =>
      fetchAdminUsers({ page, limit: PAGE_SIZE, role: "customer", search: debouncedQ || undefined }),
  });

  const rows = data?.data.users ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const blockedCount = rows.filter((c) => !c.isActive).length;

  return (
    <AdminPageShell
      title="Customers"
      subtitle="View, block, and investigate shopper activity."
    >
      {isPending ? (
        <AdminToolbarSkeleton />
      ) : (
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
            <AdminBadge variant="neutral">{total} total</AdminBadge>
            <AdminBadge variant="warning">{blockedCount} blocked on page</AdminBadge>
          </div>
        </div>
      )}

      {isPending ? (
        <AdminTableSkeleton rows={8} cols={6} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No customers found"
          description="Try a different search or check back later."
          action={{ label: "Back to overview", href: "/admin/dashboard" }}
          actionIcon={<ArrowLeftIcon className="size-4 shrink-0" aria-hidden />}
        />
      ) : (
        <>
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
              {rows.map((c) => {
                const status = userStatus(c.isActive);
                const id = userIdString(c);
                return (
                  <tr key={id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                    <AdminTd>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-content-neutral-primary">
                          {displayName(c)}
                        </p>
                        <p className="truncate text-xs text-content-neutral-muted">{c.email}</p>
                      </div>
                    </AdminTd>
                    <AdminTd>
                      {status === "active" ? (
                        <AdminBadge variant="success">Active</AdminBadge>
                      ) : (
                        <AdminBadge variant="danger">Blocked</AdminBadge>
                      )}
                    </AdminTd>
                    <AdminTd className="text-content-neutral-primary">{c.ordersCount ?? 0}</AdminTd>
                    <AdminTd className="text-content-neutral-primary">
                      ₦{(c.totalSpent ?? 0).toLocaleString()}
                    </AdminTd>
                    <AdminTd>{formatAdminDate(c.updatedAt)}</AdminTd>
                    <AdminTd className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                          <Link href={`/admin/customers/${id}`} className="inline-flex items-center gap-1.5">
                            <EyeIcon className="size-4" aria-hidden />
                            View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={blockUser.isPending}
                          className="h-8 rounded-full border-border-muted gap-1.5"
                          onClick={() =>
                            blockUser.mutate({ userId: id, isActive: status === "blocked" })
                          }
                        >
                          {status === "blocked" ? (
                            <LockKeyOpenIcon className="size-4 shrink-0" aria-hidden />
                          ) : (
                            <ProhibitIcon className="size-4 shrink-0" aria-hidden />
                          )}
                          {status === "blocked" ? "Unblock" : "Block"}
                        </Button>
                      </div>
                    </AdminTd>
                  </tr>
                );
              })}
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
