"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Bike,
  User,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  fetchVendorOrders,
  acceptOrder,
  rejectOrder,
  markOrderReady,
  assignRider,
  fetchAvailableRiders,
  vendorOrdersQueryKey,
  availableRidersQueryKey,
} from "@/services/vendor/vendor-orders.api";
import { vendorProductsQueryKey } from "@/services/vendor/vendor-products.api";
import type { OrderDto, OrderStatus, AvailableRiderDto } from "@/types/order";
import { cn } from "@/lib/utils";
import { VendorOrdersSkeleton } from "./vendor-dashboard-skeleton";

const STATUS_SECTIONS: { status: OrderStatus; label: string; color: string }[] = [
  { status: "pending", label: "New Orders", color: "text-yellow-700" },
  { status: "confirmed", label: "Confirmed", color: "text-blue-700" },
  { status: "preparing", label: "Preparing", color: "text-orange-700" },
  { status: "ready_for_pickup", label: "Ready for Pickup", color: "text-purple-700" },
  { status: "picked_up", label: "Picked Up", color: "text-indigo-700" },
  { status: "on_the_way", label: "On the Way", color: "text-cyan-700" },
  { status: "delivered", label: "Delivered", color: "text-green-700" },
  { status: "cancelled", label: "Cancelled", color: "text-red-700" },
];

const STATUS_BG: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 border-yellow-200",
  confirmed: "bg-blue-50 border-blue-200",
  preparing: "bg-orange-50 border-orange-200",
  ready_for_pickup: "bg-purple-50 border-purple-200",
  picked_up: "bg-indigo-50 border-indigo-200",
  on_the_way: "bg-cyan-50 border-cyan-200",
  arrived: "bg-teal-50 border-teal-200",
  delivered: "bg-green-50 border-green-200",
  cancelled: "bg-red-50 border-red-200",
  failed: "bg-red-50 border-red-200",
};

function PrepTimeDialog({
  orderId,
  onConfirm,
  onCancel,
  isPending,
}: {
  orderId: string;
  onConfirm: (mins: number) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [mins, setMins] = React.useState(15);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-content-neutral-primary">Accept order</h3>
        <p className="mt-1 text-sm text-content-neutral-secondary">
          Order #{orderId} — set estimated preparation time.
        </p>
        <div className="mt-4 space-y-2">
          <label htmlFor="prep-time" className="block text-sm font-medium text-content-neutral-primary">
            Prep time (minutes)
          </label>
          <input
            id="prep-time"
            type="number"
            min={1}
            max={120}
            value={mins}
            onChange={(e) => setMins(Number(e.target.value))}
            className="w-full rounded-xl border border-border-muted px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="mt-5 flex gap-3">
          <Button
            className="flex-1 rounded-full"
            onClick={() => onConfirm(mins)}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Confirm"}
          </Button>
          <Button variant="outline" className="flex-1 rounded-full" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssignRiderDialog({
  orderId,
  onConfirm,
  onCancel,
}: {
  orderId: string;
  onConfirm: (riderId: string) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const { data, isPending } = useQuery({
    queryKey: availableRidersQueryKey,
    queryFn: fetchAvailableRiders,
  });
  const riders: AvailableRiderDto[] = data?.data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-content-neutral-primary">Assign rider</h3>
        <p className="mt-1 text-sm text-content-neutral-secondary">
          Order #{orderId} — choose an available rider.
        </p>
        <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
          {isPending ? (
            <Loader2 className="mx-auto size-6 animate-spin text-primary" />
          ) : riders.length === 0 ? (
            <p className="text-center text-sm text-content-neutral-muted">No riders online</p>
          ) : (
            riders.map((rider) => (
              <button
                key={rider._id}
                type="button"
                onClick={() => setSelected(rider._id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors",
                  selected === rider._id
                    ? "border-primary bg-surface-brand-soft/40"
                    : "border-border-muted hover:bg-surface-muted/50"
                )}
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                  <Bike className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-content-neutral-primary">{rider.name}</p>
                  <p className="text-xs text-content-neutral-muted capitalize">
                    {rider.vehicleType} · ⭐ {rider.rating.toFixed(1)} · {rider.totalDeliveries} deliveries
                  </p>
                </div>
                {selected === rider._id && (
                  <CheckCircle className="size-4 shrink-0 text-primary" />
                )}
              </button>
            ))
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <Button
            className="flex-1 rounded-full"
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected}
          >
            Assign
          </Button>
          <Button variant="outline" className="flex-1 rounded-full" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderDto }) {
  const queryClient = useQueryClient();
  const [showPrepDialog, setShowPrepDialog] = React.useState(false);
  const [showRiderDialog, setShowRiderDialog] = React.useState(false);

  const acceptMut = useMutation({
    mutationFn: (mins: number) => acceptOrder(order.orderId, mins),
    onSuccess: () => {
      toast.success(`Order #${order.orderId} accepted`);
      queryClient.invalidateQueries({ queryKey: vendorOrdersQueryKey() });
      queryClient.invalidateQueries({ queryKey: vendorProductsQueryKey });
      setShowPrepDialog(false);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? "Failed to accept order");
    },
  });

  const rejectMut = useMutation({
    mutationFn: () => rejectOrder(order.orderId),
    onSuccess: () => {
      toast.success(`Order #${order.orderId} rejected`);
      queryClient.invalidateQueries({ queryKey: vendorOrdersQueryKey() });
    },
    onError: () => toast.error("Failed to reject order"),
  });

  const readyMut = useMutation({
    mutationFn: () => markOrderReady(order.orderId),
    onSuccess: () => {
      toast.success(`Order #${order.orderId} marked ready`);
      queryClient.invalidateQueries({ queryKey: vendorOrdersQueryKey() });
    },
    onError: () => toast.error("Failed to mark order ready"),
  });

  const assignMut = useMutation({
    mutationFn: (riderId: string) => assignRider(order.orderId, riderId),
    onSuccess: () => {
      toast.success("Rider assigned successfully");
      queryClient.invalidateQueries({ queryKey: vendorOrdersQueryKey() });
      setShowRiderDialog(false);
    },
    onError: () => toast.error("Failed to assign rider"),
  });

  const firstItem = order.items[0];
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border p-4 transition-shadow hover:shadow-sm",
          STATUS_BG[order.status]
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-content-neutral-primary">#{order.orderId}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                  order.payment.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {order.payment.status === "completed" ? "Paid" : "Unpaid"}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-content-neutral-secondary">
              <User className="size-3" />
              <span>
                {order.customerName} · {order.customerPhone}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-content-neutral-muted">
              {order.delivery.address.addressLine1}, {order.delivery.address.city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-content-neutral-primary">
              ₦{order.pricing.total.toLocaleString()}
            </p>
            <p className="text-xs text-content-neutral-muted">
              {new Date(order.createdAt).toLocaleTimeString("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-3 flex items-center gap-2">
          {firstItem?.image ? (
            <Image
              src={firstItem.image}
              alt={firstItem.name}
              width={36}
              height={36}
              className="size-9 rounded-lg object-cover"
              unoptimized
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/60">
              <Package className="size-4 text-content-neutral-muted" />
            </div>
          )}
          <p className="min-w-0 flex-1 truncate text-sm text-content-neutral-secondary">
            {firstItem?.name}
            {itemCount > 1 ? ` +${itemCount - 1} more item${itemCount - 1 === 1 ? "" : "s"}` : ""}
          </p>
          <Link
            href={`/vendor/dashboard/orders/${order.orderId}`}
            className="flex items-center gap-1 text-xs text-content-link hover:underline"
          >
            Details <ChevronRight className="size-3" />
          </Link>
        </div>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {order.status === "pending" || order.status === "confirmed" ? (
            <>
              <Button
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => setShowPrepDialog(true)}
                disabled={acceptMut.isPending}
              >
                <CheckCircle className="size-3.5" /> Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-full gap-1.5"
                onClick={() => rejectMut.mutate()}
                disabled={rejectMut.isPending}
              >
                <XCircle className="size-3.5" />
                {rejectMut.isPending ? "Rejecting…" : "Reject"}
              </Button>
            </>
          ) : null}

          {order.status === "preparing" ? (
            <Button
              size="sm"
              className="rounded-full gap-1.5 bg-purple-600 hover:bg-purple-700"
              onClick={() => readyMut.mutate()}
              disabled={readyMut.isPending}
            >
              <Clock className="size-3.5" />
              {readyMut.isPending ? "Updating…" : "Mark ready"}
            </Button>
          ) : null}

          {(order.status === "confirmed" ||
            order.status === "preparing" ||
            order.status === "ready_for_pickup") &&
          !order.riderId ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full gap-1.5"
              onClick={() => setShowRiderDialog(true)}
            >
              <Bike className="size-3.5" /> Assign rider
            </Button>
          ) : null}

          {order.riderId && order.status !== "delivered" && order.status !== "cancelled" && (
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Bike className="size-3" /> Rider assigned
            </span>
          )}
        </div>
      </div>

      {showPrepDialog && (
        <PrepTimeDialog
          orderId={order.orderId}
          onConfirm={(mins) => acceptMut.mutate(mins)}
          onCancel={() => setShowPrepDialog(false)}
          isPending={acceptMut.isPending}
        />
      )}

      {showRiderDialog && (
        <AssignRiderDialog
          orderId={order.orderId}
          onConfirm={(riderId) => assignMut.mutate(riderId)}
          onCancel={() => setShowRiderDialog(false)}
        />
      )}
    </>
  );
}

function OrderSection({
  status,
  label,
  color,
  orders,
}: {
  status: OrderStatus;
  label: string;
  color: string;
  orders: OrderDto[];
}) {
  if (orders.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className={cn("text-base font-semibold", color)}>{label}</h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-content-neutral-secondary border border-border-muted">
          {orders.length}
        </span>
      </div>
      <div className="space-y-3">
        {orders.map((o) => (
          <OrderCard key={o._id} order={o} />
        ))}
      </div>
    </section>
  );
}

export function VendorOrders() {
  const { data, isPending, isError } = useQuery({
    queryKey: vendorOrdersQueryKey(),
    queryFn: () => fetchVendorOrders(1, 50),
    refetchInterval: 30_000,
  });

  const orders: OrderDto[] = data?.data ?? [];

  const grouped = React.useMemo(() => {
    const map: Partial<Record<OrderStatus, OrderDto[]>> = {};
    for (const o of orders) {
      if (!map[o.status]) map[o.status] = [];
      map[o.status]!.push(o);
    }
    return map;
  }, [orders]);

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled", "failed"].includes(o.status)
  );

  if (isPending) {
    return <VendorOrdersSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertCircle className="size-10 text-red-400" />
        <p className="font-semibold text-content-neutral-primary">Failed to load orders</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="New orders from customers will appear here in real time."
      />
    );
  }

  return (
    <div className="space-y-8">
      {activeOrders.length === 0 && (
        <p className="text-sm text-content-neutral-muted">No active orders right now.</p>
      )}

      {STATUS_SECTIONS.map(({ status, label, color }) => (
        <OrderSection
          key={status}
          status={status}
          label={label}
          color={color}
          orders={grouped[status] ?? []}
        />
      ))}
    </div>
  );
}
