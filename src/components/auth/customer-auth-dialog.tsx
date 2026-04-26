"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AuthModalShell } from "@/components/auth/auth-modal-shell";
import { CustomerSignInForm } from "@/components/auth/customer-sign-in-form";
import { CustomerSignUpForm } from "@/components/auth/customer-sign-up-form";
import { CustomerOtpVerifyForm } from "@/components/auth/customer-otp-verify-form";
import { CustomerLocationForm } from "@/components/auth/customer-location-form";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { login, register, resendOtp, verifyOtp } from "@/services/auth/auth.api";
import type { RegisterRequestBody } from "@/services/auth/auth.types";
import type {
  SignInFormValues,
  SignUpFormValues,
} from "@/lib/validation/auth-schemas";
import {
  getApiErrorMessage,
  toastApiSuccessMessage,
} from "@/lib/toast-api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CustomerAuthDialog() {
  const router = useRouter();
  const {
    open,
    view,
    verifyOtpEmail,
    close,
    openSignUp,
    openSignIn,
    openVerifyOtp,
    openLocation,
  } = useCustomerAuthUiStore();
  const setSession = useAuthStore((s) => s.setSession);

  const pendingAfterRegisterRef = useRef<{
    email: string;
    password: string;
  } | null>(null);
  const [otpShakeTrigger, setOtpShakeTrigger] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => login(body),
    onSuccess: (res, variables) => {
      toastApiSuccessMessage(res.message);
      const needsOtp = res.data.otpVerified === false;
      setSession(res.data.token, res.data.user);
      if (needsOtp) {
        pendingAfterRegisterRef.current = {
          email: variables.email,
          password: variables.password,
        };
        openVerifyOtp(variables.email);
        setResendCooldown(60);
        return;
      }
      close();
      router.push("/store");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (body: RegisterRequestBody) => register(body),
    onSuccess: (reg, variables) => {
      toastApiSuccessMessage(reg.message);
      pendingAfterRegisterRef.current = {
        email: variables.email,
        password: variables.password,
      };
      openVerifyOtp(variables.email);
      setResendCooldown(60);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (body: { email: string; otpCode: string }) => verifyOtp(body),
    onSuccess: async (res) => {
      toastApiSuccessMessage(res.message);
      const pending = pendingAfterRegisterRef.current;
      const payload = res.data;

      if (payload?.token && payload?.user) {
        setSession(payload.token, payload.user);
        pendingAfterRegisterRef.current = null;
        router.push("/store");
        openLocation();
        return;
      }

      if (pending) {
        try {
          const logged = await login({
            email: pending.email,
            password: pending.password,
          });
          setSession(logged.data.token, logged.data.user);
          pendingAfterRegisterRef.current = null;
          router.push("/store");
          openLocation();
        } catch (e) {
          toast.error(getApiErrorMessage(e));
          pendingAfterRegisterRef.current = null;
          openSignIn();
        }
        return;
      }

      toast.error("Session could not be established. Please sign in.");
      openSignIn();
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
      setOtpShakeTrigger((k) => k + 1);
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: (email: string) => resendOtp({ email }),
    onSuccess: (r) => {
      toastApiSuccessMessage(r.message);
      setResendCooldown(60);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const onSignInSubmit = (values: SignInFormValues) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  const onSignUpSubmit = (values: SignUpFormValues) => {
    const body: RegisterRequestBody = {
      email: values.email,
      password: values.password,
      password_confirmation: values.passwordConfirmation,
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
    };
    registerMutation.mutate(body);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next && view === "verifyOtp") {
      return;
    }
    if (!next) {
      pendingAfterRegisterRef.current = null;
      close();
    }
  };

  const blockOtpDismiss =
    view === "verifyOtp"
      ? {
          onPointerDownOutside: (e: Event) => e.preventDefault(),
          onEscapeKeyDown: (e: Event) => e.preventDefault(),
        }
      : {};

  const leftCopy =
    view === "signIn"
      ? {
          title: "Don't have an account?",
          subtitle:
            "Sign up to Asap You for fresh and fast delivery.",
        }
      : view === "signUp"
        ? {
            title: "Welcome to Asap You",
            subtitle: "Your one-stop shop for fresh and fast delivery.",
          }
        : view === "verifyOtp"
          ? {
              title: "Almost there",
              subtitle:
                "Check your inbox for the verification code we sent you.",
            }
          : {
              title: "Set Your Delivery Location",
              subtitle:
                "Let’s get you started with nearby options and real-time availability.",
            };

  const leftFooter =
    view === "signIn" ? (
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-white/70 bg-transparent px-6 text-white hover:bg-white/10"
        onClick={openSignUp}
      >
        Sign up
      </Button>
    ) : view === "signUp" ? (
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-white/70 bg-transparent px-6 text-white hover:bg-white/10"
        onClick={openSignIn}
      >
        Sign in
      </Button>
    ) : null;


  const dialogTitle =
    view === "location"
      ? "Delivery location"
      : view === "verifyOtp"
        ? "Verify email"
        : "Account";

  const otpEmail = verifyOtpEmail ?? "";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showClose={false}
        className="flex w-fit max-w-full flex-col overflow-visible border-0 bg-transparent p-0 shadow-none"
        {...blockOtpDismiss}
      >
        <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
        <AuthModalShell
          className={
            view === "verifyOtp"
              ? "md:w-[min(96vw,1040px)]"
              : undefined
          }
          promoPosition={view === "signIn" ? "end" : "start"}
          leftTitle={leftCopy.title}
          leftSubtitle={leftCopy.subtitle}
          leftFooter={leftFooter}

          showCloseButton={view !== "verifyOtp"}
        >
          {view === "signIn" ? (
            <div className="flex min-h-0 w-full flex-1 flex-col justify-center">
              <CustomerSignInForm
                onSubmit={onSignInSubmit}
                onSwitchToSignUp={openSignUp}
                isPending={loginMutation.isPending}
              />
            </div>
          ) : null}
          {view === "signUp" ? (
            <div className="flex min-h-0 w-full flex-1 flex-col justify-center">
              <CustomerSignUpForm
                onSubmit={onSignUpSubmit}
                onSwitchToSignIn={openSignIn}
                isPending={registerMutation.isPending}
              />
            </div>
          ) : null}
          {view === "verifyOtp" && otpEmail ? (
            <div className="flex min-h-0 w-full flex-1 flex-col justify-center">
              <CustomerOtpVerifyForm
                email={otpEmail}
                onVerify={(otpCode) =>
                  verifyOtpMutation.mutate({
                    email: otpEmail,
                    otpCode,
                  })
                }
                onResend={() => resendOtpMutation.mutate(otpEmail)}
                isVerifying={verifyOtpMutation.isPending}
                isResending={resendOtpMutation.isPending}
                shakeTrigger={otpShakeTrigger}
                resendCooldownSeconds={resendCooldown}
              />
            </div>
          ) : null}
          {view === "location" ? (
            <CustomerLocationForm
              onDone={() => {
                close();
                router.push("/store");
              }}
            />
          ) : null}
        </AuthModalShell>
      </DialogContent>
    </Dialog>
  );
}
