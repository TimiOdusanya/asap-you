"use client";

import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { Toaster } from "@/components/ui/sonner";

export function ToastProvider() {
  return (
    <Toaster
      theme="light"
      position="top-right"
      toastOptions={{
        classNames: {
          icon: "size-8",
          closeButton:
            "text-content-neutral-muted hover:text-content-neutral-primary",
        },
      }}
      icons={{
        success: (
          <CheckCircleIcon
            weight="fill"
            className="text-content-positive"
            size={20}
          />
        ),
        error: (
          <XCircleIcon
            weight="fill"
            className="text-content-negative-strong"
            size={20}
          />
        ),
        warning: (
          <WarningCircleIcon
            weight="fill"
            className="text-content-warning"
            size={20}
          />
        ),
        info: (
          <InfoIcon
            weight="fill"
            className="text-[#2563eb]"
            size={20}
          />
        ),
      }}
    />
  );
}
