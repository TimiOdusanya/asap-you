"use client";

import React from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPageShell } from "@/components/admin/admin-page-shell";

export default function AdminSettingsPage() {
  return (
    <AdminPageShell
      title="Settings"
      subtitle="Admin configuration, audit log, and permissions will live here."
    >
      <EmptyState
        title="Settings coming soon"
        description="Next: admin roles & permissions, audit log, and feature flags."
      />
    </AdminPageShell>
  );
}

