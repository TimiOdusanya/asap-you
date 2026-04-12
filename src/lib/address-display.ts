import type { AddressEntity } from "@/services/address/address.types";

export function pickDefaultAddress(
  addresses: AddressEntity[]
): AddressEntity | undefined {
  if (addresses.length === 0) return undefined;
  const def = addresses.find((a) => a.isDefault);
  return def ?? addresses[0];
}

export function formatAddressDisplay(a: AddressEntity): string {
  const parts = [a.addressLine1, a.city].filter(Boolean);
  const joined = parts.join(", ");
  return joined || a.label;
}
