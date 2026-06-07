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
import { adminVendorsQueryKey, fetchAdminVendors } from "@/services/admin/admin.api";
import {
  displayName,
  entityIdString,
  userStatus,
  vendorVerificationStatus,
} from "@/lib/admin-mappers";

const PAGE_SIZE = 20;

function verificationBadge(status: ReturnType<typeof vendorVerificationStatus>) {
  if (status === "verified") return <AdminBadge variant="success">Verified</AdminBadge>;
  if (status === "pending") return <AdminBadge variant="warning">Pending</AdminBadge>;
  if (status === "rejected") return <AdminBadge variant="danger">Rejected</AdminBadge>;
  return <AdminBadge variant="neutral">Unverified</AdminBadge>;
}

export default function AdminVendorsPage() {
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const { verifyVendor } = useAdminListMutations();

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [q]);

  const { data, isPending, isFetching } = useQuery({
    queryKey: adminVendorsQueryKey({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
    queryFn: () => fetchAdminVendors({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
  });

  const rows = data?.data.vendors ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const unverifiedCount = rows.filter((v) => !v.verification?.isVerified).length;

  return (
    <AdminPageShell
      title="Vendors"
      subtitle="Moderate stores, verify vendors, and review product quality."
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
              placeholder="Search business, owner, or email"
              className="h-10 rounded-lg border-border-muted bg-white pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <AdminBadge variant="neutral">{total} total</AdminBadge>
            <AdminBadge variant="warning">{unverifiedCount} unverified on page</AdminBadge>
          </div>
        </div>
      )}

      {isPending ? (
        <AdminTableSkeleton rows={8} cols={7} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No vendors found"
          description="Try a different search or check back later."
          action={{ label: "Back to overview", href: "/admin/dashboard" }}
        />
      ) : (
        <>
          <AdminTable>
            <thead>
              <tr className="border-b border-border-muted">
                <AdminTh>Business</AdminTh>
                <AdminTh>Owner</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh>Verification</AdminTh>
                <AdminTh>Orders</AdminTh>
                <AdminTh>Rating</AdminTh>
                <AdminTh className="text-right">Actions</AdminTh>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => {
                const id = entityIdString(v);
                const verification = vendorVerificationStatus(v);
                const status = userStatus(v.isActive);
                return (
                  <tr key={id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                    <AdminTd>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-content-neutral-primary">
                          {v.businessName}
                        </p>
                        <p className="truncate text-xs text-content-neutral-muted">
                          {v.user?.email ?? v.businessInfo?.contactEmail ?? "—"}
                        </p>
                      </div>
                    </AdminTd>
                    <AdminTd className="text-content-neutral-primary">
                      {displayName({ user: v.user })}
                    </AdminTd>
                    <AdminTd>
                      {status === "active" ? (
                        <AdminBadge variant="success">Active</AdminBadge>
                      ) : (
                        <AdminBadge variant="danger">Blocked</AdminBadge>
                      )}
                    </AdminTd>
                    <AdminTd>{verificationBadge(verification)}</AdminTd>
                    <AdminTd className="text-content-neutral-primary">
                      {v.stats?.totalOrders ?? 0}
                    </AdminTd>
                    <AdminTd className="text-content-neutral-primary">
                      {v.stats?.averageRating ? `${v.stats.averageRating.toFixed(1)}/5` : "—"}
                    </AdminTd>
                    <AdminTd className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                          <Link href={`/admin/vendors/${id}`} className="inline-flex items-center gap-1.5">
                            <EyeIcon className="size-4" aria-hidden />
                            View
                          </Link>
                        </Button>
                        {verification !== "verified" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={verifyVendor.isPending}
                            className="h-8 rounded-full border-border-muted gap-1.5"
                            onClick={() => verifyVendor.mutate(id)}
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
