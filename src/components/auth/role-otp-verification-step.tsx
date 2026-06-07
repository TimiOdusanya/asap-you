"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomerOtpVerifyForm } from "@/components/auth/customer-otp-verify-form";
import { login, resendOtp, verifyOtp } from "@/services/auth/auth.api";
import type { AuthUser } from "@/services/auth/auth.types";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage, toastApiSuccessMessage } from "@/lib/toast-api";

interface RoleOtpVerificationStepProps {
  email: string;
  password?: string;
  title?: string;
  subtitle?: string;
  onVerified: () => void;
  layout?: "embedded" | "fullscreen";
}

export function RoleOtpVerificationStep({
  email,
  password,
  title = "Verify your email",
  subtitle = "We sent a 6-digit code to your inbox. Enter it below to continue.",
  onVerified,
  layout = "embedded",
}: RoleOtpVerificationStepProps) {
  const setSession = useAuthStore((s) => s.setSession);
  const [shakeTrigger, setShakeTrigger] = React.useState(0);
  const [resendCooldown, setResendCooldown] = React.useState(60);

  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  const establishSession = React.useCallback(
    async (verifiedUser?: AuthUser, verifiedToken?: string) => {
      if (verifiedToken && verifiedUser) {
        setSession(verifiedToken, verifiedUser);
        onVerified();
        return;
      }

      if (password) {
        const logged = await login({ email, password });
        setSession(logged.data.token, logged.data.user);
        onVerified();
        return;
      }

      throw new Error("Session could not be established. Please sign in again.");
    },
    [email, onVerified, password, setSession]
  );

  const verifyMutation = useMutation({
    mutationFn: (otpCode: string) => verifyOtp({ email, otpCode }),
    onSuccess: async (res) => {
      toastApiSuccessMessage(res.message);
      try {
        await establishSession(res.data?.user, res.data?.token ?? undefined);
      } catch (err) {
        toast.error(getApiErrorMessage(err));
      }
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
      setShakeTrigger((k) => k + 1);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => resendOtp({ email }),
    onSuccess: (res) => {
      toastApiSuccessMessage(res.message);
      setResendCooldown(60);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const form = (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full text-center">
        <h2 className="text-xl font-semibold text-surface-brand sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-content-neutral-secondary">{subtitle}</p>
        <p className="mt-1 text-sm font-medium text-content-neutral-primary">{email}</p>
      </div>
      <div className="flex w-full justify-center">
        <CustomerOtpVerifyForm
          email={email}
          showHeader={false}
          onVerify={(otpCode) => verifyMutation.mutate(otpCode)}
          onResend={() => resendMutation.mutate()}
          isVerifying={verifyMutation.isPending}
          isResending={resendMutation.isPending}
          shakeTrigger={shakeTrigger}
          resendCooldownSeconds={resendCooldown}
        />
      </div>
    </div>
  );

  if (layout === "fullscreen") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 via-white to-white px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-green-100 bg-white p-6 shadow-xl sm:p-10">
          {form}
        </div>
      </div>
    );
  }

  return form;
}
