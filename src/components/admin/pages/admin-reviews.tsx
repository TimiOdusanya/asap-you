"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EyeSlashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminReviewCardsSkeleton, AdminToolbarSkeleton } from "@/components/admin/admin-page-skeletons";
import {
  adminDashboardQueryKey,
  adminReviewsQueryKey,
  fetchAdminReviews,
  updateAdminReview,
} from "@/services/admin/admin.api";
import { formatAdminDate } from "@/lib/admin-mappers";

const PAGE_SIZE = 20;

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [q, setQ] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [q]);

  const { data, isPending, isFetching } = useQuery({
    queryKey: adminReviewsQueryKey({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
    queryFn: () => fetchAdminReviews({ page, limit: PAGE_SIZE, search: debouncedQ || undefined }),
  });

  const hideReview = useMutation({
    mutationFn: ({ reviewId, isActive }: { reviewId: string; isActive: boolean }) =>
      updateAdminReview(reviewId, { isActive }),
    onSuccess: (_res, vars) => {
      toast.success(vars.isActive ? "Review restored" : "Review hidden");
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey });
    },
    onError: () => toast.error("Could not update review"),
  });

  const rows = data?.data.reviews ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPageShell title="Reviews" subtitle="Moderate reviews and track satisfaction.">
      {isPending ? (
        <AdminToolbarSkeleton />
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-border-muted bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-neutral-muted" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search reviews"
              className="h-10 rounded-lg border-border-muted bg-white pl-9 text-sm"
            />
          </div>
          <AdminBadge variant="neutral">{total} total</AdminBadge>
        </div>
      )}

      {isPending ? (
        <AdminReviewCardsSkeleton count={5} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No reviews found"
          description={q ? "No reviews match your search." : "Customer reviews will appear here."}
        />
      ) : (
        <>
          <div className="space-y-3">
            {rows.map((r) => {
              const targetLabel =
                r.targetType === "product" && r.productName
                  ? `PRODUCT: ${r.productName}`
                  : r.targetType.toUpperCase();
              return (
                <div
                  key={String(r._id)}
                  className="rounded-2xl border border-border-muted bg-white p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-content-neutral-primary">
                        {r.customerName || "Customer"}
                      </p>
                      <p className="mt-1 text-sm text-content-neutral-secondary">{targetLabel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <AdminBadge variant={r.isActive ? "neutral" : "danger"}>
                        {r.isActive ? `${r.rating}/5` : "Hidden"}
                      </AdminBadge>
                      <AdminBadge variant="neutral">{formatAdminDate(r.createdAt)}</AdminBadge>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-content-neutral-secondary">{r.comment ?? "—"}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={hideReview.isPending}
                      className="rounded-full border-border-muted gap-2"
                      onClick={() =>
                        hideReview.mutate({
                          reviewId: String(r._id),
                          isActive: !r.isActive,
                        })
                      }
                    >
                      <EyeSlashIcon className="size-4" aria-hidden />
                      {r.isActive ? "Hide" : "Restore"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

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
