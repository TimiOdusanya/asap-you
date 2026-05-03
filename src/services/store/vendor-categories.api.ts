import { apiClient } from "@/services/api/http";
import { VENDOR_ENDPOINTS } from "@/services/api/endpoints";
import type { VendorCategoryListResponse } from "@/types/store-api";

export const VENDOR_CATEGORIES_QUERY_KEY = ["vendor", "categories"] as const;

export async function fetchVendorCategories(): Promise<VendorCategoryListResponse> {
  const { data } = await apiClient.get<VendorCategoryListResponse>(
    VENDOR_ENDPOINTS.CATEGORIES
  );
  return data;
}
