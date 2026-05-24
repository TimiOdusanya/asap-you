import { apiClient } from "@/services/api/http";
import { VENDOR_ORDER_ENDPOINTS } from "@/services/api/endpoints";
import type {
  AvailableRidersResponse,
  OrderDetailResponse,
  OrderListResponse,
  OrderTrackResponse,
} from "@/types/order";

export const vendorOrdersQueryKey = (status?: string) =>
  ["vendor", "orders", status ?? "all"] as const;

export const vendorOrderDetailQueryKey = (orderId: string) =>
  ["vendor", "orders", "detail", orderId] as const;

export const availableRidersQueryKey = ["vendor", "available-riders"] as const;

export async function fetchVendorOrders(
  page = 1,
  limit = 20,
  status?: string
): Promise<OrderListResponse> {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  const { data } = await apiClient.get<OrderListResponse>(VENDOR_ORDER_ENDPOINTS.LIST, { params });
  return data;
}

export async function fetchVendorOrderById(orderId: string): Promise<OrderDetailResponse> {
  const { data } = await apiClient.get<OrderDetailResponse>(
    VENDOR_ORDER_ENDPOINTS.byId(orderId)
  );
  return data;
}

export async function acceptOrder(
  orderId: string,
  estimatedPrepTime?: number
): Promise<{ success: boolean; message: string; data: unknown }> {
  const { data } = await apiClient.patch(VENDOR_ORDER_ENDPOINTS.accept(orderId), {
    estimatedPrepTime,
  });
  return data;
}

export async function rejectOrder(
  orderId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(VENDOR_ORDER_ENDPOINTS.reject(orderId), { reason });
  return data;
}

export async function markOrderReady(
  orderId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(VENDOR_ORDER_ENDPOINTS.ready(orderId));
  return data;
}

export async function assignRider(
  orderId: string,
  riderId: string
): Promise<{ success: boolean; message: string; data: unknown }> {
  const { data } = await apiClient.patch(VENDOR_ORDER_ENDPOINTS.assignRider(orderId), { riderId });
  return data;
}

export async function fetchVendorOrderTrack(orderId: string): Promise<OrderTrackResponse> {
  const { data } = await apiClient.get<OrderTrackResponse>(VENDOR_ORDER_ENDPOINTS.track(orderId));
  return data;
}

export async function fetchAvailableRiders(): Promise<AvailableRidersResponse> {
  const { data } = await apiClient.get<AvailableRidersResponse>(
    VENDOR_ORDER_ENDPOINTS.AVAILABLE_RIDERS
  );
  return data;
}
