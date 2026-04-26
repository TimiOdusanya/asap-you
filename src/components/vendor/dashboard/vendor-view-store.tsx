"use client";

import React from "react";
import { StorefrontIcon, ArrowSquareOutIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VendorViewStore = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">View Store</h1>

      <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-border-muted py-16 px-6 text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-surface-brand-soft flex items-center justify-center">
          <StorefrontIcon className="size-8 text-surface-forest" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-content-neutral-primary">Your Store Preview</h2>
          <p className="text-sm text-content-neutral-secondary max-w-[360px]">
            See exactly how customers view your store. Make sure your branding, products, and
            details are looking great before going live.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-8 gap-2">
            <ArrowSquareOutIcon className="size-4" />
            Preview Store
          </Button>
          <Button variant="outline" className="rounded-full px-8 border-border-muted" asChild>
            <Link href="/vendor/dashboard/add-product">Add Products</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Listings", value: "12", note: "Active products" },
          { label: "Store Visits", value: "—", note: "Last 30 days" },
          { label: "Average Rating", value: "—", note: "No reviews yet" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-border-muted p-5 flex flex-col gap-1">
            <span className="text-xs text-content-neutral-muted">{item.label}</span>
            <span className="text-2xl font-semibold text-content-neutral-primary">{item.value}</span>
            <span className="text-xs text-content-neutral-muted">{item.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorViewStore;
