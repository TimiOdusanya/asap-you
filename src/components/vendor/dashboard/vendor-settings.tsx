"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const inputCls =
  "h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm placeholder:text-content-neutral-muted px-3";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const VendorSettings = () => {
  const [hours, setHours] = useState(
    DAYS.map((day, i) => ({
      day,
      open: i === 0 ? "10:00" : "08:00",
      close: i >= 4 && i <= 5 ? "22:00" : i === 6 ? "18:00" : "20:00",
      isClosed: false,
    }))
  );

  const updateHour = (index: number, key: "open" | "close" | "isClosed", value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, [key]: value } : h)));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Settings</h1>

      <div className="bg-white rounded-2xl border border-border-muted p-5 sm:p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-content-neutral-primary">Store Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Store Name</Label>
            <Input placeholder="Store Name" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Phone Number</Label>
            <Input type="tel" placeholder="Phone Number" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Email Address</Label>
            <Input type="email" placeholder="Email Address" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm text-content-neutral-secondary">Business Category</Label>
            <select className="w-full h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm text-content-neutral-secondary px-3">
              <option>Restaurant</option>
              <option>Supermarket</option>
              <option>Pharmacy</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-content-neutral-secondary">Business Address</Label>
          <Input placeholder="Business Address" className={inputCls} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-muted p-5 sm:p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-content-neutral-primary">Operating Hours</h2>
        <div className="flex flex-col gap-3">
          {hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <span className="text-sm text-content-neutral-secondary w-24 shrink-0">{h.day}</span>
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
        <Button className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-8">Save Changes</Button>
        <Button variant="outline" className="rounded-full px-8 border-border-muted">Cancel</Button>
      </div>
    </div>
  );
};

export default VendorSettings;
