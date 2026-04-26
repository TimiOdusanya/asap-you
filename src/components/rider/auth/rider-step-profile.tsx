"use client";

import React, { useRef, useState } from "react";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import RiderStepIndicator from "./rider-step-indicator";

export interface RiderProfileData {
  vehicleType: string;
  license: File | null;
  photo: File | null;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  accountHolderName: string;
}

interface Props {
  onNext: (data: RiderProfileData) => void;
  onBack: () => void;
}

const iCls = "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] px-4 text-sm sm:text-base";
const eRing = "ring-1 ring-destructive/50";

function DropZone({ label, id, accept, hint, file, hasError, onChange }: {
  label: string; id: string; accept: string; hint: string;
  file: File | null; hasError?: boolean; onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-content-neutral-secondary">{label}</Label>
      <button type="button" onClick={() => ref.current?.click()}
        className={cn("w-full h-20 border border-dashed rounded-[10px] bg-[var(--surface-subtle)] flex flex-col items-center justify-center gap-1.5 hover:bg-surface-muted cursor-pointer transition-colors",
          hasError ? "border-destructive/50" : "border-border-muted")}>
        <DownloadSimpleIcon className="size-5 text-content-neutral-muted" />
        <span className="text-xs text-content-neutral-muted px-2 text-center truncate max-w-full">
          {file ? file.name : hint}
        </span>
      </button>
      <input ref={ref} id={id} type="file" accept={accept} className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </div>
  );
}

const RiderStepProfile = ({ onNext, onBack }: Props) => {
  const [form, setForm] = useState<RiderProfileData>({
    vehicleType: "", license: null, photo: null,
    accountNumber: "", bankName: "", bankCode: "", accountHolderName: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RiderProfileData, string>>>({});
  const set = <K extends keyof RiderProfileData>(k: K, v: RiderProfileData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.vehicleType) e.vehicleType = "Select a vehicle type";
    if (!form.license) e.license = "Upload your licence";
    if (!form.photo) e.photo = "Upload a profile photo";
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
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-4">
      <div className="flex justify-end">
        <p className="text-sm text-content-neutral-muted">
          Already a rider?{" "}
          <a href="/rider/login" className="text-surface-brand font-medium hover:underline">Login</a>
        </p>
      </div>
      <h2 className="text-center text-2xl font-semibold text-surface-brand">Sign up</h2>
      <RiderStepIndicator currentStep={2} />
      <p className="text-sm font-medium text-content-neutral-secondary">Profile Setup</p>

      <div className="space-y-1.5">
        <Label className="text-sm text-content-neutral-secondary">Vehicle Type</Label>
        <Select value={form.vehicleType} onValueChange={(v) => set("vehicleType", v)}>
          <SelectTrigger className={cn("h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] text-sm sm:text-base", errors.vehicleType && eRing)}>
            <SelectValue placeholder="Select vehicle type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="motorcycle">Motorcycle</SelectItem>
            <SelectItem value="bicycle">Bicycle</SelectItem>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="van">Van</SelectItem>
          </SelectContent>
        </Select>
        <FieldError message={errors.vehicleType} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <DropZone label="Upload Documents" id="rp-license" accept=".pdf,image/*" hint="Upload Documents"
            file={form.license} hasError={!!errors.license} onChange={(f) => set("license", f)} />
          <FieldError message={errors.license} />
        </div>
        <div>
          <DropZone label="Upload Profile Photo" id="rp-photo" accept="image/*" hint="Upload Profile photo"
            file={form.photo} hasError={!!errors.photo} onChange={(f) => set("photo", f)} />
          <FieldError message={errors.photo} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-content-neutral-secondary">Account Number</Label>
          <Input placeholder="Account Number" className={cn(iCls, errors.accountNumber && eRing)}
            value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
          <FieldError message={errors.accountNumber} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-content-neutral-secondary">Bank Name</Label>
          <Input placeholder="Bank Name" className={cn(iCls, errors.bankName && eRing)}
            value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
          <FieldError message={errors.bankName} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm text-content-neutral-secondary">Account Holder Name</Label>
        <Input placeholder="Account Holder Name" className={cn(iCls, errors.accountHolderName && eRing)}
          value={form.accountHolderName} onChange={(e) => set("accountHolderName", e.target.value)} />
        <FieldError message={errors.accountHolderName} />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} className="text-content-neutral-muted">Back</Button>
        <Button type="submit" className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90">Continue</Button>
      </div>
    </form>
  );
};

export default RiderStepProfile;
