"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { AuthGateSkeleton } from "@/components/auth/auth-gate-skeleton";
import {
  fetchRiderProfile,
  riderProfileQueryKey,
} from "@/services/rider/rider-deliveries.api";
import { PendingApprovalScreen } from "@/components/auth/pending-approval-screen";

interface RiderEntityRef {
  isActive?: boolean;
}

function isRiderApproved(rider: RiderEntityRef | undefined): boolean {
  return rider?.isActive === true;
}

export function RiderApprovalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const clearSession = useAuthStore((s) => s.clearSession);

  React.useEffect(() => {
    if (!hydrated) return;
    const ok = Boolean(token) && role === "rider";
    if (!ok) router.replace("/rider/login");
  }, [hydrated, token, role, router]);

  const { data, isPending } = useQuery({
    queryKey: riderProfileQueryKey,
    queryFn: fetchRiderProfile,
    enabled: hydrated && Boolean(token) && role === "rider",
  });

  const handleLogout = React.useCallback(() => {
    clearSession();
    router.push("/rider/login");
  }, [clearSession, router]);

  if (!hydrated) {
    return <AuthGateSkeleton label="Loading rider session" />;
  }

  if (!token || role !== "rider") {
    return null;
  }

  if (isPending) {
    return <AuthGateSkeleton label="Checking approval status" />;
  }

  if (!isRiderApproved(data?.data)) {
    return <PendingApprovalScreen role="rider" onLogout={handleLogout} />;
  }

  return <>{children}</>;
}
