import { apiClient } from "@/services/api/http";
import { VENDOR_ENDPOINTS } from "@/services/api/endpoints";
import type { VendorListItem, VendorListResponse } from "@/types/store-api";
import { VENDORS_PAGE_LIMIT, fetchVendorsPage } from "@/services/store/vendors.api";

export const vendorDetailQueryKey = (vendorId: string) =>
  ["vendor", "detail", vendorId] as const;

export interface VendorDetailResponse {
  success: boolean;
  data: VendorListItem;
}

async function findVendorInListPages(
  vendorId: string,
  maxPages: number
): Promise<VendorListItem | null> {
  for (let page = 1; page <= maxPages; page++) {
    const res: VendorListResponse = await fetchVendorsPage({
      page,
      limit: VENDORS_PAGE_LIMIT,
      category: null,
    });
    if (!res.success || !Array.isArray(res.data)) return null;
    const hit = res.data.find((v) => v._id === vendorId);
    if (hit) return hit;
    if (!res.pagination || page >= res.pagination.totalPages) break;
  }
  return null;
}

export async function fetchVendorById(
  vendorId: string
): Promise<VendorListItem | null> {
  try {
    const { data } = await apiClient.get<VendorDetailResponse>(
      VENDOR_ENDPOINTS.byId(vendorId)
    );
    if (data?.success && data.data) return data.data;
  } catch {
    /* single-vendor GET may not exist; fall back to list scan */
  }
  return findVendorInListPages(vendorId, 8);
}
