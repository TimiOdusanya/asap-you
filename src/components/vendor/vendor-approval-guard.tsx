"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { AuthGateSkeleton } from "@/components/auth/auth-gate-skeleton";
import {
  fetchVendorSettings,
  vendorSettingsQueryKey,
} from "@/services/vendor/vendor-settings.api";
import { PendingApprovalScreen } from "@/components/auth/pending-approval-screen";

interface VendorSettingsVerificationRef {
  verification?: {
    isVerified?: boolean;
  };
}

function isVendorVerified(settings: VendorSettingsVerificationRef | undefined): boolean {
  return settings?.verification?.isVerified === true;
}

export function VendorApprovalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const clearSession = useAuthStore((s) => s.clearSession);

  React.useEffect(() => {
    if (!hydrated) return;
    const ok = Boolean(token) && role === "vendor";
    if (!ok) router.replace("/vendor/login");
  }, [hydrated, token, role, router]);

  const { data, isPending } = useQuery({
    queryKey: vendorSettingsQueryKey,
    queryFn: fetchVendorSettings,
    enabled: hydrated && Boolean(token) && role === "vendor",
  });

  const handleLogout = React.useCallback(() => {
    clearSession();
    router.push("/vendor/login");
  }, [clearSession, router]);

  if (!hydrated) {
    return <AuthGateSkeleton label="Loading vendor session" />;
  }

  if (!token || role !== "vendor") {
    return null;
  }

  if (isPending) {
    return <AuthGateSkeleton label="Checking approval status" />;
  }

  if (!isVendorVerified(data?.data)) {
    return <PendingApprovalScreen role="vendor" onLogout={handleLogout} />;
  }

  return <>{children}</>;
}
