"use client";

import * as React from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle2, MapPin, Sparkles, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressLabel?: string;
  onOrderNow: () => void;
}

function fireCelebration() {
  const duration = 2800;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 62,
      origin: { x: 0, y: 0.6 },
      colors: ["#4caf50", "#81c784", "#ffd54f", "#ffffff"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 62,
      origin: { x: 1, y: 0.6 },
      colors: ["#4caf50", "#81c784", "#ffd54f", "#ffffff"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };

  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 42,
    origin: { y: 0.5 },
    colors: ["#4caf50", "#2e7d32", "#66bb6a", "#fff9c4", "#ffffff", "#a5d6a7"],
  });
  frame();
}

export function DeliveryCoverageSuccessModal({
  open,
  onOpenChange,
  addressLabel,
  onOrderNow,
}: Props) {
  React.useEffect(() => {
    if (!open) return;
    fireCelebration();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose
        className={cn(
          "max-w-[min(92vw,36rem)] gap-0 overflow-hidden border-0 p-0 shadow-2xl sm:max-w-xl sm:rounded-3xl",
          "bg-gradient-to-b from-[#e8f5e9] via-white to-white"
        )}
      >
        <div className="relative px-6 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
          <div
            className="pointer-events-none absolute -left-16 -top-16 size-48 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-10 top-20 size-40 rounded-full bg-amber-200/40 blur-3xl"
            aria-hidden
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative mx-auto mb-8 flex size-28 items-center justify-center sm:size-32"
          >
            <div className="absolute inset-0 rounded-full bg-primary/10 ring-1 ring-primary/20" />
            <div className="absolute inset-2 rounded-full bg-primary/15 ring-4 ring-primary/25" />
            <CheckCircle2
              className="relative size-14 text-primary sm:size-16"
              strokeWidth={2}
            />
            <Sparkles
              className="absolute -right-1 top-2 size-7 text-amber-400 sm:size-8"
              aria-hidden
            />
            <Truck
              className="absolute -bottom-1 -left-2 size-7 text-primary/70 sm:size-8"
              aria-hidden
            />
          </motion.div>

          <div className="relative text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              Delivery available
            </span>

            <DialogTitle className="text-3xl font-bold tracking-tight text-content-neutral-primary sm:text-4xl">
              We deliver to you!
            </DialogTitle>

            <DialogDescription asChild>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-content-neutral-secondary sm:text-lg">
                Great news — your area is inside our{" "}
                <span className="font-semibold text-primary">Oshodi–Ikeja</span> delivery zone.
              </p>
            </DialogDescription>

            {addressLabel ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-2xl border border-primary/20 bg-white/80 px-4 py-4 text-left shadow-sm backdrop-blur-sm sm:px-5 sm:py-5"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <p className="text-sm leading-relaxed text-content-neutral-primary sm:text-base">
                  {addressLabel}
                </p>
              </motion.div>
            ) : null}
          </div>

          <Button
            type="button"
            className="relative mt-8 h-14 w-full rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 sm:mt-10 sm:h-16 sm:text-lg"
            onClick={() => {
              onOpenChange(false);
              onOrderNow();
            }}
          >
            Order now
          </Button>

          <p className="mt-4 text-center text-xs text-content-neutral-muted sm:text-sm">
            Fresh groceries and essentials, delivered fast to your door.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
