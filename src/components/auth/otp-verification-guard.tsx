"use client";

import * as React from "react";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { isOtpVerified } from "@/lib/auth-otp";
import { RoleOtpVerificationStep } from "@/components/auth/role-otp-verification-step";

export function OtpVerificationGuard({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const [verified, setVerified] = React.useState(false);

  if (!hydrated || !user) {
    return <>{children}</>;
  }

  if (verified || isOtpVerified(user)) {
    return <>{children}</>;
  }

  return (
    <RoleOtpVerificationStep
      email={user.email}
      layout="fullscreen"
      title="Verify your email first"
      subtitle="Enter the verification code we sent to your email before accessing your account."
      onVerified={() => setVerified(true)}
    />
  );
}
