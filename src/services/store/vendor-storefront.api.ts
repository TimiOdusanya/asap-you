import { apiClient } from "@/services/api/http";
import { VENDOR_ENDPOINTS } from "@/services/api/endpoints";
import type { VendorStorefrontResponse } from "@/types/store-api";

export function vendorStorefrontInfiniteQueryKey(
  vendorId: string,
  categoryId: string | undefined
) {
  return ["vendor", "storefront", vendorId, categoryId ?? "__default__"] as const;
}

export async function fetchVendorStorefront(params: {
  vendorId: string;
  categoryId?: string;
  page: number;
  limit?: number;
}): Promise<VendorStorefrontResponse> {
  const limit = params.limit ?? 20;
  const sp = new URLSearchParams({
    page: String(params.page),
    limit: String(limit),
  });
  if (params.categoryId) {
    sp.set("categoryId", params.categoryId);
  }
  const { data } = await apiClient.get<VendorStorefrontResponse>(
    `${VENDOR_ENDPOINTS.storefront(params.vendorId)}?${sp.toString()}`
  );
  return data;
}
