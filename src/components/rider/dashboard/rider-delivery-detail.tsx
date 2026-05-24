"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Package,
  User,
  MapPin,
  Phone,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchActiveDelivery,
  pickUpOrder,
  markOnTheWay,
  markArrived,
  confirmDelivery,
  riderActiveDeliveryQueryKey,
} from "@/services/rider/rider-deliveries.api";
import type { OrderStatus, RiderActiveDeliveryData } from "@/types/order";
import { cn } from "@/lib/utils";
import { useOrderSocket } from "@/hooks/use-socket";
import { useRiderLocationBroadcast } from "@/hooks/use-rider-location-broadcast";

const STEP_ACTIONS: {
  status: OrderStatus;
  nextLabel: string;
  nextAction: (orderId: string) => Promise<unknown>;
  nextStatus: OrderStatus;
  buttonVariant?: "default" | "outline" | "destructive";
  buttonClass?: string;
}[] = [
  {
    status: "ready_for_pickup",
    nextLabel: "Pick up order",
    nextAction: pickUpOrder,
    nextStatus: "picked_up",
    buttonClass: "bg-purple-600 hover:bg-purple-700",
  },
  {
    status: "picked_up",
    nextLabel: "I'm on the way",
    nextAction: markOnTheWay,
    nextStatus: "on_the_way",
    buttonClass: "bg-cyan-600 hover:bg-cyan-700",
  },
  {
    status: "on_the_way",
    nextLabel: "I've arrived",
    nextAction: markArrived,
    nextStatus: "arrived",
    buttonClass: "bg-teal-600 hover:bg-teal-700",
  },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Partial<Record<OrderStatus, string>> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready_for_pickup: "bg-purple-100 text-purple-800",
    picked_up: "bg-indigo-100 text-indigo-800",
    on_the_way: "bg-cyan-100 text-cyan-800",
    arrived: "bg-teal-100 text-teal-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    failed: "bg-red-100 text-red-800",
  };
  const labels: Partial<Record<OrderStatus, string>> = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready_for_pickup: "Ready for pickup",
    picked_up: "Picked up",
    on_the_way: "On the way",
    arrived: "Arrived",
    delivered: "Delivered",
    cancelled: "Cancelled",
    failed: "Failed",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles[status] ?? "bg-surface-muted text-content-neutral-primary"
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}

function OtpConfirmCard({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState("");

  const confirmMut = useMutation({
    mutationFn: () => confirmDelivery(orderId, code.trim()),
    onSuccess: () => {
      toast.success("Delivery confirmed! Great job 🎉");
      queryClient.invalidateQueries({ queryKey: riderActiveDeliveryQueryKey });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error && err.message.includes("Invalid")
          ? "Wrong code. Check with the customer."
          : "Confirmation failed. Try again.";
      setError(msg);
    },
  });

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-surface-brand-soft/20 p-5">
      <h2 className="font-semibold text-content-neutral-primary">Confirm delivery</h2>
      <p className="mt-1 text-sm text-content-neutral-secondary">
        Ask the customer for their confirmation code to complete delivery.
      </p>
      <div className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="otp-code">Confirmation code</Label>
          <Input
            id="otp-code"
            placeholder="Enter code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            maxLength={8}
            className="rounded-xl text-center text-xl font-bold tracking-widest"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <Button
          className="w-full rounded-full gap-1.5"
          onClick={() => confirmMut.mutate()}
          disabled={code.trim().length < 4 || confirmMut.isPending}
        >
          <CheckCircle className="size-4" />
          {confirmMut.isPending ? "Verifying…" : "Confirm delivery"}
        </Button>
      </div>
    </div>
  );
}

export function RiderDeliveryDetail() {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: riderActiveDeliveryQueryKey,
    queryFn: fetchActiveDelivery,
    refetchInterval: 30_000,
  });

  const delivery: RiderActiveDeliveryData | null = data?.data ?? null;

  useRiderLocationBroadcast(delivery?.status);

  useOrderSocket(delivery?.orderId ?? null, {
    onStatusUpdate: () => {
      queryClient.invalidateQueries({ queryKey: riderActiveDeliveryQueryKey });
    },
  });

  const stepConfig = STEP_ACTIONS.find((s) => s.status === delivery?.status);

  const stepMut = useMutation({
    mutationFn: () => stepConfig!.nextAction(delivery!.orderId),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: riderActiveDeliveryQueryKey });
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle className="size-10 text-red-400" />
        <p className="font-semibold">Failed to load delivery</p>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Package className="size-12 text-content-neutral-muted" />
        <h2 className="text-lg font-semibold text-content-neutral-primary">No active delivery</h2>
        <p className="text-sm text-content-neutral-secondary">
          You will see your active delivery here once assigned.
        </p>
        <Link href="/rider/dashboard" className="text-sm text-content-link hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/rider/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-content-neutral-secondary hover:text-content-neutral-primary"
      >
        <ChevronLeft className="size-4" /> Dashboard
      </Link>

      {/* Status banner */}
      <div className="flex items-start justify-between gap-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Active delivery</p>
          <p className="mt-1 text-xl font-bold text-content-neutral-primary">#{delivery.orderId}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      {/* Action button */}
      {stepConfig && (
        <Button
          className={cn("w-full rounded-full py-6 text-base", stepConfig.buttonClass)}
          onClick={() => stepMut.mutate()}
          disabled={stepMut.isPending}
        >
          {stepMut.isPending ? <Loader2 className="size-5 animate-spin" /> : stepConfig.nextLabel}
        </Button>
      )}

      {/* OTP confirmation */}
      {delivery.status === "arrived" && <OtpConfirmCard orderId={delivery.orderId} />}

      {/* Vendor pickup info */}
      {delivery.vendor && (
        <div className="rounded-2xl border border-border-muted bg-white p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-neutral-muted">
            Pick up from
          </p>
          <p className="font-semibold text-content-neutral-primary">{delivery.vendor.businessName}</p>
          {delivery.vendor.phone && (
            <a
              href={`tel:${delivery.vendor.phone}`}
              className="mt-1 inline-flex items-center gap-1.5 text-sm text-content-link hover:underline"
            >
              <Phone className="size-3.5" /> {delivery.vendor.phone}
            </a>
          )}
        </div>
      )}

      {/* Customer delivery info */}
      <div className="rounded-2xl border border-border-muted bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-neutral-muted">
          Deliver to
        </p>
        <div className="flex items-start gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-surface-muted">
            <User className="size-4 text-content-neutral-muted" />
          </div>
          <div>
            <p className="font-semibold text-content-neutral-primary">{delivery.customer.name}</p>
            <a
              href={`tel:${delivery.customer.phone}`}
              className="mt-0.5 flex items-center gap-1.5 text-sm text-content-link hover:underline"
            >
              <Phone className="size-3.5" /> {delivery.customer.phone}
            </a>
            <div className="mt-1 flex items-start gap-1.5 text-xs text-content-neutral-muted">
              <MapPin className="mt-0.5 size-3 shrink-0" />
              {delivery.delivery.address.addressLine1}, {delivery.delivery.address.city},{" "}
              {delivery.delivery.address.state}
            </div>
            {delivery.delivery.instructions && (
              <p className="mt-0.5 text-xs text-content-neutral-muted">
                Note: {delivery.delivery.instructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items summary */}
      <div className="rounded-2xl border border-border-muted bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-neutral-muted">
          Items
        </p>
        <ul className="space-y-2">
          {delivery.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-content-neutral-primary">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-content-neutral-secondary">
                ₦{item.totalPrice.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-border-muted pt-3 text-sm font-bold text-content-neutral-primary">
          <span>Total</span>
          <span>₦{delivery.pricing.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
