"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  currentUserQueryKey,
  fetchCurrentUser,
  updateUserProfile,
} from "@/services/auth/auth.api";
import {
  fetchRiderProfile,
  riderProfileQueryKey,
} from "@/services/rider/rider-deliveries.api";
import { useAuthStore } from "@/stores/auth-store";

const RiderSettings = () => {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.token);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { data: userRes, isPending: userLoading } = useQuery({
    queryKey: currentUserQueryKey,
    queryFn: fetchCurrentUser,
  });

  const { data: riderRes, isPending: riderLoading } = useQuery({
    queryKey: riderProfileQueryKey,
    queryFn: fetchRiderProfile,
  });

  const user = userRes?.data;
  const rider = riderRes?.data;

  useEffect(() => {
    if (user) {
      setFirstName(user.profile.firstName ?? "");
      setLastName(user.profile.lastName ?? "");
    }
  }, [user]);

  const saveProfileMut = useMutation({
    mutationFn: () =>
      updateUserProfile({
        profile: { firstName: firstName.trim(), lastName: lastName.trim() },
      }),
    onSuccess: (res) => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
      if (token) setSession(token, res.data);
    },
    onError: () => toast.error("Could not save profile"),
  });

  const iCls = "h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm px-3";
  const loading = userLoading || riderLoading;

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Settings</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-surface-brand" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-6 flex flex-col gap-5">
            <h2 className="text-base font-semibold text-content-neutral-primary">Profile Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">First Name</Label>
                <Input className={iCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">Last Name</Label>
                <Input className={iCls} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">Email</Label>
                <Input className={iCls} type="email" value={user?.email ?? ""} readOnly disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">Phone</Label>
                <Input className={iCls} type="tel" value={user?.phone ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">Vehicle Type</Label>
                <Input className={iCls} value={rider?.vehicleType ?? ""} readOnly disabled />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">License</Label>
                <Input className={iCls} value={rider?.license ?? ""} readOnly disabled />
              </div>
            </div>
            <Button
              className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-8 w-fit"
              onClick={() => saveProfileMut.mutate()}
              disabled={saveProfileMut.isPending || !firstName.trim() || !lastName.trim()}
            >
              {saveProfileMut.isPending ? "Saving…" : "Save Profile"}
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-6 flex flex-col gap-5">
            <h2 className="text-base font-semibold text-content-neutral-primary">Bank Account</h2>
            <p className="text-xs text-content-neutral-muted -mt-2">
              Bank details are managed during rider registration. Contact support to update.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">Account Number</Label>
                <Input className={iCls} value={rider?.bankAccount?.accountNumber ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-content-neutral-secondary">Bank Name</Label>
                <Input className={iCls} value={rider?.bankAccount?.bankName ?? ""} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-sm text-content-neutral-secondary">Account Holder Name</Label>
                <Input className={iCls} value={rider?.bankAccount?.accountHolderName ?? ""} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-6 flex flex-col gap-5">
            <h2 className="text-base font-semibold text-content-neutral-primary">Delivery Preferences</h2>
            <p className="text-xs text-content-neutral-muted -mt-2">
              Preferences are set by the platform. Contact support to change them.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-content-neutral-primary">Auto-accept orders</p>
                <p className="text-xs text-content-neutral-muted">Automatically accept incoming delivery requests</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  rider?.settings?.autoAcceptOrders
                    ? "bg-surface-brand-soft text-surface-brand"
                    : "bg-surface-muted text-content-neutral-secondary"
                }`}
              >
                {rider?.settings?.autoAcceptOrders ? "On" : "Off"}
              </span>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Max Delivery Distance (km)</Label>
              <Input
                className={`${iCls} max-w-[200px]`}
                type="number"
                value={rider?.settings?.maxDeliveryDistance ?? 50}
                readOnly
                disabled
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RiderSettings;
