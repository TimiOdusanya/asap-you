"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotchIcon, Lock, PhoneIcon } from "@phosphor-icons/react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { AppleLogoMark } from "@/components/icons/apple-logo";
import { GoogleGLogo } from "@/components/icons/google-g-logo";
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
  signUpSchema,
  type SignUpFormValues,
} from "@/lib/validation/auth-schemas";

const inputFieldClass =
  "h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11";
const inputPasswordFieldClass = `${inputFieldClass} pr-11`;
const inputFieldClassPlain =
  "h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] px-4";
const errorRingClass =
  "ring-1 ring-destructive/50 focus-visible:ring-destructive/50";

export function CustomerSignUpForm({
  onSubmit,
  onSwitchToSignIn,
  isPending,
}: {
  onSubmit: (values: SignUpFormValues) => void;
  onSwitchToSignIn: () => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

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
          Create an Account
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


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="su-fn" className="text-gray-500">
            First name
          </Label>
          <Input
            id="su-fn"
            autoComplete="given-name"
            aria-invalid={errors.firstName ? true : undefined}
            aria-describedby={errors.firstName ? "su-fn-error" : undefined}
            placeholder="First name"
            className={cn(
              inputFieldClassPlain,
              errors.firstName && errorRingClass,
            )}
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} id="su-fn-error" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="su-ln" className="text-gray-500">
            Last name
          </Label>
          <Input
            id="su-ln"
            autoComplete="family-name"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={errors.lastName ? "su-ln-error" : undefined}
            placeholder="Last name"
            className={cn(
              inputFieldClassPlain,
              errors.lastName && errorRingClass,
            )}
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} id="su-ln-error" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="su-email" className="text-gray-500">
          Email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted" />
          <Input
            id="su-email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "su-email-error" : undefined}
            placeholder="Email address"
            className={cn(inputFieldClass, errors.email && errorRingClass)}
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} id="su-email-error" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="su-phone" className="text-gray-500">
          Phone number
        </Label>
        <div className="relative">
          <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted" />
          <Input
            id="su-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "su-phone-error" : undefined}
            placeholder="Phone number"
            className={cn(inputFieldClass, errors.phone && errorRingClass)}
            {...register("phone")}
          />
        </div>
        <FieldError message={errors.phone?.message} id="su-phone-error" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="su-pw" className="text-gray-500">
          Password
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted" />
          <Input
            id="su-pw"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "su-pw-error" : undefined}
            placeholder="Password"
            className={cn(
              inputPasswordFieldClass,
              errors.password && errorRingClass,
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
        <FieldError message={errors.password?.message} id="su-pw-error" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="su-pw2" className="text-gray-500">
          Confirm password
        </Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted" />
          <Input
            id="su-pw2"
            type={showPasswordConfirmation ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={errors.passwordConfirmation ? true : undefined}
            aria-describedby={
              errors.passwordConfirmation ? "su-pw2-error" : undefined
            }
            placeholder="Confirm password"
            className={cn(
              inputPasswordFieldClass,
              errors.passwordConfirmation && errorRingClass,
            )}
            {...register("passwordConfirmation")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-0.5 text-content-neutral-muted outline-none transition-colors hover:text-content-neutral-secondary focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setShowPasswordConfirmation((v) => !v)}
            aria-label={
              showPasswordConfirmation
                ? "Hide confirm password"
                : "Show confirm password"
            }
            aria-pressed={showPasswordConfirmation}
          >
            {showPasswordConfirmation ? (
              <EyeOff className="size-4 text-gray-100" aria-hidden />
            ) : (
              <Eye className="size-4 text-gray-100" aria-hidden />
            )}
          </button>
        </div>
        <FieldError
          message={errors.passwordConfirmation?.message}
          id="su-pw2-error"
        />
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
            "Sign up"
          )}
        </Button>
        <p className="text-center text-sm text-content-neutral-secondary">
          Already have an account?{" "}
          <button
            type="button"
            className="cursor-pointer font-medium"
            style={authBrandStyle}
            onClick={onSwitchToSignIn}
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
}
