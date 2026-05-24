"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WarningCircle } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchVendorSettings,
  updateVendorSettings,
  vendorSettingsQueryKey,
} from "@/services/vendor/vendor-settings.api";
import { fetchVendorCategories } from "@/services/store/vendor-categories.api";
import type { VendorOperatingHourDto, VendorSettingsDto } from "@/types/vendor-settings";

const inputCls =
  "h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm placeholder:text-content-neutral-muted px-3";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatCategoryLabel(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function defaultHours(): VendorOperatingHourDto[] {
  return DAY_LABELS.map((_, day) => ({
    day,
    open: day === 0 ? "10:00" : "08:00",
    close: day === 6 ? "18:00" : day >= 4 && day <= 5 ? "22:00" : "20:00",
    isClosed: false,
  }));
}

function VendorSettingsSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6" role="status" aria-label="Loading settings">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
}

const VendorSettings = () => {
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: vendorSettingsQueryKey,
    queryFn: fetchVendorSettings,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["vendor", "categories"],
    queryFn: fetchVendorCategories,
  });

  const [form, setForm] = useState<VendorSettingsDto | null>(null);
  const [hours, setHours] = useState<VendorOperatingHourDto[]>(defaultHours());

  useEffect(() => {
    if (data?.data) {
      setForm(data.data);
      const byDay = new Map(
        (data.data.settings.operatingHours ?? []).map((row) => [row.day, row])
      );
      setHours(defaultHours().map((row) => byDay.get(row.day) ?? row));
    }
  }, [data?.data]);

  const saveMutation = useMutation({
    mutationFn: updateVendorSettings,
    onSuccess: (res) => {
      toast.success(res.message ?? "Settings saved");
      queryClient.setQueryData(vendorSettingsQueryKey, res);
      setForm(res.data);
    },
    onError: () => toast.error("Could not save settings"),
  });

  const categories = categoriesRes?.data ?? [];

  const canSave = useMemo(() => Boolean(form?.businessName.trim()), [form?.businessName]);

  const updateHour = (index: number, key: keyof VendorOperatingHourDto, value: string | boolean) => {
    setHours((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const handleSave = () => {
    if (!form) return;
    saveMutation.mutate({
      businessName: form.businessName,
      description: form.description,
      category: form.category,
      businessInfo: {
        legalName: form.businessInfo.legalName,
        contactEmail: form.businessInfo.contactEmail,
        contactPhone: form.businessInfo.contactPhone,
      },
      address: form.address,
      settings: {
        isOpen: form.settings.isOpen,
        operatingHours: hours,
        minOrderAmount: form.settings.minOrderAmount,
        preparationTime: form.settings.preparationTime,
        deliveryRadius: form.settings.deliveryRadius,
      },
    });
  };

  const handleCancel = () => {
    if (data?.data) {
      setForm(data.data);
      setHours(data.data.settings.operatingHours ?? defaultHours());
    }
  };

  if (isPending || !form) {
    return <VendorSettingsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <WarningCircle className="size-10 text-red-400" />
        <p className="font-semibold text-content-neutral-primary">Failed to load settings</p>
        <Button onClick={() => refetch()} className="rounded-full">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Settings</h1>

      <div className="bg-white rounded-2xl border border-border-muted p-5 sm:p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-content-neutral-primary">Store Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-sm text-content-neutral-secondary">Store Name</Label>
            <Input
              className={inputCls}
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-sm text-content-neutral-secondary">Description</Label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-border-muted bg-surface-subtle text-sm px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-surface-brand"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Phone Number</Label>
            <Input
              type="tel"
              className={inputCls}
              value={form.businessInfo.contactPhone}
              onChange={(e) =>
                setForm({
                  ...form,
                  businessInfo: { ...form.businessInfo, contactPhone: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Email Address</Label>
            <Input
              type="email"
              className={inputCls}
              value={form.businessInfo.contactEmail}
              onChange={(e) =>
                setForm({
                  ...form,
                  businessInfo: { ...form.businessInfo, contactEmail: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Business Category</Label>
            <select
              className="w-full h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm px-3"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {formatCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Store open</Label>
            <label className="flex items-center gap-2 h-10 text-sm text-content-neutral-secondary">
              <input
                type="checkbox"
                checked={form.settings.isOpen}
                onChange={(e) =>
                  setForm({
                    ...form,
                    settings: { ...form.settings, isOpen: e.target.checked },
                  })
                }
                className="accent-surface-brand"
              />
              Accepting orders now
            </label>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-content-neutral-secondary">Business Address</Label>
          <Input
            className={inputCls}
            value={form.address.addressLine1}
            onChange={(e) =>
              setForm({ ...form, address: { ...form.address, addressLine1: e.target.value } })
            }
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">City</Label>
            <Input
              className={inputCls}
              value={form.address.city}
              onChange={(e) =>
                setForm({ ...form, address: { ...form.address, city: e.target.value } })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">State</Label>
            <Input
              className={inputCls}
              value={form.address.state}
              onChange={(e) =>
                setForm({ ...form, address: { ...form.address, state: e.target.value } })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Postal code</Label>
            <Input
              className={inputCls}
              value={form.address.postalCode}
              onChange={(e) =>
                setForm({ ...form, address: { ...form.address, postalCode: e.target.value } })
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-muted p-5 sm:p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-content-neutral-primary">Operating Hours</h2>
        <div className="flex flex-col gap-3">
          {hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <span className="text-sm text-content-neutral-secondary w-24 shrink-0">
                {DAY_LABELS[h.day]}
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={h.isClosed}
                  onChange={(e) => updateHour(i, "isClosed", e.target.checked)}
                  className="accent-surface-brand"
                />
                <span className="text-xs text-content-neutral-muted">Closed</span>
              </label>
              <Input
                type="time"
                value={h.open}
                disabled={h.isClosed}
                onChange={(e) => updateHour(i, "open", e.target.value)}
                className={`${inputCls} w-32`}
              />
              <span className="text-xs text-content-neutral-muted">to</span>
              <Input
                type="time"
                value={h.close}
                disabled={h.isClosed}
                onChange={(e) => updateHour(i, "close", e.target.value)}
                className={`${inputCls} w-32`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-8"
          onClick={handleSave}
          disabled={!canSave || saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
        <Button
          variant="outline"
          className="rounded-full px-8 border-border-muted"
          onClick={handleCancel}
          disabled={saveMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default VendorSettings;
