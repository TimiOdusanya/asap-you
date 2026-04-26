"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const tasks = [
  { id: "hours", label: "Add Work Hours" },
  { id: "products", label: "Add Products" },
  { id: "registration", label: "Complete Registration" },
];

const VendorStepGetReady = () => {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-surface-brand">
          Get Ready to Start Selling
        </h2>
        <p className="text-sm text-content-neutral-secondary leading-relaxed max-w-[400px]">
          Fill out these details to activate your store and start receiving orders.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[380px]">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => toggle(task.id)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-surface-subtle hover:bg-surface-muted transition-colors cursor-pointer"
          >
            <span className="text-sm text-content-neutral-primary font-medium">
              {task.label}
            </span>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                checked.has(task.id)
                  ? "border-surface-brand bg-surface-brand"
                  : "border-border-muted bg-white"
              }`}
            >
              {checked.has(task.id) && (
                <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        onClick={() => router.push("/vendor/dashboard")}
        className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90"
      >
        Complete Setup
      </Button>
    </div>
  );
};

export default VendorStepGetReady;
