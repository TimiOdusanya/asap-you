"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGateSkeleton({
  label = "Loading",
}: {
  label?: string;
}) {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border-muted bg-white p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

