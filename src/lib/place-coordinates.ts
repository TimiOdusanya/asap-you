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

export function coordinatesFromPlace(
  place: google.maps.places.PlaceResult
): { lat: number; lng: number } | null {
  const loc = place.geometry?.location;
  if (!loc) return null;
  return toLatLngNumbers(loc);
}
