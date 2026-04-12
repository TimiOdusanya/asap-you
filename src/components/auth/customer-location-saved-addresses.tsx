"use client";

import { CircleNotch, MapPin } from "@phosphor-icons/react";
import { EmptyState } from "@/components/ui/empty-state";
import type { AddressEntity } from "@/services/address/address.types";

export function CustomerLocationSavedAddresses({
  addresses,
  loading,
  disabled,
  onSelect,
}: {
  addresses: AddressEntity[];
  loading: boolean;
  disabled: boolean;
  onSelect: (addr: AddressEntity) => void;
}) {
  const hasSaved = addresses.length > 0;

  return (
    <div className="space-y-3 pt-2">
      <p className="text-center text-xs font-medium tracking-wide text-content-neutral-secondary">
        Saved addresses
      </p>
      {loading ? (
        <div className="flex justify-center py-6">
          <CircleNotch
            className="size-6 animate-spin text-content-neutral-secondary"
            aria-hidden
          />
        </div>
      ) : hasSaved ? (
        <ul className="max-h-48 space-y-2 overflow-y-auto pr-1" role="list">
          {addresses.map((addr) => (
            <li key={addr._id}>
              <button
                type="button"
                onClick={() => onSelect(addr)}
                disabled={disabled}
                className="w-full rounded-xl border border-border-strong bg-surface-input-dim/40 px-4 py-3 text-left transition hover:bg-surface-input-dim disabled:opacity-50"
              >
                <span className="block text-sm font-medium text-content-neutral-primary">
                  {addr.label}
                </span>
                <span className="mt-0.5 block text-xs text-content-neutral-secondary line-clamp-2">
                  {addr.addressLine1}
                  {addr.city ? `, ${addr.city}` : ""}
                </span>
                {addr.isDefault ? (
                  <span className="mt-1 inline-block text-[10px] font-medium uppercase tracking-wide text-content-link">
                    Default
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          size="sm"
          icon={
            <MapPin className="text-content-link" weight="duotone" aria-hidden />
          }
          title="No saved addresses yet"
          description="Search above, pick a suggestion, or use current location — then save. Next time your spots will show up here."
          hint="Your default address appears on the store bar once saved."
        />
      )}
    </div>
  );
}
