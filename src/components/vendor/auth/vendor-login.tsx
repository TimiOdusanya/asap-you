"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { LockIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { vendorLogin } from "@/services/vendor/vendor.api";
import { getApiErrorMessage, toastApiSuccessMessage } from "@/lib/toast-api";
import VendorAuthBg from "./vendor-auth-bg";

const inputWithIcon =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 text-sm sm:text-base";
const inputWithIconAndToggle =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 pr-11 text-sm sm:text-base";
const errorRing = "ring-1 ring-destructive/50 focus-visible:ring-destructive/50";
const iconClass =
  "pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted";

const VendorLogin = () => {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useMutation({
    mutationFn: () => vendorLogin(form.email, form.password),
    onSuccess: (res) => {
      toastApiSuccessMessage(res.message);
      setSession(res.data.token, res.data.user);
      router.push("/vendor/dashboard");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) loginMutation.mutate();
  };

  return (
    <VendorAuthBg>
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-surface-brand">
              Vendor Login
            </h2>
            <p className="text-sm text-content-neutral-muted mt-1">
              Welcome back! Sign in to your vendor account.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="vl-email" className="text-sm text-content-neutral-secondary">
                Email Address
              </Label>
              <div className="relative">
                <Mail className={iconClass} />
                <Input
                  id="vl-email"
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "vl-email-error" : undefined}
                  className={cn(inputWithIcon, errors.email && errorRing)}
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <FieldError message={errors.email} id="vl-email-error" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vl-pw" className="text-sm text-content-neutral-secondary">
                Password
              </Label>
              <div className="relative">
                <LockIcon className={iconClass} />
                <Input
                  id="vl-pw"
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "vl-pw-error" : undefined}
                  className={cn(inputWithIconAndToggle, errors.password && errorRing)}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-0.5 text-content-neutral-muted hover:text-content-neutral-secondary"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  aria-pressed={showPw}
                >
                  {showPw ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
              <FieldError message={errors.password} id="vl-pw-error" />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-surface-brand hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="flex justify-center pt-1">
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90 w-full max-w-[240px]"
              >
                {loginMutation.isPending ? (
                  <CircleNotchIcon className="size-5 animate-spin" aria-hidden />
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-content-neutral-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/vendor/signup" className="text-surface-brand font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </VendorAuthBg>
  );
};

export default VendorLogin;
