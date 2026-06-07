import type { VerificationStatus } from "@/components/admin/admin-types";
import type { AdminUserRecord, AdminVendorRecord, AdminRiderRecord } from "@/types/admin-api";

type NameSource = {
  firstName?: string;
  lastName?: string;
};

type ProfileSource = {
  profile?: NameSource;
  user?: { profile?: NameSource } | null;
  userId?: {
    profile?: NameSource;
  };
};

export function formatAdminDate(iso: string | Date | undefined | null): string {
  if (!iso) return "—";
  const date = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function userStatus(isActive: boolean): "active" | "blocked" {
  return isActive ? "active" : "blocked";
}

export function vendorVerificationStatus(vendor: AdminVendorRecord | Pick<AdminVendorRecord, "verification">): VerificationStatus {
  if (vendor.verification?.isVerified) return "verified";
  const documents = vendor.verification?.documents ?? [];
  if (documents.some((doc) => doc.status === "rejected")) return "rejected";
  if (documents.length > 0) return "pending";
  return "unverified";
}

export function riderVerificationStatus(rider: Pick<AdminRiderRecord, "isActive">): VerificationStatus {
  return rider.isActive ? "verified" : "pending";
}

export function displayName(user: ProfileSource): string {
  const profile = user.profile ?? user.user?.profile ?? user.userId?.profile;
  const firstName = profile?.firstName?.trim();
  const lastName = profile?.lastName?.trim();
  const name = [firstName, lastName].filter(Boolean).join(" ");
  return name || "Unknown user";
}

export function userIdString(user: AdminUserRecord): string {
  return String(user._id);
}

export function entityIdString(entity: { _id: string | { toString(): string } }): string {
  return String(entity._id);
}

export function orderStatusBadgeVariant(
  status: string
): "success" | "danger" | "warning" | "neutral" {
  if (status === "delivered") return "success";
  if (status === "cancelled" || status === "failed") return "danger";
  if (status === "pending") return "warning";
  return "neutral";
}

export function orderVendorName(
  vendorId: string | { businessName?: string | null } | null | undefined
): string {
  if (vendorId != null && typeof vendorId === "object") {
    return vendorId.businessName?.trim() || "—";
  }
  if (vendorId) return String(vendorId);
  return "—";
}
