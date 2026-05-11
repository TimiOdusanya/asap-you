import { apiClient } from "@/services/api/http";
import { PRODUCT_ENDPOINTS } from "@/services/api/endpoints";
import type {
  ProductCatalogListResponse,
  ProductCatalogQuery,
  ProductDto,
  ProductListResponse,
} from "@/types/store-api";

export const vendorProductsQueryKey = (vendorId: string) =>
  ["products", "vendor", vendorId] as const;

const LIST_PAGE_LIMIT = 100;

export function productCatalogQueryKey(base: Omit<ProductCatalogQuery, "page">) {
  return ["products", "catalog", base] as const;
}

function appendCatalogParams(sp: URLSearchParams, q: ProductCatalogQuery) {
  sp.set("page", String(q.page));
  sp.set("limit", String(q.limit));
  if (q.status) sp.set("status", q.status);
  if (q.vendorId) sp.set("vendorId", q.vendorId);
  if (q.vendorCategories) sp.set("vendorCategories", q.vendorCategories);
  if (q.discountOnly === true) sp.set("discountOnly", "true");
  if (q.discountOnly === false) sp.set("discountOnly", "false");
  if (q.minRating != null && !Number.isNaN(q.minRating)) {
    sp.set("minRating", String(q.minRating));
  }
  if (q.priceMin != null && !Number.isNaN(q.priceMin)) {
    sp.set("priceMin", String(q.priceMin));
  }
  if (q.priceMax != null && !Number.isNaN(q.priceMax)) {
    sp.set("priceMax", String(q.priceMax));
  }
  if (q.sort) sp.set("sort", q.sort);
  if (q.search) sp.set("search", q.search);
  if (q.categoryIds) sp.set("categoryIds", q.categoryIds);
}

export async function fetchProductCatalog(
  q: ProductCatalogQuery
): Promise<ProductCatalogListResponse> {
  const sp = new URLSearchParams();
  appendCatalogParams(sp, q);
  const { data } = await apiClient.get<ProductCatalogListResponse>(
    `${PRODUCT_ENDPOINTS.ALL}?${sp.toString()}`
  );
  return data;
}

export async function fetchProductsForVendor(
  vendorId: string
): Promise<ProductDto[]> {
  const searchParams = new URLSearchParams({
    page: "1",
    limit: String(LIST_PAGE_LIMIT),
    status: "active",
    vendorId,
  });
  const { data } = await apiClient.get<ProductListResponse>(
    `${PRODUCT_ENDPOINTS.ALL}?${searchParams.toString()}`
  );
  if (!data.success || !Array.isArray(data.data)) return [];
  return data.data.filter((p) => p.vendorId === vendorId && p.isActive);
}
