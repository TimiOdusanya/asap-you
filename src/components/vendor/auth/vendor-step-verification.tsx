"use client";

import React, { useRef, useState } from "react";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { cn } from "@/lib/utils";
import VendorStepIndicator from "./vendor-step-indicator";

export interface VerificationData {
  logo: File | null;
  registrationCertificate: File | null;
  businessSize: string;
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
}

interface VendorStepVerificationProps {
  onNext: (data: VerificationData) => void;
  onBack: () => void;
}

const inputCls =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] px-4 text-sm sm:text-base";
const errorRing = "ring-1 ring-destructive/50 focus-visible:ring-destructive/50";

function FileDropZone({
  label,
  id,
  accept,
  hint,
  file,
  hasError,
  onChange,
}: {
  label: string;
  id: string;
  accept: string;
  hint: string;
  file: File | null;
  hasError?: boolean;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm text-content-neutral-secondary">{label}</Label>
      <button
        type="button"
        id={id}
        onClick={() => ref.current?.click()}
        className={cn(
          "w-full h-24 border border-dashed rounded-[10px] bg-[var(--surface-subtle)] flex flex-col items-center justify-center gap-1.5 hover:bg-surface-muted transition-colors cursor-pointer",
          hasError ? "border-destructive/50" : "border-border-muted"
        )}
      >
        <DownloadSimpleIcon className="size-5 text-content-neutral-muted" />
        <span className="text-xs text-content-neutral-muted px-2 text-center truncate max-w-full">
          {file ? file.name : hint}
        </span>
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </div>
  );
}

const VendorStepVerification = ({ onNext, onBack }: VendorStepVerificationProps) => {
  const [form, setForm] = useState<VerificationData>({
    logo: null,
    registrationCertificate: null,
    businessSize: "",
    accountNumber: "",
    bankName: "",
    accountHolderName: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof VerificationData, string>>>({});

  const set = <K extends keyof VerificationData>(key: K, val: VerificationData[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.logo) e.logo = "Business logo is required";
    if (!form.businessSize.trim()) e.businessSize = "Required";
    if (!form.accountNumber.trim()) e.accountNumber = "Required";
    if (!form.bankName.trim()) e.bankName = "Required";
    if (!form.accountHolderName.trim()) e.accountHolderName = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h2 className="text-center text-2xl font-semibold text-surface-brand">
        Sign up
      </h2>
      <VendorStepIndicator currentStep={3} />
      <p className="text-sm font-medium text-content-neutral-secondary">Business Setup</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FileDropZone
            label="Business Logo"
            id="vv-logo"
            accept="image/*"
            hint="Upload Logo"
            file={form.logo}
            hasError={!!errors.logo}
            onChange={(f) => set("logo", f)}
          />
          <FieldError message={errors.logo} id="vv-logo-error" />
        </div>
        <FileDropZone
          label="Business Registration Certificate"
          id="vv-cert"
          accept=".pdf,image/*"
          hint="Upload Certificate"
          file={form.registrationCertificate}
          onChange={(f) => set("registrationCertificate", f)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vv-size" className="text-sm text-content-neutral-secondary">Business Size</Label>
          <Input
            id="vv-size"
            placeholder="e.g. Small, Medium, Large"
            className={cn(inputCls, errors.businessSize && errorRing)}
            value={form.businessSize}
            onChange={(e) => set("businessSize", e.target.value)}
          />
          <FieldError message={errors.businessSize} id="vv-size-error" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vv-acct" className="text-sm text-content-neutral-secondary">Account Number</Label>
          <Input
            id="vv-acct"
            placeholder="Account Number"
            className={cn(inputCls, errors.accountNumber && errorRing)}
            value={form.accountNumber}
            onChange={(e) => set("accountNumber", e.target.value)}
          />
          <FieldError message={errors.accountNumber} id="vv-acct-error" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vv-bank" className="text-sm text-content-neutral-secondary">Bank Name</Label>
          <Input
            id="vv-bank"
            placeholder="Bank Name"
            className={cn(inputCls, errors.bankName && errorRing)}
            value={form.bankName}
            onChange={(e) => set("bankName", e.target.value)}
          />
          <FieldError message={errors.bankName} id="vv-bank-error" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vv-holder" className="text-sm text-content-neutral-secondary">Account Holder Name</Label>
          <Input
            id="vv-holder"
            placeholder="Account Holder Name"
            className={cn(inputCls, errors.accountHolderName && errorRing)}
            value={form.accountHolderName}
            onChange={(e) => set("accountHolderName", e.target.value)}
          />
          <FieldError message={errors.accountHolderName} id="vv-holder-error" />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} className="text-content-neutral-muted">
          Back
        </Button>
        <Button type="submit" className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default VendorStepVerification;
