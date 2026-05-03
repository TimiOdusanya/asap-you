"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ChecksIcon, EyeIcon, MagnifyingGlassIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { mockRiders } from "@/components/admin/mock-admin-data";

export default function AdminRidersPage() {
  const [q, setQ] = useState("");
  const isLoading = false;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return mockRiders;
    return mockRiders.filter((r) =>
      [r.name, r.email].some((x) => x.toLowerCase().includes(needle))
    );
  }, [q]);

  return (
    <AdminPageShell
      title="Riders"
      subtitle="Verify riders, monitor ratings, and review delivery history."
      actions={
        <Button
          variant="outline"
          className="rounded-full border-border-muted gap-2"
          onClick={() => toast.info("Bulk verify will be wired once endpoints are connected.")}
        >
          <ChecksIcon className="size-4" aria-hidden />
          Bulk verify
        </Button>
      }
    >
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
          <AdminBadge variant="neutral">{rows.length} total</AdminBadge>
          <AdminBadge variant="warning">
            {rows.filter((r) => r.verificationStatus !== "verified").length} unverified
          </AdminBadge>
        </div>
      </div>

      {isLoading ? (
        <EmptyState
          title="Loading riders…"
          description="Skeletons will appear here once endpoints are wired."
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No riders found"
          description="Try a different search. Once endpoints are connected, this list will reflect live riders."
          action={{ label: "Back to overview", href: "/admin/dashboard" }}
        />
      ) : (
        <AdminTable>
          <thead>
            <tr className="border-b border-border-muted">
              <AdminTh>Rider</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Verification</AdminTh>
              <AdminTh>Deliveries</AdminTh>
              <AdminTh>Rating</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                <AdminTd>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-content-neutral-primary">{r.name}</p>
                    <p className="truncate text-xs text-content-neutral-muted">{r.email}</p>
                  </div>
                </AdminTd>
                <AdminTd>
                  {r.status === "active" ? (
                    <AdminBadge variant="success">Active</AdminBadge>
                  ) : r.status === "blocked" ? (
                    <AdminBadge variant="danger">Blocked</AdminBadge>
                  ) : (
                    <AdminBadge variant="neutral">Deleted</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd>
                  {r.verificationStatus === "verified" ? (
                    <AdminBadge variant="success">Verified</AdminBadge>
                  ) : r.verificationStatus === "pending" ? (
                    <AdminBadge variant="warning">Pending</AdminBadge>
                  ) : r.verificationStatus === "rejected" ? (
                    <AdminBadge variant="danger">Rejected</AdminBadge>
                  ) : (
                    <AdminBadge variant="neutral">Unverified</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd className="text-content-neutral-primary">{r.deliveriesCount}</AdminTd>
                <AdminTd className="text-content-neutral-primary">
                  {r.averageRating ? `${r.averageRating.toFixed(1)}/5` : "—"}
                </AdminTd>
                <AdminTd className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                      <Link href={`/admin/riders/${r.id}`} className="inline-flex items-center gap-1.5">
                        <EyeIcon className="size-4" aria-hidden />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full border-border-muted gap-1.5"
                      onClick={() => toast.info("Verify will be wired once endpoints are connected.")}
                    >
                      <ShieldCheckIcon className="size-4" aria-hidden />
                      {r.verificationStatus === "verified" ? "Recheck" : "Verify"}
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

