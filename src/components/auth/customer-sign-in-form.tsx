"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotchIcon, Lock } from "@phosphor-icons/react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { AppleLogoMark } from "@/components/icons/apple-logo";
import { GoogleGLogo } from "@/components/icons/google-g-logo";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FieldError } from "@/components/auth/field-error";
import {
  authBrandBg,
  authBrandStyle,
} from "@/components/auth/auth-modal-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  signInSchema,
  type SignInFormValues,
} from "@/lib/validation/auth-schemas";


export function CustomerSignInForm({
  onSubmit,
  onSwitchToSignUp,
  isPending,
}: {
  onSubmit: (values: SignInFormValues) => void;
  onSwitchToSignUp: () => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-0 w-full flex-1 flex-col justify-center gap-4 p-6"
    >
      <div>
        <h3
          className="text-center text-xl font-semibold sm:text-3xl"
          style={authBrandStyle}
        >
          Sign in to Asap You
        </h3>
      </div>

      <div className="flex justify-center gap-5">
        <button
          type="button"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-icon bg-white"
          aria-label="Email"
        >
          <Mail className="size-4 text-content-neutral-secondary" />
        </button>
        <button
          type="button"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-icon bg-white"
          aria-label="Google"
        >
          <GoogleGLogo />
        </button>
        <button
          type="button"
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border-icon bg-white"
          aria-label="Apple"
        >
          <AppleLogoMark />
        </button>
      </div>
      <p className="mt-2 text-center text-sm text-gray-150">
        or continue with your email
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signin-email" className="text-gray-500">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted" />
            <Input
              id="signin-email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "signin-email-error" : undefined}
              placeholder="Email address"
              className={cn(
                "h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11",
                errors.email &&
                  "ring-1 ring-destructive/50 focus-visible:ring-destructive/50",
              )}
              {...register("email")}
            />
          </div>
          <FieldError message={errors.email?.message} id="signin-email-error" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signin-password" className="text-gray-500">
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted" />
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? "signin-password-error" : undefined
              }
              placeholder="Password"
              className={cn(
                "h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 pr-11",
                errors.password &&
                  "ring-1 ring-destructive/50 focus-visible:ring-destructive/50",
              )}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-0.5 text-content-neutral-muted outline-none transition-colors hover:text-content-neutral-secondary focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-gray-100" aria-hidden />
              ) : (
                <Eye className="size-4 text-gray-100" aria-hidden />
              )}
            </button>
          </div>
          <FieldError
            message={errors.password?.message}
            id="signin-password-error"
          />
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="cursor-pointer text-sm text-content-accent-coral hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Forgot Password?
        </Link>
      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-[104px] max-w-[200px] rounded-full text-content-on-brand"
          style={authBrandBg}
        >
          {isPending ? (
            <CircleNotchIcon className="size-5 animate-spin" aria-hidden />
          ) : (
            "Sign in"
          )}
        </Button>
        <p className="text-center text-sm text-content-neutral-secondary">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="cursor-pointer font-medium"
            style={authBrandStyle}
            onClick={onSwitchToSignUp}
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
}
