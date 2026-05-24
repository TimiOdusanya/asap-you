import type { Delivery } from "@/components/rider/dashboard/rider-delivery-table";
import type { OrderDto, OrderStatus, RiderActiveDeliveryData } from "@/types/order";

export const ACTIVE_DELIVERY_STATUSES: OrderStatus[] = [
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "picked_up",
  "on_the_way",
  "arrived",
];

export function isActiveDeliveryStatus(status: OrderStatus): boolean {
  return ACTIVE_DELIVERY_STATUSES.includes(status);
}

export function formatRiderMoney(amount: number, currency = "NGN"): string {
  if (currency === "NGN") return `₦${amount.toLocaleString("en-NG")}`;
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatOrderAddress(
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
  } | null
): string {
  if (!address) return "—";
  return [address.addressLine1, address.addressLine2, address.city, address.state]
    .filter(Boolean)
    .join(", ");
}

export function formatOrderStatusLabel(status: OrderStatus): string {
  return status.replace(/_/g, " ");
}

export function orderItemCountLabel(count: number): string {
  return `${count} item${count === 1 ? "" : "s"}`;
}

export function riderEarningFromOrder(order: OrderDto): number {
  return order.pricing.deliveryFee;
}

export function mapOrderToDeliveryRow(order: OrderDto): Delivery {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const eta = order.delivery.estimatedDeliveryTime
    ? new Date(order.delivery.estimatedDeliveryTime).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return {
    orderId: order.orderId,
    customer: order.customerName,
    address: formatOrderAddress(order.delivery.address),
    dropOff: formatOrderAddress(order.delivery.address),
    items: orderItemCountLabel(itemCount),
    eta,
    priority: "Medium",
    status: formatOrderStatusLabel(order.status),
    earnings: riderEarningFromOrder(order),
    date: new Date(order.createdAt).toLocaleDateString("en-NG"),
  };
}

export function mapActiveDeliveryToRow(delivery: RiderActiveDeliveryData): Delivery {
  const itemCount = delivery.items.reduce((sum, item) => sum + item.quantity, 0);
  const eta = delivery.delivery.estimatedDeliveryTime
    ? new Date(delivery.delivery.estimatedDeliveryTime).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return {
    orderId: delivery.orderId,
    customer: delivery.customer.name,
    address: formatOrderAddress(delivery.delivery.address),
    dropOff: formatOrderAddress(delivery.delivery.address),
    items: orderItemCountLabel(itemCount),
    eta,
    priority: "High",
    status: formatOrderStatusLabel(delivery.status),
  };
}

export function buildPaginationPages(currentPage: number, totalPages: number): (number | null)[] {
  if (totalPages <= 1) return [1];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);
  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
  }
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | null)[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push(null);
    result.push(sorted[i]);
  }
  return result;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

export function sumDeliveredEarnings(orders: OrderDto[], from: Date): number {
  return orders
    .filter((o) => o.status === "delivered" && new Date(o.updatedAt) >= from)
    .reduce((sum, o) => sum + riderEarningFromOrder(o), 0);
}

export function countDeliveredSince(orders: OrderDto[], from: Date): number {
  return orders.filter(
    (o) => o.status === "delivered" && new Date(o.updatedAt) >= from
  ).length;
}

export function weeklyEarningsChartData(orders: OrderDto[]): { day: string; amount: number }[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekStart = startOfWeek(new Date());
  const buckets = days.map((day, index) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const amount = orders
      .filter((o) => {
        if (o.status !== "delivered") return false;
        const at = new Date(o.updatedAt);
        return at >= dayStart && at < dayEnd;
      })
      .reduce((sum, o) => sum + riderEarningFromOrder(o), 0);

    return { day, amount };
  });
  return buckets;
}
