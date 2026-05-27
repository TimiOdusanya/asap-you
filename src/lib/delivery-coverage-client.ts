import { toast } from "sonner";
import { checkDeliveryCoverage } from "@/services/delivery/delivery-coverage.api";
import type { AddressCoordinates, AddressEntity } from "@/services/address/address.types";

export const DELIVERY_UNAVAILABLE_MESSAGE =
  "Sorry, delivery is not available in your area.";

export function coordinatesFromAddress(
  address: Pick<AddressEntity, "coordinates"> | null | undefined
): AddressCoordinates | null {
  const lat = address?.coordinates?.lat;
  const lng = address?.coordinates?.lng;
  if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  if (lat === 0 && lng === 0) return null;
  return { lat, lng };
}

export async function ensureDeliveryCoverage(
  lat: number,
  lng: number,
  options?: { silent?: boolean }
): Promise<boolean> {
  try {
    const res = await checkDeliveryCoverage(lat, lng);
    if (res.data.covered) return true;
    if (!options?.silent) toast.error(DELIVERY_UNAVAILABLE_MESSAGE);
    return false;
  } catch {
    if (!options?.silent) {
      toast.error("Could not verify delivery area. Please try again.");
    }
    return false;
  }
}

export async function ensureAddressDeliverable(
  address: Pick<AddressEntity, "coordinates"> | null | undefined,
  options?: { silent?: boolean }
): Promise<boolean> {
  const coords = coordinatesFromAddress(address);
  if (!coords) {
    if (!options?.silent) {
      toast.error(
        "This address is missing location data. Pick an address from suggestions or use current location."
      );
    }
    return false;
  }
  return ensureDeliveryCoverage(coords.lat, coords.lng, options);
}
