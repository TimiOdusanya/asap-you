"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { EyeIcon, MagnifyingGlassIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { AdminTableSkeleton, AdminToolbarSkeleton } from "@/components/admin/admin-page-skeletons";
import { useAdminListMutations } from "@/components/admin/admin-action-panel";
import { adminRidersQueryKey, fetchAdminRiders } from "@/services/admin/admin.api";
import {
  displayName,
  entityIdString,
  riderVerificationStatus,
  userStatus,
} from "@/lib/admin-mappers";

const PAGE_SIZE = 20;

function verificationBadge(status: ReturnType<typeof riderVerificationStatus>) {
  if (status === "verified") return <AdminBadge variant="success">Approved</AdminBadge>;
  return <AdminBadge variant="warning">Pending</AdminBadge>;
}

export default function AdminRidersPage() {
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const { approveRider } = useAdminListMutations();

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [q]);

  const { data, isPending, isFetching } = useQuery({
    queryKey: adminRidersQueryKey({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
    queryFn: () => fetchAdminRiders({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
  });

  const rows = data?.data.riders ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pendingCount = rows.filter((r) => !r.isActive).length;

  return (
    <AdminPageShell
      title="Riders"
      subtitle="Verify riders, monitor ratings, and review delivery history."
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
              placeholder="Search rider by name or email"
              className="h-10 rounded-lg border-border-muted bg-white pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <AdminBadge variant="neutral">{total} total</AdminBadge>
            <AdminBadge variant="warning">{pendingCount} pending on page</AdminBadge>
          </div>
        </div>
      )}

      {isPending ? (
        <AdminTableSkeleton rows={8} cols={6} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No riders found"
          description="Try a different search or check back later."
          action={{ label: "Back to overview", href: "/admin/dashboard" }}
        />
      ) : (
        <>
          <AdminTable>
            <thead>
              <tr className="border-b border-border-muted">
                <AdminTh>Rider</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Approval</AdminTh>
                <AdminTh>Deliveries</AdminTh>
                <AdminTh>Rating</AdminTh>
                <AdminTh className="text-right">Actions</AdminTh>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const id = entityIdString(r);
                const verification = riderVerificationStatus(r);
                const accountStatus = userStatus(r.isActive);
                return (
                  <tr key={id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                    <AdminTd>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-content-neutral-primary">
                          {displayName({ user: r.user })}
                        </p>
                        <p className="truncate text-xs text-content-neutral-muted">
                          {r.user?.email ?? "—"}
                        </p>
                      </div>
                    </AdminTd>
                    <AdminTd>
                      {accountStatus === "active" ? (
                        <AdminBadge variant="success">Active</AdminBadge>
                      ) : (
                        <AdminBadge variant="danger">Inactive</AdminBadge>
                      )}
                    </AdminTd>
                    <AdminTd>{verificationBadge(verification)}</AdminTd>
                    <AdminTd className="text-content-neutral-primary">
                      {r.stats?.totalDeliveries ?? 0}
                    </AdminTd>
                    <AdminTd className="text-content-neutral-primary">
                      {r.stats?.averageRating ? `${r.stats.averageRating.toFixed(1)}/5` : "—"}
                    </AdminTd>
                    <AdminTd className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                          <Link href={`/admin/riders/${id}`} className="inline-flex items-center gap-1.5">
                            <EyeIcon className="size-4" aria-hidden />
                            View
                          </Link>
                        </Button>
                        {verification !== "verified" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={approveRider.isPending}
                            className="h-8 rounded-full border-border-muted gap-1.5"
                            onClick={() => approveRider.mutate(id)}
                          >
                            <ShieldCheckIcon className="size-4" aria-hidden />
                            Approve
                          </Button>
                        ) : null}
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
