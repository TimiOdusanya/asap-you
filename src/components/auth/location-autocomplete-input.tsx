"use client";

import { MapPin } from "@phosphor-icons/react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { ensureGoogleMapsLoaded } from "@/lib/load-google-maps";

export function LocationAutocompleteInput({
  value,
  onChangeValue,
  onPlaceResolved,
  disabled,
  placeholder = "Enter address",
  inputClassName,
  listClassName,
  countryRestriction = "ng",
  showMapPin = true,
  containerClassName,
  singleLayer = false,
}: {
  value: string;
  onChangeValue: (v: string) => void;
  onPlaceResolved: (place: google.maps.places.PlaceResult) => void;
  disabled?: boolean;
  placeholder?: string;
  inputClassName?: string;
  listClassName?: string;
  countryRestriction?: string;
  showMapPin?: boolean;
  containerClassName?: string;
  singleLayer?: boolean;
}) {
  const [predictions, setPredictions] = React.useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [open, setOpen] = React.useState(false);
  const [sessionToken, setSessionToken] =
    React.useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [autocompleteService, setAutocompleteService] =
    React.useState<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = React.useRef<google.maps.places.PlacesService | null>(
    null
  );
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    ensureGoogleMapsLoaded()
      .then(() => {
        if (cancelled || typeof google === "undefined") return;
        setAutocompleteService(new google.maps.places.AutocompleteService());
        setSessionToken(new google.maps.places.AutocompleteSessionToken());
        const div = document.createElement("div");
        placesServiceRef.current = new google.maps.places.PlacesService(div);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = containerRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const fetchPredictions = React.useCallback(
    async (input: string) => {
      if (!input.trim() || !autocompleteService || !sessionToken) {
        setPredictions([]);
        return;
      }
      const response = await autocompleteService.getPlacePredictions({
        input,
        sessionToken,
        componentRestrictions: countryRestriction
          ? { country: countryRestriction }
          : undefined,
      });
      setPredictions(response.predictions ?? []);
    },
    [autocompleteService, sessionToken, countryRestriction]
  );

  const handleSelect = React.useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      const svc = placesServiceRef.current;
      if (!svc) return;
      svc.getDetails(
        {
          placeId: prediction.place_id,
          fields: [
            "formatted_address",
            "geometry",
            "address_components",
            "name",
          ],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            onPlaceResolved(place);
            onChangeValue(place.formatted_address ?? prediction.description);
            setOpen(false);
            setPredictions([]);
            setSessionToken(new google.maps.places.AutocompleteSessionToken());
          }
        }
      );
    },
    [onChangeValue, onPlaceResolved]
  );

  const inputEl = (
    <>
      {showMapPin ? (
        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-content-neutral-muted z-10" />
      ) : null}
      <Input
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const v = e.target.value;
          onChangeValue(v);
          setOpen(true);
          void fetchPredictions(v);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={
          inputClassName ??
          `h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] ${showMapPin ? "pl-11" : ""}`
        }
        autoComplete="off"
      />
    </>
  );

  return (
    <div ref={containerRef} className={containerClassName ?? "relative w-full"}>
      {singleLayer ? inputEl : <div className="relative">{inputEl}</div>}
      {open && predictions.length > 0 ? (
        <ul
          className={
            listClassName ??
            "absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-border-muted bg-white py-1 shadow-lg"
          }
          role="listbox"
        >
          {predictions.map((p) => (
            <li key={p.place_id}>
              <button
                type="button"
                className="w-full cursor-pointer px-3 py-2.5 text-left text-sm text-content-neutral-primary hover:bg-muted"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(p)}
              >
                {p.description}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
