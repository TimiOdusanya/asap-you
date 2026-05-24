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
  Bike,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  fetchVendorOrderById,
  acceptOrder,
  rejectOrder,
  markOrderReady,
  assignRider,
  fetchAvailableRiders,
  vendorOrderDetailQueryKey,
  availableRidersQueryKey,
} from "@/services/vendor/vendor-orders.api";
import { vendorProductsQueryKey } from "@/services/vendor/vendor-products.api";
import type { AvailableRiderDto, OrderDto, OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";
import { useOrderSocket } from "@/hooks/use-socket";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready_for_pickup: "Ready for pickup",
  picked_up: "Picked up",
  on_the_way: "On the way",
  arrived: "Rider arrived",
  delivered: "Delivered",
  cancelled: "Cancelled",
  failed: "Failed",
};

export function VendorOrderDetail({ orderId }: { orderId: string }) {
  const queryClient = useQueryClient();
  const [prepMins, setPrepMins] = React.useState(15);
  const [showAssign, setShowAssign] = React.useState(false);
  const [selectedRider, setSelectedRider] = React.useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: vendorOrderDetailQueryKey(orderId),
    queryFn: () => fetchVendorOrderById(orderId),
    refetchInterval: 20_000,
  });

  useOrderSocket(orderId, {
    onStatusUpdate: () => {
      queryClient.invalidateQueries({ queryKey: vendorOrderDetailQueryKey(orderId) });
    },
    onRiderAssigned: () => {
      queryClient.invalidateQueries({ queryKey: vendorOrderDetailQueryKey(orderId) });
    },
  });

  const { data: ridersData } = useQuery({
    queryKey: availableRidersQueryKey,
    queryFn: fetchAvailableRiders,
    enabled: showAssign,
  });
  const availableRiders: AvailableRiderDto[] = ridersData?.data ?? [];

  const acceptMut = useMutation({
    mutationFn: () => acceptOrder(orderId, prepMins),
    onSuccess: () => {
      toast.success("Order accepted");
      queryClient.invalidateQueries({ queryKey: vendorOrderDetailQueryKey(orderId) });
      queryClient.invalidateQueries({ queryKey: vendorProductsQueryKey });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to accept order");
    },
  });

  const rejectMut = useMutation({
    mutationFn: () => rejectOrder(orderId),
    onSuccess: () => {
      toast.success("Order rejected");
      queryClient.invalidateQueries({ queryKey: vendorOrderDetailQueryKey(orderId) });
    },
    onError: () => toast.error("Failed to reject order"),
  });

  const readyMut = useMutation({
    mutationFn: () => markOrderReady(orderId),
    onSuccess: () => {
      toast.success("Order marked ready for pickup");
      queryClient.invalidateQueries({ queryKey: vendorOrderDetailQueryKey(orderId) });
    },
    onError: () => toast.error("Failed to mark order ready"),
  });

  const assignMut = useMutation({
    mutationFn: () => assignRider(orderId, selectedRider!),
    onSuccess: () => {
      toast.success("Rider assigned");
      queryClient.invalidateQueries({ queryKey: vendorOrderDetailQueryKey(orderId) });
      setShowAssign(false);
    },
    onError: () => toast.error("Failed to assign rider"),
  });

  if (isPending) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle className="size-10 text-red-400" />
        <p className="font-semibold">Order not found</p>
        <Link href="/vendor/dashboard/orders" className="text-sm text-content-link hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const order: OrderDto = data.data;
  const canAccept = order.status === "pending" || order.status === "confirmed";
  const canMarkReady = order.status === "preparing";
  const canAssignRider =
    ["confirmed", "preparing", "ready_for_pickup"].includes(order.status) && !order.riderId;

  return (
    <div className="space-y-6">
      <Link
        href="/vendor/dashboard/orders"
        className="inline-flex items-center gap-1.5 text-sm text-content-neutral-secondary hover:text-content-neutral-primary"
      >
        <ChevronLeft className="size-4" /> Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-content-neutral-primary">Order #{order.orderId}</h1>
          <p className="mt-0.5 text-sm text-content-neutral-muted">
            {new Date(order.createdAt).toLocaleString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-semibold capitalize",
            order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "cancelled" || order.status === "failed"
                ? "bg-red-100 text-red-700"
                : "bg-primary/10 text-primary"
          )}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      {/* Customer */}
      <div className="rounded-2xl border border-border-muted bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-surface-muted">
            <User className="size-5 text-content-neutral-muted" />
          </div>
          <div>
            <p className="font-semibold text-content-neutral-primary">{order.customerName}</p>
            <p className="text-sm text-content-neutral-secondary">{order.customerPhone}</p>
            <div className="mt-1 flex items-start gap-1.5 text-xs text-content-neutral-muted">
              <MapPin className="mt-0.5 size-3 shrink-0" />
              {order.delivery.address.addressLine1}, {order.delivery.address.city},{" "}
              {order.delivery.address.state}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-border-muted bg-white p-4">
        <h2 className="mb-3 font-semibold text-content-neutral-primary">Items</h2>
        <ul className="divide-y divide-border-muted">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted">
                  <Package className="size-4 text-content-neutral-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-content-neutral-primary">{item.name}</p>
                  <p className="text-xs text-content-neutral-muted">× {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-content-neutral-primary">
                ₦{item.totalPrice.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-border-muted pt-4 text-sm">
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Subtotal</dt>
            <dd>₦{order.pricing.subtotal.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Delivery fee</dt>
            <dd>₦{order.pricing.deliveryFee.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between font-bold text-content-neutral-primary">
            <dt>Total</dt>
            <dd>₦{order.pricing.total.toLocaleString()}</dd>
          </div>
        </dl>
      </div>

      {/* Payment */}
      <div className="flex items-center justify-between rounded-2xl border border-border-muted bg-white px-4 py-3">
        <p className="text-sm text-content-neutral-secondary">Payment</p>
        <div className="flex items-center gap-2">
          <span className="text-sm capitalize text-content-neutral-primary">
            {order.payment.method.replace("_", " ")}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
              order.payment.status === "completed"
                ? "bg-green-100 text-green-700"
                : order.payment.status === "refunded"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
            )}
          >
            {order.payment.status}
          </span>
        </div>
      </div>

      {/* Accept + prep time */}
      {canAccept && (
        <div className="rounded-2xl border border-border-muted bg-white p-4 space-y-3">
          <h2 className="font-semibold text-content-neutral-primary">Accept order</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm text-content-neutral-secondary min-w-max">Prep time (min)</label>
            <input
              type="number"
              min={1}
              max={120}
              value={prepMins}
              onChange={(e) => setPrepMins(Number(e.target.value))}
              className="w-24 rounded-xl border border-border-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-full gap-1.5"
              onClick={() => acceptMut.mutate()}
              disabled={acceptMut.isPending}
            >
              <CheckCircle className="size-4" />
              {acceptMut.isPending ? "Accepting…" : "Accept"}
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-full gap-1.5"
              onClick={() => rejectMut.mutate()}
              disabled={rejectMut.isPending}
            >
              <XCircle className="size-4" />
              {rejectMut.isPending ? "Rejecting…" : "Reject"}
            </Button>
          </div>
        </div>
      )}

      {/* Mark ready */}
      {canMarkReady && (
        <Button
          className="w-full rounded-full gap-1.5 bg-purple-600 hover:bg-purple-700"
          onClick={() => readyMut.mutate()}
          disabled={readyMut.isPending}
        >
          <Clock className="size-4" />
          {readyMut.isPending ? "Updating…" : "Mark order ready"}
        </Button>
      )}

      {/* Assign rider */}
      {canAssignRider && (
        <Button
          variant="outline"
          className="w-full rounded-full gap-1.5"
          onClick={() => setShowAssign(!showAssign)}
        >
          <Bike className="size-4" /> Assign rider
        </Button>
      )}

      {showAssign && (
        <div className="rounded-2xl border border-border-muted bg-white p-4 space-y-3">
          <h2 className="font-semibold text-content-neutral-primary">Available riders</h2>
          {availableRiders.length === 0 ? (
            <p className="text-sm text-content-neutral-muted">No riders online at the moment.</p>
          ) : (
            <div className="space-y-2">
              {availableRiders.map((rider) => (
                <button
                  key={rider._id}
                  type="button"
                  onClick={() => setSelectedRider(rider._id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    selectedRider === rider._id
                      ? "border-primary bg-surface-brand-soft/40"
                      : "border-border-muted hover:bg-surface-muted/50"
                  )}
                >
                  <Bike className="size-5 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-content-neutral-primary">{rider.name}</p>
                    <p className="text-xs text-content-neutral-muted capitalize">
                      {rider.vehicleType} · ⭐ {rider.rating.toFixed(1)}
                    </p>
                  </div>
                  {selectedRider === rider._id && (
                    <CheckCircle className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
          <Button
            className="w-full rounded-full"
            onClick={() => assignMut.mutate()}
            disabled={!selectedRider || assignMut.isPending}
          >
            {assignMut.isPending ? "Assigning…" : "Confirm rider"}
          </Button>
        </div>
      )}

      {/* Timeline */}
      {order.timeline.length > 0 && (
        <div className="rounded-2xl border border-border-muted bg-white p-4">
          <h2 className="mb-3 font-semibold text-content-neutral-primary">Timeline</h2>
          <ol className="space-y-2">
            {[...order.timeline].reverse().map((entry, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium capitalize text-content-neutral-primary">
                    {entry.status.replace(/_/g, " ")}
                  </p>
                  {entry.note && (
                    <p className="text-xs text-content-neutral-muted">{entry.note}</p>
                  )}
                  <p className="text-xs text-content-neutral-muted">
                    {new Date(entry.timestamp).toLocaleString("en-NG", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
