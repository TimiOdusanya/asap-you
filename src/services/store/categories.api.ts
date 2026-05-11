import { apiClient } from "@/services/api/http";
import { CATEGORY_ENDPOINTS } from "@/services/api/endpoints";
import type { CategoryListResponse } from "@/types/store-api";

export const STORE_CATEGORIES_QUERY_KEY = ["store", "categories"] as const;

export async function fetchStoreCategories(): Promise<CategoryListResponse> {
  const { data } = await apiClient.get<CategoryListResponse>(CATEGORY_ENDPOINTS.LIST);
  return data;
}
