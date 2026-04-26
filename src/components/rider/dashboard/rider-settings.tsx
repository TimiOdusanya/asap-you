"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const RiderSettings = () => {
  const [profile, setProfile] = useState({
    firstName: "John", lastName: "Doe", email: "rider@example.com",
    phone: "08012345679", vehicleType: "motorcycle",
  });
  const [bank, setBank] = useState({
    accountNumber: "", bankName: "", accountHolderName: "",
  });
  const [autoAccept, setAutoAccept] = useState(false);
  const [maxDistance, setMaxDistance] = useState("50");

  const iCls = "h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm px-3";

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Settings</h1>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-content-neutral-primary">Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">First Name</Label>
            <Input className={iCls} value={profile.firstName}
              onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Last Name</Label>
            <Input className={iCls} value={profile.lastName}
              onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Email</Label>
            <Input className={iCls} type="email" value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Phone</Label>
            <Input className={iCls} type="tel" value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Vehicle Type</Label>
            <Select value={profile.vehicleType} onValueChange={(v) => setProfile((p) => ({ ...p, vehicleType: v }))}>
              <SelectTrigger className="h-10 rounded-lg border-border-muted bg-surface-subtle text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="bicycle">Bicycle</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-8 w-fit">Save Profile</Button>
      </div>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-content-neutral-primary">Bank Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Account Number</Label>
            <Input className={iCls} value={bank.accountNumber}
              onChange={(e) => setBank((p) => ({ ...p, accountNumber: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Bank Name</Label>
            <Input className={iCls} value={bank.bankName}
              onChange={(e) => setBank((p) => ({ ...p, bankName: e.target.value }))} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-sm text-content-neutral-secondary">Account Holder Name</Label>
            <Input className={iCls} value={bank.accountHolderName}
              onChange={(e) => setBank((p) => ({ ...p, accountHolderName: e.target.value }))} />
          </div>
        </div>
        <Button className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-8 w-fit">Save Bank Details</Button>
      </div>

      <div className="bg-white rounded-xl border border-border-muted p-4 sm:p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-content-neutral-primary">Delivery Preferences</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-content-neutral-primary">Auto-accept orders</p>
            <p className="text-xs text-content-neutral-muted">Automatically accept incoming delivery requests</p>
          </div>
          <button onClick={() => setAutoAccept((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${autoAccept ? "bg-surface-brand" : "bg-surface-muted"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${autoAccept ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-content-neutral-secondary">Max Delivery Distance (km)</Label>
          <Input className={`${iCls} max-w-[200px]`} type="number" value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)} />
        </div>
        <Button className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-8 w-fit">Save Preferences</Button>
      </div>
    </div>
  );
};

export default RiderSettings;
