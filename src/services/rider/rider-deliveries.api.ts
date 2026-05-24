import { apiClient } from "@/services/api/http";
import { RIDER_DELIVERY_ENDPOINTS } from "@/services/api/endpoints";
import type {
  OrderDetailResponse,
  OrderListResponse,
  OrderTrackResponse,
  RiderActiveDeliveryResponse,
} from "@/types/order";

export const riderProfileQueryKey = ["rider", "profile"] as const;

export const riderDeliveriesQueryKey = (page: number, limit: number, status?: string) =>
  ["rider", "deliveries", page, limit, status ?? "all"] as const;

export const riderActiveDeliveryQueryKey = ["rider", "deliveries", "active"] as const;

export const riderDeliveryDetailQueryKey = (orderId: string) =>
  ["rider", "deliveries", "detail", orderId] as const;

export interface RiderUserRef {
  _id: string;
  email: string;
  phone: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface RiderProfileData {
  _id: string;
  userId: RiderUserRef | string;
  vehicleType: string;
  license: string;
  status: string;
  stats: {
    totalDeliveries: number;
    completedDeliveries: number;
    averageRating: number;
    totalEarnings: number;
    onlineHours?: number;
  };
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    bankCode?: string;
    accountHolderName: string;
    isVerified?: boolean;
  };
  settings?: {
    autoAcceptOrders: boolean;
    maxDeliveryDistance: number;
  };
  location?: {
    coordinates: { lat: number; lng: number };
    lastUpdated: string;
    heading?: number;
    speed?: number;
  };
}

export interface RiderProfileResponse {
  success: boolean;
  data: RiderProfileData;
}

export async function fetchRiderProfile(): Promise<RiderProfileResponse> {
  const { data } = await apiClient.get<RiderProfileResponse>(RIDER_DELIVERY_ENDPOINTS.PROFILE);
  return data;
}

export async function goOnline(): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post(RIDER_DELIVERY_ENDPOINTS.GO_ONLINE);
  return data;
}

export async function goOffline(): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post(RIDER_DELIVERY_ENDPOINTS.GO_OFFLINE);
  return data;
}

export async function updateRiderLocation(coords: {
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
}): Promise<{ success: boolean }> {
  const { data } = await apiClient.post(RIDER_DELIVERY_ENDPOINTS.LOCATION, coords);
  return data;
}

export async function fetchRiderDeliveries(
  page = 1,
  limit = 10,
  status?: string
): Promise<OrderListResponse> {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  const { data } = await apiClient.get<OrderListResponse>(RIDER_DELIVERY_ENDPOINTS.DELIVERIES, {
    params,
  });
  return data;
}

export async function fetchActiveDelivery(): Promise<RiderActiveDeliveryResponse> {
  const { data } = await apiClient.get<RiderActiveDeliveryResponse>(
    RIDER_DELIVERY_ENDPOINTS.ACTIVE
  );
  return data;
}

export async function fetchRiderOrderById(orderId: string): Promise<OrderDetailResponse> {
  const { data } = await apiClient.get<OrderDetailResponse>(
    RIDER_DELIVERY_ENDPOINTS.byId(orderId)
  );
  return data;
}

export async function fetchRiderTrack(orderId: string): Promise<OrderTrackResponse> {
  const { data } = await apiClient.get<OrderTrackResponse>(
    RIDER_DELIVERY_ENDPOINTS.track(orderId)
  );
  return data;
}

export async function pickUpOrder(
  orderId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(RIDER_DELIVERY_ENDPOINTS.pickUp(orderId));
  return data;
}

export async function markOnTheWay(
  orderId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(RIDER_DELIVERY_ENDPOINTS.onTheWay(orderId));
  return data;
}

export async function markArrived(
  orderId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(RIDER_DELIVERY_ENDPOINTS.arrived(orderId));
  return data;
}

export async function confirmDelivery(
  orderId: string,
  confirmationCode: string
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const { data } = await apiClient.post(RIDER_DELIVERY_ENDPOINTS.confirm(orderId), {
    confirmationCode,
  });
  return data;
}
