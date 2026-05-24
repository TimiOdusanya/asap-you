"use client";

import * as React from "react";
import { Loader2, MapPin } from "lucide-react";
import { ensureGoogleMapsMapLoaded } from "@/lib/load-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/lib/env";
import type { OrderAddressDto, OrderTrackDto } from "@/types/order";

const LAGOS_CENTER = { lat: 6.5244, lng: 3.3792 };

function hasCoords(coords?: { lat?: number; lng?: number } | null): coords is { lat: number; lng: number } {
  return typeof coords?.lat === "number" && typeof coords?.lng === "number";
}

async function resolveDeliveryCoords(
  address: OrderAddressDto
): Promise<{ lat: number; lng: number } | null> {
  if (hasCoords(address.coordinates)) {
    return address.coordinates;
  }

  await ensureGoogleMapsMapLoaded();
  const query = [address.addressLine1, address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");
  if (!query.trim()) return null;

  const geocoder = new google.maps.Geocoder();
  const result = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
        resolve(results[0]);
        return;
      }
      resolve(null);
    });
  });

  const loc = result?.geometry?.location;
  if (!loc) return null;
  return { lat: loc.lat(), lng: loc.lng() };
}

interface StoreOrderTrackingMapProps {
  deliveryAddress: OrderAddressDto;
  riderLocation?: OrderTrackDto["riderLocation"];
  isLive?: boolean;
}

export function StoreOrderTrackingMap({
  deliveryAddress,
  riderLocation,
  isLive = false,
}: StoreOrderTrackingMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<google.maps.Map | null>(null);
  const deliveryMarkerRef = React.useRef<google.maps.Marker | null>(null);
  const riderMarkerRef = React.useRef<google.maps.Marker | null>(null);
  const [mapState, setMapState] = React.useState<"loading" | "ready" | "error">("loading");
  const [resolvedDelivery, setResolvedDelivery] = React.useState<{ lat: number; lng: number } | null>(
    null
  );

  React.useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setMapState("error");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const deliveryCoords = await resolveDeliveryCoords(deliveryAddress);
        if (cancelled) return;
        setResolvedDelivery(deliveryCoords);

        await ensureGoogleMapsMapLoaded();
        if (cancelled || !mapRef.current) return;

        const riderCoords = hasCoords(riderLocation?.coordinates)
          ? riderLocation.coordinates
          : null;
        const center = riderCoords ?? deliveryCoords ?? LAGOS_CENTER;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center,
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
          });
        } else {
          mapInstanceRef.current.setCenter(center);
        }

        if (deliveryCoords) {
          if (deliveryMarkerRef.current) {
            deliveryMarkerRef.current.setPosition(deliveryCoords);
          } else {
            deliveryMarkerRef.current = new google.maps.Marker({
              position: deliveryCoords,
              map: mapInstanceRef.current,
              title: "Delivery address",
              label: { text: "D", color: "white", fontWeight: "700" },
            });
          }
        }

        if (riderCoords) {
          if (riderMarkerRef.current) {
            riderMarkerRef.current.setPosition(riderCoords);
          } else {
            riderMarkerRef.current = new google.maps.Marker({
              position: riderCoords,
              map: mapInstanceRef.current,
              title: "Rider",
              label: { text: "R", color: "white", fontWeight: "700" },
            });
          }
        }

        if (deliveryCoords && riderCoords && mapInstanceRef.current) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(deliveryCoords);
          bounds.extend(riderCoords);
          mapInstanceRef.current.fitBounds(bounds, 48);
        }

        setMapState("ready");
      } catch {
        if (!cancelled) setMapState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deliveryAddress, riderLocation]);

  React.useEffect(() => {
    if (!mapInstanceRef.current || !hasCoords(riderLocation?.coordinates)) return;
    const { lat, lng } = riderLocation.coordinates;

    if (riderMarkerRef.current) {
      riderMarkerRef.current.setPosition({ lat, lng });
    } else {
      riderMarkerRef.current = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: "Rider",
        label: { text: "R", color: "white", fontWeight: "700" },
      });
    }

    if (isLive) {
      mapInstanceRef.current.panTo({ lat, lng });
    }
  }, [riderLocation, isLive]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl border border-border-muted bg-surface-muted/60 px-4 text-center">
        <MapPin className="size-8 text-content-neutral-muted" />
        <p className="text-sm text-content-neutral-muted">Map unavailable — API key not configured</p>
      </div>
    );
  }

  if (mapState === "error") {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-2xl border border-border-muted bg-surface-muted/60 px-4 text-center">
        <MapPin className="size-8 text-content-neutral-muted" />
        <p className="text-sm text-content-neutral-muted">Could not load the map</p>
        {hasCoords(riderLocation?.coordinates) ? (
          <p className="text-xs text-content-neutral-muted">
            Rider at {riderLocation.coordinates.lat.toFixed(4)}, {riderLocation.coordinates.lng.toFixed(4)}
          </p>
        ) : resolvedDelivery ? (
          <p className="text-xs text-content-neutral-muted">
            Delivery at {resolvedDelivery.lat.toFixed(4)}, {resolvedDelivery.lng.toFixed(4)}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border-muted bg-surface-muted/40">
      <div ref={mapRef} className="h-[280px] w-full" aria-label="Order delivery map" />
      {mapState === "loading" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-muted/80">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      ) : null}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        {resolvedDelivery ? (
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-content-neutral-secondary shadow-sm">
            D = Delivery
          </span>
        ) : null}
        {hasCoords(riderLocation?.coordinates) ? (
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-content-neutral-secondary shadow-sm">
            R = Rider{isLive ? " (live)" : ""}
          </span>
        ) : null}
      </div>
    </div>
  );
}
