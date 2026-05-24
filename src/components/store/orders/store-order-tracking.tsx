"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { MapPin, Phone, Bike, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackOrder, orderTrackQueryKey, fetchConfirmationCode } from "@/services/store/orders.api";
import { useOrderSocket } from "@/hooks/use-socket";
import { StoreOrderTrackingMap } from "@/components/store/orders/store-order-tracking-map";
import { StoreOrderTrackingDetails } from "@/components/store/orders/store-order-tracking-details";
import type { OrderStatus, OrderTimelineEntry } from "@/types/order";
import { cn } from "@/lib/utils";

const TIMELINE_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: "pending", label: "Order placed", description: "Waiting for store confirmation" },
  { status: "confirmed", label: "Order confirmed", description: "Payment received" },
  { status: "preparing", label: "Preparing", description: "Store is preparing your order" },
  { status: "ready_for_pickup", label: "Ready", description: "Order is ready for pickup" },
  { status: "picked_up", label: "Picked up", description: "Rider collected your order" },
  { status: "on_the_way", label: "On the way", description: "Rider is heading to you" },
  { status: "arrived", label: "Arrived", description: "Rider is at your location" },
  { status: "delivered", label: "Delivered", description: "Order delivered successfully!" },
];

const STATUS_ORDER: OrderStatus[] = TIMELINE_STEPS.map((s) => s.status);

function getStepIndex(status: OrderStatus): number {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function ConfirmationCodeCard({ orderId }: { orderId: string }) {
  const [show, setShow] = React.useState(false);
  const { data, isPending, refetch } = useQuery({
    queryKey: ["order", orderId, "code"],
    queryFn: () => fetchConfirmationCode(orderId),
    enabled: show,
  });

  return (
    <div className="rounded-2xl border border-primary/30 bg-surface-brand-soft/30 p-4">
      <p className="text-sm font-semibold text-content-neutral-primary">Delivery confirmation code</p>
      <p className="mt-0.5 text-xs text-content-neutral-secondary">
        Share this code with the rider to confirm delivery.
      </p>
      {show ? (
        <div className="mt-3">
          {isPending ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : data?.data ? (
            <p className="text-3xl font-bold tracking-[0.25em] text-primary">
              {data.data.confirmationCode}
            </p>
          ) : null}
        </div>
      ) : (
        <Button
          size="sm"
          className="mt-3 rounded-full"
          onClick={() => { setShow(true); refetch(); }}
        >
          Reveal code
        </Button>
      )}
    </div>
  );
}

function TimelineStepper({
  currentStatus,
  timeline,
}: {
  currentStatus: OrderStatus;
  timeline: OrderTimelineEntry[];
}) {
  if (currentStatus === "cancelled" || currentStatus === "failed") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700">
        <AlertCircle className="size-5 shrink-0" />
        <div>
          <p className="font-semibold">
            Order {currentStatus === "cancelled" ? "cancelled" : "failed"}
          </p>
          {timeline.at(-1)?.note && (
            <p className="mt-0.5 text-sm">{timeline.at(-1)!.note}</p>
          )}
        </div>
      </div>
    );
  }

  const currentIdx = getStepIndex(currentStatus);

  return (
    <ol className="space-y-0">
      {TIMELINE_STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const pending = i > currentIdx;
        const timelineEntry = timeline.find((t) => t.status === step.status);

        return (
          <li key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                  done
                    ? "border-green-500 bg-green-500 text-white"
                    : active
                      ? "border-primary bg-primary text-white"
                      : "border-border-muted bg-white text-content-neutral-muted"
                )}
              >
                {done ? <CheckCircle className="size-4" /> : active ? <Clock className="size-4 animate-pulse" /> : i + 1}
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  className={cn(
                    "my-0.5 w-0.5 flex-1 min-h-[24px]",
                    done ? "bg-green-400" : "bg-border-muted"
                  )}
                />
              )}
            </div>

            <div className={cn("pb-5", i === TIMELINE_STEPS.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  pending
                    ? "text-content-neutral-muted"
                    : "text-content-neutral-primary"
                )}
              >
                {step.label}
              </p>
              <p className="mt-0.5 text-xs text-content-neutral-muted">{step.description}</p>
              {timelineEntry && (
                <p className="mt-0.5 text-xs text-content-neutral-muted">
                  {new Date(timelineEntry.timestamp).toLocaleTimeString("en-NG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function StoreOrderTracking({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: orderTrackQueryKey(orderId),
    queryFn: () => trackOrder(orderId),
    refetchInterval: 30_000,
  });

  useOrderSocket(orderId, {
    onStatusUpdate: (update) => {
      if (update.orderId !== orderId) return;
      queryClient.setQueryData(orderTrackQueryKey(orderId), (old: typeof data) => {
        if (!old?.data) return old;
        return { ...old, data: { ...old.data, status: update.status as OrderStatus } };
      });
      queryClient.invalidateQueries({ queryKey: orderTrackQueryKey(orderId) });
    },
    onRiderAssigned: () => {
      queryClient.invalidateQueries({ queryKey: orderTrackQueryKey(orderId) });
    },
    onRiderLocation: (update) => {
      if (update.orderId !== orderId) return;
      queryClient.setQueryData(orderTrackQueryKey(orderId), (old: typeof data) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: { ...old.data, riderLocation: { coordinates: update.location, lastUpdated: update.timestamp } },
        };
      });
    },
    onDelivered: () => {
      queryClient.invalidateQueries({ queryKey: orderTrackQueryKey(orderId) });
    },
  });

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="size-10 text-red-400" />
        <p className="text-lg font-semibold">Order not found</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/store/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  const track = data.data;
  const isLiveTracking = ["picked_up", "on_the_way", "arrived"].includes(track.status);
  const showMap = !["cancelled", "failed"].includes(track.status);
  const showCode = track.riderAssignedAt && !["delivered", "cancelled", "failed"].includes(track.status);

  return (
    <div className="space-y-6">
      {/* Status header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Order {orderId}</p>
        <p className="mt-1 text-2xl font-bold text-content-neutral-primary capitalize">
          {track.status.replace(/_/g, " ")}
        </p>
        {track.delivery.estimatedDeliveryTime && !["delivered", "cancelled", "failed"].includes(track.status) && (
          <p className="mt-1 text-sm text-content-neutral-secondary">
            Est. delivery: {new Date(track.delivery.estimatedDeliveryTime).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>

      <StoreOrderTrackingDetails orderId={orderId} />

      {/* Rider info */}
      {track.rider && (
        <div className="flex items-center justify-between rounded-2xl border border-border-muted bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Bike className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-content-neutral-primary">
                {track.rider.name ?? "Your rider"}
              </p>
              <p className="text-xs text-content-neutral-muted capitalize">
                {track.rider.vehicleType} · ⭐ {track.rider.rating?.toFixed(1) ?? "–"}
              </p>
            </div>
          </div>
          {track.rider.phone && (
            <a
              href={`tel:${track.rider.phone}`}
              className="flex size-9 items-center justify-center rounded-full border border-border-muted hover:bg-surface-muted"
            >
              <Phone className="size-4 text-content-neutral-secondary" />
            </a>
          )}
        </div>
      )}

      {/* Delivery map */}
      {showMap && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-content-neutral-primary">
            {isLiveTracking ? "Live tracking" : "Delivery map"}
          </h2>
          {!isLiveTracking && track.status !== "delivered" ? (
            <p className="mb-3 text-xs text-content-neutral-muted">
              Your delivery address is shown below. Rider location appears once pickup starts.
            </p>
          ) : null}
          <StoreOrderTrackingMap
            deliveryAddress={track.delivery.address}
            riderLocation={track.riderLocation}
            isLive={isLiveTracking}
          />
        </div>
      )}

      {/* Confirmation code */}
      {showCode && <ConfirmationCodeCard orderId={orderId} />}

      {/* Timeline */}
      <div className="rounded-2xl border border-border-muted bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-content-neutral-primary">Order timeline</h2>
        <TimelineStepper currentStatus={track.status} timeline={track.timeline} />
      </div>

      {/* Delivery address */}
      <div className="rounded-2xl border border-border-muted bg-white p-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 size-4 shrink-0 text-content-neutral-muted" />
          <div>
            <p className="text-sm font-semibold text-content-neutral-primary">Delivery address</p>
            <p className="mt-0.5 text-sm text-content-neutral-secondary">
              {track.delivery.address.addressLine1}, {track.delivery.address.city},{" "}
              {track.delivery.address.state}
            </p>
            {track.delivery.instructions && (
              <p className="mt-0.5 text-xs text-content-neutral-muted">
                Note: {track.delivery.instructions}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
