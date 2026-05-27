"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationAutocompleteInput } from "@/components/auth/location-autocomplete-input";
import { ensureDeliveryCoverage } from "@/lib/delivery-coverage-client";
import { parsePlaceResultToAddress } from "@/lib/parse-google-place";
import {
  ADDRESS_LIST_QUERY_KEY,
  createAddress,
} from "@/services/address/address.api";

interface Props {
  existingCount: number;
  onSaved: (addressId: string) => void;
  onCancel: () => void;
}

export function StoreCheckoutAddressForm({ existingCount, onSaved, onCancel }: Props) {
  const queryClient = useQueryClient();
  const [addressText, setAddressText] = React.useState("");
  const [resolvedPlace, setResolvedPlace] =
    React.useState<google.maps.places.PlaceResult | null>(null);
  const [instructions, setInstructions] = React.useState("");

  const saveMut = useMutation({
    mutationFn: createAddress,
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: ADDRESS_LIST_QUERY_KEY });
      onSaved(res.data._id);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Could not save address";
      toast.error(msg);
    },
  });

  const handleSave = React.useCallback(async () => {
    if (!resolvedPlace) {
      toast.error("Select an address from the suggestions list.");
      return;
    }
    const parsed = parsePlaceResultToAddress(resolvedPlace);
    if (!parsed) {
      toast.error("Could not read address details.");
      return;
    }
    const covered = await ensureDeliveryCoverage(parsed.coordinates.lat, parsed.coordinates.lng);
    if (!covered) return;

    saveMut.mutate({
      label: "Home",
      type: "home",
      addressLine1: parsed.addressLine1,
      city: parsed.city,
      state: parsed.state,
      country: parsed.country,
      coordinates: parsed.coordinates,
      instructions,
      isDefault: existingCount === 0,
    });
  }, [existingCount, instructions, resolvedPlace, saveMut]);

  return (
    <div className="rounded-xl border border-border-muted p-4 space-y-3">
      <div className="space-y-1.5">
        <Label>Delivery address</Label>
        <LocationAutocompleteInput
          value={addressText}
          onChangeValue={(v) => {
            setAddressText(v);
            setResolvedPlace(null);
          }}
          onPlaceResolved={(place) => {
            setResolvedPlace(place);
            setAddressText(place.formatted_address ?? "");
          }}
          disabled={saveMut.isPending}
          placeholder="Search street, area, or landmark…"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="addr-instructions">Delivery instructions (optional)</Label>
        <Input
          id="addr-instructions"
          placeholder="Gate code, landmark, etc."
          className="rounded-xl"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          className="flex-1 rounded-full"
          onClick={() => void handleSave()}
          disabled={!resolvedPlace || saveMut.isPending}
        >
          {saveMut.isPending ? "Saving…" : "Save address"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
