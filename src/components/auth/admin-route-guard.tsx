"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { AuthGateSkeleton } from "@/components/auth/auth-gate-skeleton";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);

  React.useEffect(() => {
    if (!hydrated) return;
    const ok = Boolean(token) && role === "admin";
    if (!ok) router.replace("/admin/login");
  }, [hydrated, token, role, router]);

  if (!hydrated) {
    return <AuthGateSkeleton label="Loading admin session" />;
  }

  if (!token || role !== "admin") return null;
  return <>{children}</>;
}

