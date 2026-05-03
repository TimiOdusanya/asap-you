"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function AdminTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto rounded-2xl border border-border-muted bg-white", className)}>
      <table className="w-full min-w-[720px] text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-4 py-3 text-left font-medium text-content-neutral-muted", className)}>
      {children}
    </th>
  );
}

export function AdminTd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("px-4 py-3 text-content-neutral-secondary", className)}>{children}</td>
  );
}

