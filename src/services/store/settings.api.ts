import { apiClient } from "@/services/api/http";
import { SETTINGS_ENDPOINTS } from "@/services/api/endpoints";

export const STORE_SETTINGS_QUERY_KEY = ["store", "settings"] as const;

export interface StoreSettingsDto {
  deliveryFee: number;
  serviceChargeRate: number;
  serviceChargePercent: string;
  minOrderAmount: number;
  maxDeliveryDistance: number;
  currency: string;
}

export interface StoreSettingsResponse {
  success: boolean;
  data: StoreSettingsDto;
}

export async function fetchStoreSettings(): Promise<StoreSettingsResponse> {
  const { data } = await apiClient.get<StoreSettingsResponse>(SETTINGS_ENDPOINTS.GET);
  return data;
}
