"use client";

import React from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  LockKeyOpenIcon,
  ProhibitIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminBadge } from "@/components/admin/admin-badge";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import type { AdminAccountStatus, VerificationStatus } from "@/components/admin/admin-types";
import {
  adminDashboardQueryKey,
  adminRiderQueryKey,
  adminUserQueryKey,
  adminVendorQueryKey,
  updateAdminRider,
  updateAdminUser,
  updateAdminVendor,
} from "@/services/admin/admin.api";

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

type AdminActionPanelProps = {
  backHref: string;
  status: AdminAccountStatus;
  verificationStatus?: VerificationStatus;
  actionsLabel: "Customer actions" | "Vendor actions" | "Rider actions";
  userId: string;
  vendorId?: string;
  riderId?: string;
};

export function AdminActionPanel({
  backHref,
  status,
  verificationStatus,
  actionsLabel,
  userId,
  vendorId,
  riderId,
}: AdminActionPanelProps) {
  const queryClient = useQueryClient();

  const invalidate = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "riders"] });
    queryClient.invalidateQueries({ queryKey: adminUserQueryKey(userId) });
    if (vendorId) queryClient.invalidateQueries({ queryKey: adminVendorQueryKey(vendorId) });
    if (riderId) queryClient.invalidateQueries({ queryKey: adminRiderQueryKey(riderId) });
  }, [queryClient, userId, vendorId, riderId]);

  const blockMut = useMutation({
    mutationFn: () => updateAdminUser(userId, { isActive: status === "blocked" }),
    onSuccess: () => {
      toast.success(status === "blocked" ? "Account unblocked" : "Account blocked");
      invalidate();
    },
    onError: () => toast.error("Could not update account status"),
  });

  const verifyVendorMut = useMutation({
    mutationFn: () => {
      if (!vendorId) throw new Error("Missing vendor id");
      return updateAdminVendor(vendorId, { isVerified: verificationStatus !== "verified" });
    },
    onSuccess: () => {
      toast.success(
        verificationStatus === "verified" ? "Vendor marked unverified" : "Vendor approved"
      );
      invalidate();
    },
    onError: () => toast.error("Could not update vendor verification"),
  });

  const approveRiderMut = useMutation({
    mutationFn: () => {
      if (!riderId) throw new Error("Missing rider id");
      return updateAdminRider(riderId, { isActive: verificationStatus !== "verified" });
    },
    onSuccess: () => {
      toast.success(
        verificationStatus === "verified" ? "Rider approval revoked" : "Rider approved"
      );
      invalidate();
    },
    onError: () => toast.error("Could not update rider approval"),
  });

  const pending = blockMut.isPending || verifyVendorMut.isPending || approveRiderMut.isPending;

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

      <AdminSectionCard title={actionsLabel} subtitle="Moderation actions for this account.">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            disabled={pending}
            className="w-full justify-start gap-2 rounded-xl border-border-muted"
            onClick={() => blockMut.mutate()}
          >
            {status === "blocked" ? (
              <LockKeyOpenIcon className="size-4 shrink-0" aria-hidden />
            ) : (
              <ProhibitIcon className="size-4 shrink-0" aria-hidden />
            )}
            {status === "blocked" ? "Unblock account" : "Block account"}
          </Button>

          {verificationStatus && vendorId ? (
            <Button
              variant="outline"
              disabled={pending}
              className="w-full justify-start gap-2 rounded-xl border-border-muted"
              onClick={() => verifyVendorMut.mutate()}
            >
              <ShieldCheckIcon className="size-4" aria-hidden />
              {verificationStatus === "verified" ? "Revoke verification" : "Approve vendor"}
            </Button>
          ) : null}

          {verificationStatus && riderId ? (
            <Button
              variant="outline"
              disabled={pending}
              className="w-full justify-start gap-2 rounded-xl border-border-muted"
              onClick={() => approveRiderMut.mutate()}
            >
              <ShieldCheckIcon className="size-4" aria-hidden />
              {verificationStatus === "verified" ? "Revoke approval" : "Approve rider"}
            </Button>
          ) : null}
        </div>
      </AdminSectionCard>
    </div>
  );
}

export function useAdminListMutations() {
  const queryClient = useQueryClient();

  const invalidateLists = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "vendors"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "riders"] });
  }, [queryClient]);

  const blockUser = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateAdminUser(userId, { isActive }),
    onSuccess: (_res, vars) => {
      toast.success(vars.isActive ? "Account unblocked" : "Account blocked");
      invalidateLists();
    },
    onError: () => toast.error("Could not update account"),
  });

  const verifyVendor = useMutation({
    mutationFn: (vendorId: string) => updateAdminVendor(vendorId, { isVerified: true }),
    onSuccess: () => {
      toast.success("Vendor approved");
      invalidateLists();
    },
    onError: () => toast.error("Could not approve vendor"),
  });

  const approveRider = useMutation({
    mutationFn: (riderId: string) => updateAdminRider(riderId, { isActive: true }),
    onSuccess: () => {
      toast.success("Rider approved");
      invalidateLists();
    },
    onError: () => toast.error("Could not approve rider"),
  });

  return { blockUser, verifyVendor, approveRider };
}
