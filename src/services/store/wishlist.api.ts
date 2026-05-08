import { apiClient } from "@/services/api/http";
import { WISHLIST_ENDPOINTS } from "@/services/api/endpoints";
import type { WishlistAddBody, WishlistListResponse } from "@/types/store-api";

/** Prefix for all wishlist queries (list pages and per-product peek). */
export const WISHLIST_QUERY_KEY_ROOT = ["store", "wishlist"] as const;

export function wishlistPageQueryKey(page: number, limit: number) {
  return [...WISHLIST_QUERY_KEY_ROOT, "page", page, limit] as const;
}

export function wishlistContainsQueryKey(productId: string) {
  return [...WISHLIST_QUERY_KEY_ROOT, "contains", productId] as const;
}

export async function fetchWishlistPage(
  page: number,
  limit: number
): Promise<WishlistListResponse> {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const { data } = await apiClient.get<WishlistListResponse>(
    `${WISHLIST_ENDPOINTS.LIST}?${searchParams.toString()}`
  );
  return data;
}

export async function addWishlistItem(
  body: WishlistAddBody
): Promise<{ success?: boolean; message?: string }> {
  const { data } = await apiClient.post<{ success?: boolean; message?: string }>(
    WISHLIST_ENDPOINTS.LIST,
    body
  );
  return data;
}

export async function removeWishlistItem(
  productId: string
): Promise<{ success?: boolean; message?: string }> {
  const { data } = await apiClient.delete<{
    success?: boolean;
    message?: string;
  }>(WISHLIST_ENDPOINTS.item(productId));
  return data;
}
