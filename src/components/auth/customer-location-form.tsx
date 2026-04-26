"use client";

import { CircleNotch, MapPin } from "@phosphor-icons/react";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { authBrandBg, authBrandStyle } from "@/components/auth/auth-modal-shell";
import { CustomerLocationSavedAddresses } from "@/components/auth/customer-location-saved-addresses";
import { LocationAutocompleteInput } from "@/components/auth/location-autocomplete-input";
import { parsePlaceResultToAddress } from "@/lib/parse-google-place";
import { readBrowserGeolocation } from "@/lib/geolocation";
import { ensureGoogleMapsLoaded } from "@/lib/load-google-maps";
import {
  getApiErrorMessage,
  toastApiSuccessMessage,
  toastApiError,
} from "@/lib/toast-api";
import {
  ADDRESS_LIST_QUERY_KEY,
  createAddress,
  listAddresses,
} from "@/services/address/address.api";
import type {
  AddressEntity,
  CreateAddressRequestBody,
} from "@/services/address/address.types";
import { useCustomerDeliveryAddressStore } from "@/stores/customer-delivery-address-store";
import { toast } from "sonner";

export function CustomerLocationForm({
  onDone,
}: {
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const setSelectedAddress = useCustomerDeliveryAddressStore(
    (s) => s.setSelectedAddress
  );

  const { data: addressList, isLoading: addressesLoading } = useQuery({
    queryKey: ADDRESS_LIST_QUERY_KEY,
    queryFn: listAddresses,
    select: (res) => res.data,
  });

  const [addressText, setAddressText] = React.useState("");
  const [resolvedPlace, setResolvedPlace] =
    React.useState<google.maps.places.PlaceResult | null>(null);
  const [geoLoading, setGeoLoading] = React.useState(false);

  const saveMutation = useMutation({
    mutationFn: (body: CreateAddressRequestBody) => createAddress(body),
    onSuccess: (res) => {
      toastApiSuccessMessage(res.message);
      void queryClient.invalidateQueries({ queryKey: ADDRESS_LIST_QUERY_KEY });
      setSelectedAddress(null);
      onDone();
    },
    onError: (err) => {
      toastApiError(err);
    },
  });

  const handleUseCurrentLocation = React.useCallback(async () => {
    setGeoLoading(true);
    try {
      const coords = await readBrowserGeolocation();
      await ensureGoogleMapsLoaded();
      if (typeof google === "undefined") {
        throw new Error("Maps failed to load");
      }
      const geocoder = new google.maps.Geocoder();
      await new Promise<void>((resolve, reject) => {
        geocoder.geocode(
          {
            location: {
              lat: coords.latitude,
              lng: coords.longitude,
            },
          },
          (results, status) => {
            if (status !== "OK" || !results?.[0]) {
              reject(new Error("Could not resolve this location"));
              return;
            }
            const r = results[0];
            const placeLike: google.maps.places.PlaceResult = {
              formatted_address: r.formatted_address,
              geometry: r.geometry,
              address_components: r.address_components,
              name: r.formatted_address,
            };
            setResolvedPlace(placeLike);
            setAddressText(r.formatted_address ?? "");
            resolve();
          }
        );
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Location error");
    } finally {
      setGeoLoading(false);
    }
  }, []);

  const buildBodyFromPlace = React.useCallback(
    (place: google.maps.places.PlaceResult): CreateAddressRequestBody | null => {
      const parsed = parsePlaceResultToAddress(place);
      if (!parsed) return null;
      return {
        label: "My Home",
        type: "home",
        addressLine1: parsed.addressLine1,
        city: parsed.city,
        state: parsed.state,
        country: parsed.country,
        coordinates: parsed.coordinates,
        instructions: "",
        isDefault: true,
      };
    },
    []
  );

  const handleContinue = React.useCallback(async () => {
    let place: google.maps.places.PlaceResult | null = resolvedPlace;
    if (!place && addressText.trim()) {
      try {
        await ensureGoogleMapsLoaded();
        const geocoder = new google.maps.Geocoder();
        const r = await new Promise<google.maps.GeocoderResult>(
          (resolve, reject) => {
            geocoder.geocode(
              { address: addressText.trim() },
              (results, status) => {
                if (status === "OK" && results?.[0]) resolve(results[0]);
                else reject(new Error("Could not find that address"));
              }
            );
          }
        );
        place = {
          formatted_address: r.formatted_address,
          geometry: r.geometry,
          address_components: r.address_components,
          name: r.formatted_address,
        } as google.maps.places.PlaceResult;
        setResolvedPlace(place);
      } catch (e) {
        toast.error(getApiErrorMessage(e));
        return;
      }
    }
    if (!place) {
      toast.error(
        "Select an address from suggestions, type a full address, or use current location"
      );
      return;
    }
    const body = buildBodyFromPlace(place);
    if (!body) {
      toast.error("Could not read address details");
      return;
    }
    saveMutation.mutate(body);
  }, [
    addressText,
    buildBodyFromPlace,
    resolvedPlace,
    saveMutation,
  ]);

  const handleSelectSaved = React.useCallback(
    (addr: AddressEntity) => {
      setSelectedAddress(addr);
      onDone();
    },
    [onDone, setSelectedAddress]
  );

  const savedAddresses = addressList ?? [];

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col justify-center px-6">
      <div className="flex w-full flex-col gap-10">
        <div>
          <h3
            className="text-center text-xl font-semibold sm:text-2xl"
            style={authBrandStyle}
          >
            Where Should We Deliver?
          </h3>
          <p className="mt-2 text-center text-sm text-content-neutral-secondary">
            So we can show you stores near you.
          </p>
        </div>

        <div className="space-y-4">
          <LocationAutocompleteInput
            value={addressText}
            onChangeValue={(v) => {
              setAddressText(v);
              setResolvedPlace(null);
            }}
            onPlaceResolved={(place) => {
              setResolvedPlace(place);
            }}
            disabled={saveMutation.isPending}
          />

          <Button
            type="button"
            variant="outline"
            className="mt-2 h-12 w-full rounded-full border-surface-brand text-surface-brand hover:bg-surface-brand/10"
            onClick={handleUseCurrentLocation}
            disabled={geoLoading || saveMutation.isPending}
          >
            {geoLoading ? (
              <CircleNotch className="size-5 animate-spin" aria-hidden />
            ) : (
              <>
                <MapPin className="size-5" weight="regular" aria-hidden />
                Use Current Location
              </>
            )}
          </Button>

          <CustomerLocationSavedAddresses
            addresses={savedAddresses}
            loading={addressesLoading}
            disabled={saveMutation.isPending}
            onSelect={handleSelectSaved}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            className="h-12 w-[136px] rounded-full text-content-on-brand"
            style={authBrandBg}
            onClick={handleContinue}
            disabled={saveMutation.isPending || geoLoading}
          >
            {saveMutation.isPending ? (
              <CircleNotch className="size-5 animate-spin" aria-hidden />
            ) : (
              "Save address"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
