function findComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string
): string {
  const c = components.find((x) => x.types.includes(type));
  return c?.long_name ?? "";
}

function toLatLngNumbers(
  loc: google.maps.LatLng | google.maps.LatLngLiteral
): { lat: number; lng: number } {
  if (typeof loc.lat === "function") {
    const ll = loc as google.maps.LatLng;
    return { lat: ll.lat(), lng: ll.lng() };
  }
  const lit = loc as google.maps.LatLngLiteral;
  return { lat: lit.lat, lng: lit.lng };
}

export interface ParsedAddressForApi {
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  coordinates: { lat: number; lng: number };
}

export function parsePlaceResultToAddress(
  place: google.maps.places.PlaceResult
): ParsedAddressForApi | null {
  const loc = place.geometry?.location;
  if (!loc) return null;
  const { lat, lng } = toLatLngNumbers(loc);

  const components = place.address_components ?? [];
  const streetNumber = findComponent(components, "street_number");
  const route = findComponent(components, "route");
  const sublocality = findComponent(components, "sublocality");
  const locality =
    findComponent(components, "locality") ||
    findComponent(components, "postal_town") ||
    sublocality;
  const admin1 = findComponent(
    components,
    "administrative_area_level_1"
  );
  const country = findComponent(components, "country");

  const line1 = [streetNumber, route].filter(Boolean).join(" ").trim();
  const addressLine1 =
    line1 ||
    place.formatted_address?.split(",")[0]?.trim() ||
    place.name ||
    "";

  return {
    addressLine1,
    city: locality || admin1 || country || "Unknown",
    state: admin1 || country || "Unknown",
    country: country || "Unknown",
    coordinates: { lat, lng },
  };
}
