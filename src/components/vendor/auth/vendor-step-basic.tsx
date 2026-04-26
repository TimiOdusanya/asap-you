"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { LockIcon, UserIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { cn } from "@/lib/utils";
import Link from "next/link";
import VendorStepIndicator from "./vendor-step-indicator";

export interface BasicDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface VendorStepBasicProps {
  defaultValues?: Partial<BasicDetailsData>;
  onNext: (data: BasicDetailsData) => void;
}

const inputWithIcon =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 text-sm sm:text-base";
const inputWithIconAndToggle =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 pr-11 text-sm sm:text-base";
const errorRing = "ring-1 ring-destructive/50 focus-visible:ring-destructive/50";
const iconClass =
  "pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted";

const VendorStepBasic = ({ defaultValues = {}, onNext }: VendorStepBasicProps) => {
  const [form, setForm] = useState<BasicDetailsData>({
    firstName: defaultValues.firstName ?? "",
    lastName: defaultValues.lastName ?? "",
    email: defaultValues.email ?? "",
    password: defaultValues.password ?? "",
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BasicDetailsData, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex justify-end">
        <p className="text-sm text-content-neutral-muted">
          Already a vendor?{" "}
          <Link href="/vendor/login" className="text-surface-brand font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>

      <h2 className="text-center text-2xl font-semibold text-surface-brand">
        Sign up
      </h2>

      <VendorStepIndicator currentStep={1} />

      <p className="text-sm font-medium text-content-neutral-secondary">Basic Details</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vs-fn" className="text-sm text-content-neutral-secondary">First Name</Label>
          <div className="relative">
            <UserIcon className={iconClass} />
            <Input
              id="vs-fn"
              placeholder="First Name"
              autoComplete="given-name"
              className={cn(inputWithIcon, errors.firstName && errorRing)}
              value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
            />
          </div>
          <FieldError message={errors.firstName} id="vs-fn-error" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vs-ln" className="text-sm text-content-neutral-secondary">Last Name</Label>
          <div className="relative">
            <UserIcon className={iconClass} />
            <Input
              id="vs-ln"
              placeholder="Last Name"
              autoComplete="family-name"
              className={cn(inputWithIcon, errors.lastName && errorRing)}
              value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
            />
          </div>
          <FieldError message={errors.lastName} id="vs-ln-error" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="vs-email" className="text-sm text-content-neutral-secondary">Email Address</Label>
        <div className="relative">
          <Mail className={iconClass} />
          <Input
            id="vs-email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className={cn(inputWithIcon, errors.email && errorRing)}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>
        <FieldError message={errors.email} id="vs-email-error" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="vs-pw" className="text-sm text-content-neutral-secondary">Password</Label>
        <div className="relative">
          <LockIcon className={iconClass} />
          <Input
            id="vs-pw"
            type={showPw ? "text" : "password"}
            placeholder="Password"
            autoComplete="new-password"
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
        <FieldError message={errors.password} id="vs-pw-error" />
      </div>

      <div className="flex justify-center pt-2">
        <Button type="submit" className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default VendorStepBasic;
