"use client";

import React, { useState } from "react";
import { ListIcon } from "@phosphor-icons/react";
import VendorSidebar from "@/components/vendor/dashboard/vendor-sidebar";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <VendorSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-border-muted sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="p-1.5 rounded-lg hover:bg-surface-muted cursor-pointer"
          >
            <ListIcon className="size-5 text-content-neutral-secondary" />
          </button>
          <span className="text-base font-semibold text-content-neutral-primary">Dashboard</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
