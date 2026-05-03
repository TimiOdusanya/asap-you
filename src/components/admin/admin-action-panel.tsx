"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowCounterClockwiseIcon,
  ArrowLeftIcon,
  LockKeyOpenIcon,
  ProhibitIcon,
  ShieldCheckIcon,
  SignInIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type { AdminAccountStatus, VerificationStatus } from "@/components/admin/admin-types";

function statusBadge(status: AdminAccountStatus) {
  if (status === "active") return <AdminBadge variant="success">Active</AdminBadge>;
  if (status === "blocked") return <AdminBadge variant="danger">Blocked</AdminBadge>;
  return <AdminBadge variant="neutral">Deleted</AdminBadge>;
}

function verificationBadge(v: VerificationStatus | undefined) {
  if (!v) return null;
  if (v === "verified") return <AdminBadge variant="success">Verified</AdminBadge>;
  if (v === "pending") return <AdminBadge variant="warning">Pending</AdminBadge>;
  if (v === "rejected") return <AdminBadge variant="danger">Rejected</AdminBadge>;
  return <AdminBadge variant="neutral">Unverified</AdminBadge>;
}

export function AdminActionPanel({
  backHref,
  status,
  verificationStatus,
  actionsLabel,
}: {
  backHref: string;
  status: AdminAccountStatus;
  verificationStatus?: VerificationStatus;
  actionsLabel: "Customer actions" | "Vendor actions" | "Rider actions";
}) {
  return (
    <div className="space-y-4">
      <AdminSectionCard
        title="Status"
        subtitle="Account & verification state."
        right={
          <Button asChild variant="outline" className="rounded-full border-border-muted">
            <Link href={backHref} className="inline-flex items-center gap-2">
              <ArrowLeftIcon className="size-4 shrink-0" aria-hidden />
              Back
            </Link>
          </Button>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {statusBadge(status)}
          {verificationBadge(verificationStatus)}
        </div>
      </AdminSectionCard>

      <AdminSectionCard title={actionsLabel} subtitle="These are UI placeholders until endpoints are wired.">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 rounded-xl border-border-muted"
            onClick={() => toast.info("Block/unblock will be wired once endpoints are connected.")}
          >
            {status === "blocked" ? (
              <LockKeyOpenIcon className="size-4 shrink-0" aria-hidden />
            ) : (
              <ProhibitIcon className="size-4 shrink-0" aria-hidden />
            )}
            {status === "blocked" ? "Unblock account" : "Block account"}
          </Button>

          {verificationStatus ? (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl border-border-muted"
              onClick={() => toast.info("Verify/reject will be wired once endpoints are connected.")}
            >
              <ShieldCheckIcon className="size-4" aria-hidden />
              {verificationStatus === "verified" ? "Recheck verification" : "Verify account"}
            </Button>
          ) : null}

          <Button
            variant="outline"
            className="w-full justify-start gap-2 rounded-xl border-border-muted"
            onClick={() => toast.info("Password reset will be wired once endpoints are connected.")}
          >
            <ArrowCounterClockwiseIcon className="size-4" aria-hidden />
            Send password reset
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 rounded-xl border-border-muted"
            onClick={() => toast.info("Impersonation will be wired once endpoints are connected.")}
          >
            <SignInIcon className="size-4" aria-hidden />
            Impersonate (view as user)
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 rounded-xl border-border-muted text-content-negative hover:text-content-negative"
            onClick={() => toast.info("Delete will be wired once endpoints are connected.")}
          >
            <TrashIcon className="size-4" aria-hidden />
            Delete account
          </Button>
        </div>
      </AdminSectionCard>
    </div>
  );
}

