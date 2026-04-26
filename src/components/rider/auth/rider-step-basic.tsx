"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { LockIcon, UserIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { cn } from "@/lib/utils";
import Link from "next/link";
import RiderStepIndicator from "./rider-step-indicator";

export interface RiderBasicData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface Props {
  defaultValues?: Partial<RiderBasicData>;
  onNext: (data: RiderBasicData) => void;
}

const iCls = "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 text-sm sm:text-base";
const iToggle = "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] pl-11 pr-11 text-sm sm:text-base";
const eRing = "ring-1 ring-destructive/50 focus-visible:ring-destructive/50";
const iconCls = "pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted";

const RiderStepBasic = ({ defaultValues = {}, onNext }: Props) => {
  const [form, setForm] = useState<RiderBasicData>({
    firstName: defaultValues.firstName ?? "",
    lastName: defaultValues.lastName ?? "",
    email: defaultValues.email ?? "",
    phone: defaultValues.phone ?? "",
    password: defaultValues.password ?? "",
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RiderBasicData, string>>>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.password || form.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-5">
      <div className="flex justify-end">
        <p className="text-sm text-content-neutral-muted">
          Already a rider?{" "}
          <Link href="/rider/login" className="text-surface-brand font-medium hover:underline">Login</Link>
        </p>
      </div>
      <h2 className="text-center text-2xl font-semibold text-surface-brand">Sign up</h2>
      <RiderStepIndicator currentStep={1} />
      <p className="text-sm font-medium text-content-neutral-secondary">Basic Details</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["firstName", "lastName"] as const).map((field) => (
          <div key={field} className="space-y-1.5">
            <Label htmlFor={`rs-${field}`} className="text-sm text-content-neutral-secondary">
              {field === "firstName" ? "First Name" : "Last Name"}
            </Label>
            <div className="relative">
              <UserIcon className={iconCls} />
              <Input id={`rs-${field}`} placeholder={field === "firstName" ? "First Name" : "Last Name"}
                className={cn(iCls, errors[field] && eRing)}
                value={form[field]}
                onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
              />
            </div>
            <FieldError message={errors[field]} />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rs-email" className="text-sm text-content-neutral-secondary">Email Address</Label>
        <div className="relative">
          <Mail className={iconCls} />
          <Input id="rs-email" type="email" placeholder="Email address" autoComplete="email"
            className={cn(iCls, errors.email && eRing)}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>
        <FieldError message={errors.email} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rs-phone" className="text-sm text-content-neutral-secondary">Phone Number</Label>
        <div className="relative">
          <Phone className={iconCls} />
          <Input id="rs-phone" type="tel" placeholder="Phone number" autoComplete="tel"
            className={cn(iCls, errors.phone && eRing)}
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <FieldError message={errors.phone} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rs-pw" className="text-sm text-content-neutral-secondary">Password</Label>
        <div className="relative">
          <LockIcon className={iconCls} />
          <Input id="rs-pw" type={showPw ? "text" : "password"} placeholder="Password" autoComplete="new-password"
            className={cn(iToggle, errors.password && eRing)}
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <button type="button" onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-content-neutral-muted hover:text-content-neutral-secondary"
            aria-label={showPw ? "Hide" : "Show"}>
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <FieldError message={errors.password} />
      </div>

      <div className="flex justify-center pt-2">
        <Button type="submit" className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90">Continue</Button>
      </div>
    </form>
  );
};

export default RiderStepBasic;
