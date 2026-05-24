"use client";

import * as React from "react";
import { updateRiderLocation } from "@/services/rider/rider-deliveries.api";
import type { OrderStatus } from "@/types/order";

const ACTIVE_LOCATION_STATUSES: OrderStatus[] = ["picked_up", "on_the_way", "arrived"];

export function useRiderLocationBroadcast(status: OrderStatus | null | undefined) {
  const watchIdRef = React.useRef<number | null>(null);
  const lastSentRef = React.useRef(0);

  React.useEffect(() => {
    const shouldTrack = status && ACTIVE_LOCATION_STATUSES.includes(status);
    if (!shouldTrack || typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    const sendLocation = (coords: GeolocationCoordinates) => {
      const now = Date.now();
      if (now - lastSentRef.current < 8000) return;
      lastSentRef.current = now;

      void updateRiderLocation({
        lat: coords.latitude,
        lng: coords.longitude,
        heading: coords.heading != null ? coords.heading : undefined,
        speed: coords.speed != null && coords.speed >= 0 ? coords.speed : undefined,
      });
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => sendLocation(pos.coords),
      () => undefined,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [status]);
}
