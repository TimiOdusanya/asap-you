import { apiClient } from "@/services/api/http";
import { ORDER_ENDPOINTS } from "@/services/api/endpoints";
import type {
  CheckoutPayload,
  CheckoutResponse,
  OrderDetailResponse,
  OrderListResponse,
  OrderTrackResponse,
  VerifyPaymentResponse,
} from "@/types/order";

export const myOrdersQueryKey = (status?: string) =>
  ["orders", "mine", status ?? "all"] as const;

export const orderDetailQueryKey = (orderId: string) =>
  ["orders", "detail", orderId] as const;

export const orderTrackQueryKey = (orderId: string) =>
  ["orders", "track", orderId] as const;

export const recentOrdersQueryKey = ["orders", "recent"] as const;

export async function checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  const { data } = await apiClient.post<CheckoutResponse>(ORDER_ENDPOINTS.CHECKOUT, payload);
  return data;
}

export async function verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
  const { data } = await apiClient.get<VerifyPaymentResponse>(ORDER_ENDPOINTS.VERIFY_PAYMENT, {
    params: { reference },
  });
  return data;
}

export async function fetchMyOrders(
  page = 1,
  limit = 10,
  status?: string
): Promise<OrderListResponse> {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  const { data } = await apiClient.get<OrderListResponse>(ORDER_ENDPOINTS.MY_ORDERS, { params });
  return data;
}

export async function fetchOrderById(orderId: string): Promise<OrderDetailResponse> {
  const { data } = await apiClient.get<OrderDetailResponse>(ORDER_ENDPOINTS.byId(orderId));
  return data;
}

export async function trackOrder(orderId: string): Promise<OrderTrackResponse> {
  const { data } = await apiClient.get<OrderTrackResponse>(ORDER_ENDPOINTS.track(orderId));
  return data;
}

export async function fetchConfirmationCode(
  orderId: string
): Promise<{ success: boolean; data: { orderId: string; confirmationCode: string; message: string } }> {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.confirmationCode(orderId));
  return data;
}

export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post(ORDER_ENDPOINTS.cancel(orderId));
  return data;
}
