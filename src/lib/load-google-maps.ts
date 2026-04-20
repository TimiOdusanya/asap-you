import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";

let loadPromise: Promise<void> | null = null;

export function ensureGoogleMapsLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;
  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
    );
  }
  setOptions({ key: GOOGLE_MAPS_API_KEY, v: "weekly" });
  loadPromise = Promise.all([
    importLibrary("places"),
    importLibrary("geocoding"),
  ]).then(() => undefined);
  return loadPromise;
}
