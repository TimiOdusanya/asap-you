import { apiClient } from "@/services/api/http";
import { VENDOR_ENDPOINTS } from "@/services/api/endpoints";
import type {
  CreateVendorProductCategoriesPayload,
  VendorProductCategoriesResponse,
} from "@/types/vendor-product-category";

export const vendorProductCategoriesQueryKey = ["vendor", "product-categories"] as const;

export async function fetchVendorProductCategories(): Promise<VendorProductCategoriesResponse> {
  const { data } = await apiClient.get<VendorProductCategoriesResponse>(
    VENDOR_ENDPOINTS.MY_PRODUCT_CATEGORIES
  );
  return data;
}

export async function createVendorProductCategories(
  payload: CreateVendorProductCategoriesPayload
): Promise<VendorProductCategoriesResponse> {
  const { data } = await apiClient.post<VendorProductCategoriesResponse>(
    VENDOR_ENDPOINTS.MY_PRODUCT_CATEGORIES,
    payload
  );
  return data;
}
