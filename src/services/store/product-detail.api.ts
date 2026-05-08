import { apiClient } from "@/services/api/http";
import { PRODUCT_ENDPOINTS } from "@/services/api/endpoints";
import type { ProductDetailResponse } from "@/types/store-api";

export const PRODUCT_DETAIL_SIMILAR_DEFAULT = 4;

export function productDetailQueryKey(
  productId: string,
  similarLimit: number
) {
  return ["product", "detail", productId, similarLimit] as const;
}

export async function fetchProductDetail(
  productId: string,
  similarLimit = PRODUCT_DETAIL_SIMILAR_DEFAULT
): Promise<ProductDetailResponse> {
  const searchParams = new URLSearchParams({
    similarLimit: String(similarLimit),
  });
  const { data } = await apiClient.get<ProductDetailResponse>(
    `${PRODUCT_ENDPOINTS.byId(productId)}?${searchParams.toString()}`
  );
  return data;
}
