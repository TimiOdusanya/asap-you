"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/auth/field-error";
import { cn } from "@/lib/utils";
import { LocationAutocompleteInput } from "@/components/auth/location-autocomplete-input";
import { parsePlaceResultToAddress } from "@/lib/parse-google-place";
import {
  ADDRESS_SUGGESTION_FIELD_MESSAGE,
  DELIVERY_ZONE_FIELD_MESSAGE,
  ensureDeliveryCoverage,
} from "@/lib/delivery-coverage-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VendorStepIndicator from "./vendor-step-indicator";

export interface BusinessInfoData {
  businessName: string;
  category: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
  contactEmail: string;
  legalName: string;
  isBusinessRegistered: string;
}

interface VendorStepBusinessProps {
  defaultValues?: Partial<BusinessInfoData>;
  onNext: (data: BusinessInfoData) => void;
  onBack: () => void;
}

const inputCls =
  "h-10 sm:h-12 rounded-[10px] border-0 bg-[var(--surface-subtle)] px-4 text-sm sm:text-base";
const selectCls =
  "h-10 min-h-10 w-full rounded-[10px] border-0 bg-[var(--surface-subtle)] px-4 text-sm shadow-none sm:h-12 sm:min-h-12 sm:text-base data-[size=default]:h-10 sm:data-[size=default]:h-12";
const errorRing = "ring-1 ring-destructive/50 focus-visible:ring-destructive/50";

const VendorStepBusiness = ({ defaultValues = {}, onNext, onBack }: VendorStepBusinessProps) => {
  const [form, setForm] = useState<BusinessInfoData>({
    businessName: defaultValues.businessName ?? "",
    category: defaultValues.category ?? "",
    phone: defaultValues.phone ?? "",
    addressLine1: defaultValues.addressLine1 ?? "",
    city: defaultValues.city ?? "",
    state: defaultValues.state ?? "",
    country: defaultValues.country ?? "Nigeria",
    postalCode: defaultValues.postalCode ?? "",
    coordinates: defaultValues.coordinates,
    contactEmail: defaultValues.contactEmail ?? "",
    legalName: defaultValues.legalName ?? "",
    isBusinessRegistered: defaultValues.isBusinessRegistered ?? "true",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BusinessInfoData, string>>>({});
  const [isCheckingAddress, setIsCheckingAddress] = useState(false);
  const [addressInZone, setAddressInZone] = useState<boolean | null>(null);

  const set = (key: keyof BusinessInfoData, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const clearAddressError = () =>
    setErrors((prev) => {
      if (!prev.addressLine1) return prev;
      const { addressLine1: _removed, ...rest } = prev;
      return rest;
    });

  const verifyAddressCoverage = async (lat: number, lng: number) => {
    setIsCheckingAddress(true);
    try {
      const covered = await ensureDeliveryCoverage(lat, lng, { silent: true });
      setAddressInZone(covered);
      if (!covered) {
        setErrors((prev) => ({
          ...prev,
          addressLine1: DELIVERY_ZONE_FIELD_MESSAGE,
        }));
        return false;
      }
      clearAddressError();
      return true;
    } finally {
      setIsCheckingAddress(false);
    }
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.businessName.trim()) e.businessName = "Required";
    if (!form.category) e.category = "Select a category";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.addressLine1.trim()) {
      e.addressLine1 = "Required";
    } else if (!form.coordinates) {
      e.addressLine1 = ADDRESS_SUGGESTION_FIELD_MESSAGE;
    } else if (addressInZone === false) {
      e.addressLine1 = DELIVERY_ZONE_FIELD_MESSAGE;
    }
    if (!form.city.trim()) e.city = "Required";
    if (!form.contactEmail.trim()) e.contactEmail = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isCheckingAddress) return;
    if (!validate()) return;
    const coords = form.coordinates;
    if (!coords) return;
    const covered = await verifyAddressCoverage(coords.lat, coords.lng);
    if (!covered) return;
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <h2 className="text-center text-2xl font-semibold text-surface-brand">
        Sign up
      </h2>
      <VendorStepIndicator currentStep={2} />
      <p className="text-sm font-normal text-content-neutral-tertiary">Business Setup</p>

      <div className="space-y-1.5">
        <Label htmlFor="vb-name" className="text-sm text-content-neutral-secondary">Business Name</Label>
        <Input
          id="vb-name"
          placeholder="Business Name"
          className={cn(inputCls, errors.businessName && errorRing)}
          value={form.businessName}
          onChange={(e) => set("businessName", e.target.value)}
        />
        <FieldError message={errors.businessName} id="vb-name-error" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vb-cat" className="text-sm text-content-neutral-secondary">Business Category</Label>
          <Select
            value={form.category || undefined}
            onValueChange={(v) => set("category", v)}
          >
            <SelectTrigger id="vb-cat" className={cn(selectCls, errors.category && errorRing)}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">Restaurant</SelectItem>
              <SelectItem value="supermarket">Supermarket</SelectItem>
              <SelectItem value="pharmacy">Pharmacy</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FieldError message={errors.category} id="vb-cat-error" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vb-phone" className="text-sm text-content-neutral-secondary">Phone Number</Label>
          <Input
            id="vb-phone"
            type="tel"
            placeholder="Phone Number"
            autoComplete="tel"
            className={cn(inputCls, errors.phone && errorRing)}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <FieldError message={errors.phone} id="vb-phone-error" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vb-addr" className="text-sm text-content-neutral-secondary">Business Address</Label>
          <LocationAutocompleteInput
            value={form.addressLine1}
            onChangeValue={(v) => {
              set("addressLine1", v);
              setForm((p) => ({ ...p, coordinates: undefined }));
              setAddressInZone(null);
              clearAddressError();
            }}
            onPlaceResolved={(place) => {
              const parsed = parsePlaceResultToAddress(place);
              if (!parsed) {
                setForm((p) => ({ ...p, coordinates: undefined }));
                setAddressInZone(null);
                setErrors((prev) => ({
                  ...prev,
                  addressLine1: "Could not read this address. Try another suggestion.",
                }));
                return;
              }
              setForm((p) => ({
                ...p,
                addressLine1:
                  parsed.addressLine1 || (place.formatted_address ?? p.addressLine1),
                city: parsed.city || p.city,
                state: parsed.state || p.state,
                country: parsed.country || p.country,
                coordinates: parsed.coordinates,
              }));
              setAddressInZone(null);
              clearAddressError();
              void verifyAddressCoverage(
                parsed.coordinates.lat,
                parsed.coordinates.lng
              );
            }}
            disabled={isCheckingAddress}
            showMapPin={false}
            placeholder="Type your street, area, or city…"
            countryRestriction="ng"
            inputClassName={cn(inputCls, errors.addressLine1 && errorRing)}
            containerClassName="relative w-full"
          />
          <FieldError message={errors.addressLine1} id="vb-addr-error" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vb-city" className="text-sm text-content-neutral-secondary">City</Label>
          <Input
            id="vb-city"
            placeholder="City"
            className={cn(inputCls, errors.city && errorRing)}
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
          <FieldError message={errors.city} id="vb-city-error" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vb-email" className="text-sm text-content-neutral-secondary">Email Address</Label>
          <Input
            id="vb-email"
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            className={cn(inputCls, errors.contactEmail && errorRing)}
            value={form.contactEmail}
            onChange={(e) => set("contactEmail", e.target.value)}
          />
          <FieldError message={errors.contactEmail} id="vb-email-error" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vb-reg" className="text-sm text-content-neutral-secondary">Is your business registered</Label>
          <Select value={form.isBusinessRegistered} onValueChange={(v) => set("isBusinessRegistered", v)}>
            <SelectTrigger id="vb-reg" className={selectCls}>
              <SelectValue placeholder="Yes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="vb-legal" className="text-sm text-content-neutral-secondary">Legal Business Name</Label>
        <Input
          id="vb-legal"
          placeholder="Legal Business Name"
          className={inputCls}
          value={form.legalName}
          onChange={(e) => set("legalName", e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} className="text-content-neutral-muted">
          Back
        </Button>
        <Button
          type="submit"
          disabled={isCheckingAddress}
          className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90"
        >
          {isCheckingAddress ? "Checking address…" : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default VendorStepBusiness;
