"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import { ClockCountdownIcon, SignOutIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export type PendingApprovalRole = "vendor" | "rider";

interface PendingApprovalScreenProps {
  role: PendingApprovalRole;
  onLogout: () => void;
}

const roleCopy: Record<PendingApprovalRole, { title: string; body: string }> = {
  vendor: {
    title: "Store approval in progress",
    body: "Your documents are under review. You will get access to your vendor dashboard as soon as your store is approved.",
  },
  rider: {
    title: "Rider profile under review",
    body: "Your rider profile is being reviewed. You will be able to start accepting deliveries once your account is approved.",
  },
};

function launchSubtleConfetti() {
  confetti({
    particleCount: 35,
    spread: 70,
    startVelocity: 20,
    gravity: 0.9,
    scalar: 0.8,
    origin: { y: 0.35 },
    colors: ["#16a34a", "#22c55e", "#86efac", "#dcfce7", "#ffffff"],
  });
}

export function PendingApprovalScreen({ role, onLogout }: PendingApprovalScreenProps) {
  React.useEffect(() => {
    launchSubtleConfetti();
  }, []);

  const copy = roleCopy[role];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 via-white to-white px-4 py-10">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-green-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative w-full max-w-xl rounded-3xl border border-green-100 bg-white/95 p-7 text-center shadow-xl shadow-emerald-100/40 sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
          <ClockCountdownIcon className="size-7" weight="duotone" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-content-neutral-primary sm:text-3xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-content-neutral-secondary sm:text-base">
          {copy.body}
        </p>
        <p className="mt-3 text-xs text-content-neutral-muted sm:text-sm">
          This usually takes a short while. Thank you for your patience.
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-7 h-11 rounded-full border-border-muted px-6"
          onClick={onLogout}
        >
          <SignOutIcon className="size-4" aria-hidden />
          Log out
        </Button>
      </div>
    </div>
  );
}
