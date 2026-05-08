import { apiClient } from "@/services/api/http";
import { CART_ENDPOINTS } from "@/services/api/endpoints";
import type {
  CartAddBody,
  CartAddResponse,
  CartClearResponse,
  CartGetResponse,
  CartRemoveResponse,
  CartUpdateBody,
  CartUpdateResponse,
} from "@/types/store-api";

export const CART_QUERY_KEY = ["store", "cart"] as const;

export async function fetchCart(): Promise<CartGetResponse> {
  const { data } = await apiClient.get<CartGetResponse>(CART_ENDPOINTS.GET);
  return data;
}

export async function addToCart(body: CartAddBody): Promise<CartAddResponse> {
  const { data } = await apiClient.post<CartAddResponse>(
    CART_ENDPOINTS.ADD,
    body
  );
  return data;
}

export async function updateCartItem(
  productId: string,
  body: CartUpdateBody
): Promise<CartUpdateResponse> {
  const { data } = await apiClient.patch<CartUpdateResponse>(
    CART_ENDPOINTS.item(productId),
    body
  );
  return data;
}

export async function removeCartItem(
  productId: string
): Promise<CartRemoveResponse> {
  const { data } = await apiClient.delete<CartRemoveResponse>(
    CART_ENDPOINTS.item(productId)
  );
  return data;
}

export async function clearCart(): Promise<CartClearResponse> {
  const { data } = await apiClient.delete<CartClearResponse>(
    CART_ENDPOINTS.CLEAR
  );
  return data;
}
