import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";

let placesLoadPromise: Promise<void> | null = null;
let mapLoadPromise: Promise<void> | null = null;

function configureGoogleMapsLoader() {
  setOptions({ key: GOOGLE_MAPS_API_KEY, v: "weekly" });
}

export function ensureGoogleMapsLoaded(): Promise<void> {
  if (placesLoadPromise) return placesLoadPromise;
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
    );
  }
  configureGoogleMapsLoader();
  placesLoadPromise = Promise.all([
    importLibrary("places"),
    importLibrary("geocoding"),
  ]).then(() => undefined);
  return placesLoadPromise;
}

export function ensureGoogleMapsMapLoaded(): Promise<void> {
  if (mapLoadPromise) return mapLoadPromise;
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
    );
  }
  configureGoogleMapsLoader();
  mapLoadPromise = Promise.all([
    importLibrary("maps"),
    importLibrary("geocoding"),
  ]).then(() => undefined);
  return mapLoadPromise;
}
