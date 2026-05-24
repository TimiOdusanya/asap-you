import type { OrderStatus } from "@/types/order";

export const COMPLETED_ORDER_STATUSES: OrderStatus[] = [
  "delivered",
  "cancelled",
  "failed",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
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

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200/80",
  confirmed: "bg-blue-100 text-blue-800 ring-blue-200/80",
  preparing: "bg-orange-100 text-orange-800 ring-orange-200/80",
  ready_for_pickup: "bg-violet-100 text-violet-800 ring-violet-200/80",
  picked_up: "bg-indigo-100 text-indigo-800 ring-indigo-200/80",
  on_the_way: "bg-cyan-100 text-cyan-800 ring-cyan-200/80",
  arrived: "bg-teal-100 text-teal-800 ring-teal-200/80",
  delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200/80",
  cancelled: "bg-red-100 text-red-800 ring-red-200/80",
  failed: "bg-red-100 text-red-800 ring-red-200/80",
};

export const ORDER_PROGRESS: Record<OrderStatus, number> = {
  pending: 10,
  confirmed: 22,
  preparing: 34,
  ready_for_pickup: 46,
  picked_up: 58,
  on_the_way: 72,
  arrived: 86,
  delivered: 100,
  cancelled: 0,
  failed: 0,
};

export function isOngoingOrderStatus(status: OrderStatus): boolean {
  return !COMPLETED_ORDER_STATUSES.includes(status);
}

export function isLiveDeliveryStatus(status: OrderStatus): boolean {
  return ["picked_up", "on_the_way", "arrived"].includes(status);
}
