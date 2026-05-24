import { apiClient } from "@/services/api/http";
import { VENDOR_ENDPOINTS } from "@/services/api/endpoints";
import type {
  UpdateVendorSettingsPayload,
  VendorSettingsResponse,
} from "@/types/vendor-settings";

export const vendorSettingsQueryKey = ["vendor", "settings"] as const;

export async function fetchVendorSettings(): Promise<VendorSettingsResponse> {
  const { data } = await apiClient.get<VendorSettingsResponse>(VENDOR_ENDPOINTS.ME);
  return data;
}

export async function updateVendorSettings(
  payload: UpdateVendorSettingsPayload
): Promise<VendorSettingsResponse> {
  const { data } = await apiClient.patch<VendorSettingsResponse>(
    VENDOR_ENDPOINTS.ME,
    payload
  );
  return data;
}
