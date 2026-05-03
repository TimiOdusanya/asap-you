"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { LockIcon, CircleNotchIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { login } from "@/services/auth/auth.api";
import { getApiErrorMessage, toastApiSuccessMessage } from "@/lib/toast-api";
import { postLoginPathForRole } from "@/lib/auth-redirect";

const inputWithIcon =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 text-sm sm:text-base";
const inputWithIconAndToggle =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 pr-11 text-sm sm:text-base";
const errorRing = "ring-1 ring-destructive/50 focus-visible:ring-destructive/50";
const iconClass =
  "pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted";

export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const loginMutation = useMutation({
    mutationFn: () => login({ email: form.email, password: form.password }),
    onSuccess: (res) => {
      toastApiSuccessMessage(res.message);
      setSession(res.data.token, res.data.user);
      const role = res.data.user.role;
      if (role !== "admin") {
        toast.error("This account is not an admin.");
        return;
      }
      router.push(postLoginPathForRole(role));
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
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
    <div className="min-h-screen bg-surface-subtle">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-border-muted bg-white shadow-lg lg:grid-cols-2">
          <div className="hidden flex-col justify-between bg-surface-forest p-8 text-white lg:flex">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheckIcon className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold">ASAP You</p>
                <p className="text-xs text-white/70">Admin Console</p>
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold leading-tight">
                Keep the marketplace healthy.
              </h1>
              <p className="text-sm text-white/75">
                Manage users, verify riders, moderate vendors, and monitor orders
                — all in one place.
              </p>
            </div>
            <p className="text-xs text-white/60">
              Tip: use strong passwords and enable 2FA once we add it.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-semibold text-surface-brand">
                Admin Login
              </h2>
              <p className="mt-1 text-sm text-content-neutral-muted">
                Sign in to access the admin console.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="al-email" className="text-sm text-content-neutral-secondary">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className={iconClass} />
                  <Input
                    id="al-email"
                    type="email"
                    placeholder="Email address"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "al-email-error" : undefined}
                    className={cn(inputWithIcon, errors.email && errorRing)}
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <FieldError message={errors.email} id="al-email-error" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="al-pw" className="text-sm text-content-neutral-secondary">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className={iconClass} />
                  <Input
                    id="al-pw"
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "al-pw-error" : undefined}
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
                    {showPw ? (
                      <EyeOff className="size-4" aria-hidden />
                    ) : (
                      <Eye className="size-4" aria-hidden />
                    )}
                  </button>
                </div>
                <FieldError message={errors.password} id="al-pw-error" />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full rounded-full bg-surface-brand hover:bg-surface-brand/90"
                >
                  {loginMutation.isPending ? (
                    <CircleNotchIcon className="size-5 animate-spin" aria-hidden />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
              <p className="text-center text-xs text-content-neutral-muted lg:text-left">
                Not an admin? Use the shopper, vendor, or rider portal instead.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

