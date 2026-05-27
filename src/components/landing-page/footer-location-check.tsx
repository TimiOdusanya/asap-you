"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LocationAutocompleteInput } from "@/components/auth/location-autocomplete-input";
import { DeliveryCoverageSuccessModal } from "@/components/landing-page/delivery-coverage-success-modal";
import { ensureGoogleMapsLoaded } from "@/lib/load-google-maps";
import { coordinatesFromPlace } from "@/lib/place-coordinates";
import { checkDeliveryCoverage } from "@/services/delivery/delivery-coverage.api";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";

import { DELIVERY_UNAVAILABLE_MESSAGE } from "@/lib/delivery-coverage-client";

const FOOTER_INPUT_CLASS =
  "bg-surface-elevated px-5 sm:px-6 py-6 sm:py-9 rounded-[40px] w-full pr-[150px] sm:pr-[190px] text-content-neutral-primary placeholder:text-content-neutral-muted text-sm sm:text-base border-0 shadow-none h-auto min-h-[52px] sm:min-h-[72px] focus-visible:ring-1 focus-visible:ring-surface-brand/30 focus-visible:border-transparent";

export function FooterLocationCheck() {
  const openSignUp = useCustomerAuthUiStore((s) => s.openSignUp);
  const [query, setQuery] = React.useState("");
  const [checking, setChecking] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [matchedAddress, setMatchedAddress] = React.useState<string | undefined>();

  const runCoverageCheck = React.useCallback(async (lat: number, lng: number, label?: string) => {
    setChecking(true);
    try {
      const res = await checkDeliveryCoverage(lat, lng);
      if (res.data.covered) {
        setMatchedAddress(label);
        setSuccessOpen(true);
      } else {
        toast.error(DELIVERY_UNAVAILABLE_MESSAGE);
      }
    } catch {
      toast.error("Could not verify your location. Please try again.");
    } finally {
      setChecking(false);
    }
  }, []);

  const handlePlaceResolved = React.useCallback(
    (place: google.maps.places.PlaceResult) => {
      const coords = coordinatesFromPlace(place);
      if (!coords) {
        toast.error("Could not read that address. Try another suggestion.");
        return;
      }
      const label = place.formatted_address ?? query;
      void runCoverageCheck(coords.lat, coords.lng, label);
    },
    [query, runCoverageCheck]
  );

  const handleCurrentLocation = React.useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device.");
      return;
    }

    setChecking(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          let formattedAddress: string | undefined;
          await ensureGoogleMapsLoaded();
          if (typeof google !== "undefined") {
            const geocoder = new google.maps.Geocoder();
            const geocodeResult = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
              geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
                  resolve(results[0]);
                } else {
                  resolve(null);
                }
              });
            });
            formattedAddress = geocodeResult?.formatted_address;
            if (formattedAddress) setQuery(formattedAddress);
          }
          await runCoverageCheck(latitude, longitude, formattedAddress);
        } catch {
          setChecking(false);
          toast.error("Could not verify your location. Please try again.");
        }
      },
      () => {
        setChecking(false);
        toast.error("Location permission denied. Enter your address manually.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, [runCoverageCheck]);

  return (
    <>
      <div className="relative w-full max-w-[515px]">
        <LocationAutocompleteInput
          value={query}
          onChangeValue={setQuery}
          onPlaceResolved={handlePlaceResolved}
          disabled={checking}
          placeholder="Type your street, area, or city…"
          showMapPin={false}
          singleLayer
          countryRestriction="ng"
          inputClassName={FOOTER_INPUT_CLASS}
          listClassName="absolute z-40 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-border-muted bg-white py-1 text-left shadow-xl"
        />
        <Button
          type="button"
          disabled={checking}
          onClick={() => void handleCurrentLocation()}
          className="absolute right-2 sm:right-4 top-1/2 z-10 -translate-y-1/2 bg-primary text-primary-foreground text-xs sm:text-base rounded-[40px] px-3 sm:px-6 py-4 sm:py-6 whitespace-nowrap hover:bg-primary/90"
        >
          {checking ? (
            <Loader2 className="size-4 animate-spin" aria-label="Checking location" />
          ) : (
            "Current Location"
          )}
        </Button>
      </div>

      <DeliveryCoverageSuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        addressLabel={matchedAddress}
        onOrderNow={openSignUp}
      />
    </>
  );
}
