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
import { mockVendors } from "@/components/admin/mock-admin-data";

export default function AdminVendorsPage() {
  const [q, setQ] = useState("");
  const isLoading = false;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return mockVendors;
    return mockVendors.filter((v) =>
      [v.businessName, v.ownerName, v.email].some((x) => x.toLowerCase().includes(needle))
    );
  }, [q]);

  return (
    <AdminPageShell
      title="Vendors"
      subtitle="Moderate stores, verify vendors, and review product quality."
      actions={
        <Button
          variant="outline"
          className="rounded-full border-border-muted gap-2"
          onClick={() => toast.info("Bulk verification will be wired once endpoints are connected.")}
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
            placeholder="Search business, owner, or email"
            className="h-10 rounded-lg border-border-muted bg-white pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <AdminBadge variant="neutral">{rows.length} total</AdminBadge>
          <AdminBadge variant="warning">
            {rows.filter((v) => v.verificationStatus !== "verified").length} unverified
          </AdminBadge>
        </div>
      </div>

      {isLoading ? (
        <EmptyState
          title="Loading vendors…"
          description="Skeletons will appear here once endpoints are wired."
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No vendors found"
          description="Try a different search. Once endpoints are connected, this list will reflect live vendors."
          action={{ label: "Back to overview", href: "/admin/dashboard" }}
        />
      ) : (
        <AdminTable>
          <thead>
            <tr className="border-b border-border-muted">
              <AdminTh>Business</AdminTh>
              <AdminTh>Owner</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Verification</AdminTh>
              <AdminTh>Products</AdminTh>
              <AdminTh>Rating</AdminTh>
              <AdminTh className="text-right">Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id} className="border-b border-border-muted/50 hover:bg-surface-subtle">
                <AdminTd>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-content-neutral-primary">{v.businessName}</p>
                    <p className="truncate text-xs text-content-neutral-muted">{v.email}</p>
                  </div>
                </AdminTd>
                <AdminTd className="text-content-neutral-primary">{v.ownerName}</AdminTd>
                <AdminTd>
                  {v.status === "active" ? (
                    <AdminBadge variant="success">Active</AdminBadge>
                  ) : v.status === "blocked" ? (
                    <AdminBadge variant="danger">Blocked</AdminBadge>
                  ) : (
                    <AdminBadge variant="neutral">Deleted</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd>
                  {v.verificationStatus === "verified" ? (
                    <AdminBadge variant="success">Verified</AdminBadge>
                  ) : v.verificationStatus === "pending" ? (
                    <AdminBadge variant="warning">Pending</AdminBadge>
                  ) : v.verificationStatus === "rejected" ? (
                    <AdminBadge variant="danger">Rejected</AdminBadge>
                  ) : (
                    <AdminBadge variant="neutral">Unverified</AdminBadge>
                  )}
                </AdminTd>
                <AdminTd className="text-content-neutral-primary">{v.productsCount}</AdminTd>
                <AdminTd className="text-content-neutral-primary">
                  {v.averageRating ? `${v.averageRating.toFixed(1)}/5` : "—"}
                </AdminTd>
                <AdminTd className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-full border-border-muted">
                      <Link href={`/admin/vendors/${v.id}`} className="inline-flex items-center gap-1.5">
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
                      {v.verificationStatus === "verified" ? "Recheck" : "Verify"}
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

