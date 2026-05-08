import { apiClient } from "@/services/api/http";
import { VENDOR_ENDPOINTS } from "@/services/api/endpoints";
import type { VendorListResponse } from "@/types/store-api";

export const VENDORS_PAGE_LIMIT = 10;

export const STORE_VENDOR_CATEGORY_SLUGS = [
  "supermarket",
  "restaurant",
  "drinks",
  "pharmacy",
  "gas_station",
  "bakery",
  "electronics",
  "fashion",
] as const;

export type StoreVendorCategorySlug = (typeof STORE_VENDOR_CATEGORY_SLUGS)[number];

export function vendorsListQueryKey(categorySlug: string | null) {
  return ["vendors", "list", categorySlug ?? "all"] as const;
}

export async function fetchVendorsPage(params: {
  page: number;
  limit?: number;
  category?: string | null;
}): Promise<VendorListResponse> {
  const limit = params.limit ?? VENDORS_PAGE_LIMIT;
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(limit),
  });
  if (params.category) {
    searchParams.set("categories", params.category);
  }
  const { data } = await apiClient.get<VendorListResponse>(
    `${VENDOR_ENDPOINTS.LIST}?${searchParams.toString()}`
  );
  return data;
}
