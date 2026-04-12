import { create } from "zustand";
import type { AddressEntity } from "@/services/address/address.types";

interface CustomerDeliveryAddressState {
  selectedAddress: AddressEntity | null;
  setSelectedAddress: (a: AddressEntity | null) => void;
}

export const useCustomerDeliveryAddressStore =
  create<CustomerDeliveryAddressState>((set) => ({
    selectedAddress: null,
    setSelectedAddress: (a) => set({ selectedAddress: a }),
  }));
