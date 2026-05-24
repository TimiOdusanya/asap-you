"use client";

import React, { useState } from "react";
import { ListIcon } from "@phosphor-icons/react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";
import { RealtimeSync } from "@/components/shared/realtime-sync";

export default function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminRouteGuard>
      <RealtimeSync />
      <div className="flex h-[100dvh] min-h-0 overflow-hidden bg-surface-subtle">
        <AdminSidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-center gap-3 border-b border-border-muted bg-white px-4 py-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="cursor-pointer rounded-lg p-1.5 hover:bg-surface-muted"
            >
              <ListIcon className="size-5 text-content-neutral-secondary" />
            </button>
            <span className="text-base font-semibold text-content-neutral-primary">
              Admin
            </span>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminRouteGuard>
  );
}

