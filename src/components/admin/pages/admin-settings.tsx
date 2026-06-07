"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminSectionCard } from "@/components/admin/admin-section-card";
import { AdminCardsSkeleton } from "@/components/admin/admin-page-skeletons";
import {
  adminStoreSettingsQueryKey,
  fetchAdminStoreSettings,
  updateAdminStoreSettings,
} from "@/services/admin/admin.api";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: adminStoreSettingsQueryKey,
    queryFn: fetchAdminStoreSettings,
  });

  const settings = data?.data;
  const [deliveryFee, setDeliveryFee] = React.useState("");
  const [serviceChargeRate, setServiceChargeRate] = React.useState("");
  const [minOrderAmount, setMinOrderAmount] = React.useState("");
  const [maxDeliveryDistance, setMaxDeliveryDistance] = React.useState("");
  const [currency, setCurrency] = React.useState("NGN");

  React.useEffect(() => {
    if (!settings) return;
    setDeliveryFee(String(settings.deliveryFee));
    setServiceChargeRate(String(settings.serviceChargeRate));
    setMinOrderAmount(String(settings.minOrderAmount));
    setMaxDeliveryDistance(String(settings.maxDeliveryDistance));
    setCurrency(settings.currency);
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: () =>
      updateAdminStoreSettings({
        deliveryFee: Number(deliveryFee),
        serviceChargeRate: Number(serviceChargeRate),
        minOrderAmount: Number(minOrderAmount),
        maxDeliveryDistance: Number(maxDeliveryDistance),
        currency: currency.trim(),
      }),
    onSuccess: () => {
      toast.success("Store settings updated");
      queryClient.invalidateQueries({ queryKey: adminStoreSettingsQueryKey });
    },
    onError: () => toast.error("Could not save settings"),
  });

  const inputClass = "h-10 rounded-lg border border-border-muted bg-white text-sm px-3";

  return (
    <AdminPageShell
      title="Settings"
      subtitle="Configure marketplace fees, charges, and delivery limits."
    >
      {isPending ? (
        <AdminCardsSkeleton count={2} />
      ) : (
        <AdminSectionCard title="Store pricing" subtitle="These values apply across customer checkout.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Delivery fee (₦)</Label>
              <Input
                className={inputClass}
                type="number"
                min={0}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">
                Service charge rate (0–1, e.g. 0.015 = 1.5%)
              </Label>
              <Input
                className={inputClass}
                type="number"
                min={0}
                max={1}
                step="0.001"
                value={serviceChargeRate}
                onChange={(e) => setServiceChargeRate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Minimum order amount (₦)</Label>
              <Input
                className={inputClass}
                type="number"
                min={0}
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Max delivery distance (km)</Label>
              <Input
                className={inputClass}
                type="number"
                min={1}
                value={maxDeliveryDistance}
                onChange={(e) => setMaxDeliveryDistance(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Currency</Label>
              <Input
                className={inputClass}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </div>

          {settings ? (
            <p className="mt-4 text-xs text-content-neutral-muted">
              Current service charge display: {settings.serviceChargePercent}
            </p>
          ) : null}

          <Button
            type="button"
            className="mt-6 rounded-full bg-surface-brand hover:bg-surface-brand/90"
            disabled={saveMut.isPending}
            onClick={() => saveMut.mutate()}
          >
            {saveMut.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save settings"
            )}
          </Button>
        </AdminSectionCard>
      )}
    </AdminPageShell>
  );
}
