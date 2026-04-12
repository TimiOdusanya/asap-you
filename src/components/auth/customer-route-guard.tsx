"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";

export function CustomerRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);

  React.useEffect(() => {
    if (!hydrated) return;
    const ok = Boolean(token) && role === "customer";
    if (!ok) {
      router.replace("/");
      openSignIn();
    }
  }, [hydrated, token, role, router, openSignIn]);

  if (!hydrated) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center text-content-neutral-secondary"
        aria-busy="true"
        aria-live="polite"
      >
        Loading…
      </div>
    );
  }

  if (!token || role !== "customer") {
    return null;
  }

  return <>{children}</>;
}
