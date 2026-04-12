import { apiClient } from "@/services/api/http";
import { ADDRESS_ENDPOINTS } from "@/services/api/endpoints";
import type {
  CreateAddressRequestBody,
  CreateAddressResponseBody,
  ListAddressesResponseBody,
} from "@/services/address/address.types";

export const ADDRESS_LIST_QUERY_KEY = ["addresses"] as const;

export async function listAddresses(): Promise<ListAddressesResponseBody> {
  const { data } = await apiClient.get<ListAddressesResponseBody>(
    ADDRESS_ENDPOINTS.LIST
  );
  return data;
}

export async function createAddress(
  body: CreateAddressRequestBody
): Promise<CreateAddressResponseBody> {
  const { data } = await apiClient.post<CreateAddressResponseBody>(
    ADDRESS_ENDPOINTS.CREATE,
    body
  );
  return data;
}
