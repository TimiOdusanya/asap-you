"use client";

import React, { useMemo, useState } from "react";
import { FlagIcon, EyeSlashIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { mockReviews } from "@/components/admin/mock-admin-data";

export default function AdminReviewsPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return mockReviews;
    return mockReviews.filter((r) =>
      [r.authorName, r.target, r.targetName, r.comment].some((x) => x.toLowerCase().includes(needle))
    );
  }, [q]);

  return (
    <AdminPageShell title="Reviews" subtitle="Moderate reviews and track satisfaction.">
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
        <AdminBadge variant="neutral">{rows.length} total</AdminBadge>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No reviews found"
          description="Once endpoints are connected, this page will show live reviews with moderation actions."
        />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border-muted bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-content-neutral-primary">
                    {r.authorName}
                  </p>
                  <p className="mt-1 text-sm text-content-neutral-secondary">
                    {r.target.toUpperCase()}: {r.targetName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <AdminBadge variant="neutral">{r.rating}/5</AdminBadge>
                  <AdminBadge variant="neutral">{r.createdAt}</AdminBadge>
                </div>
              </div>
              <p className="mt-3 text-sm text-content-neutral-secondary">{r.comment}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-full border border-border-muted bg-white px-4 py-2 text-xs font-medium text-content-neutral-secondary hover:bg-surface-subtle">
                  <EyeSlashIcon className="size-4" aria-hidden />
                  Hide
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-border-muted bg-white px-4 py-2 text-xs font-medium text-content-neutral-secondary hover:bg-surface-subtle">
                  <FlagIcon className="size-4" aria-hidden />
                  Flag
                </button>
              </div>
              <p className="mt-2 text-xs text-content-neutral-muted">
                Moderation actions are placeholders until endpoints are connected.
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}

