import { apiClient } from "@/services/api/http";
import { PRODUCT_ENDPOINTS } from "@/services/api/endpoints";
import type { VendorProductsResponse, VendorProductDto } from "@/types/vendor-product";

export const vendorProductsQueryKey = ["vendor", "products"] as const;

export const vendorProductDetailQueryKey = (productId: string) =>
  ["vendor", "products", "detail", productId] as const;

export async function fetchVendorProducts(): Promise<VendorProductsResponse> {
  const { data } = await apiClient.get<VendorProductsResponse>(PRODUCT_ENDPOINTS.MINE);
  return data;
}

export interface VendorProductDetailResponse {
  success: boolean;
  data: VendorProductDto & {
    categories?: Array<{ _id: string; name: string }>;
  };
}

export interface UpdateVendorProductPayload {
  name?: string;
  description?: string;
  categoryIds?: string[];
  price?: number;
  cost?: number;
  quantity?: number;
  trackQuantity?: boolean;
  allowOutOfStockPurchase?: boolean;
  lowStockAlert?: number;
  status?: "active" | "inactive" | "out_of_stock";
}

export async function fetchVendorProductById(
  productId: string
): Promise<VendorProductDetailResponse> {
  const { data } = await apiClient.get<VendorProductDetailResponse>(
    PRODUCT_ENDPOINTS.manage(productId)
  );
  return data;
}

export async function updateVendorProduct(
  productId: string,
  payload: UpdateVendorProductPayload
): Promise<{ success: boolean; message: string; data: VendorProductDto }> {
  const { data } = await apiClient.patch(PRODUCT_ENDPOINTS.manage(productId), payload);
  return data;
}
