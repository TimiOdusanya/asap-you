import * as React from "react";
import { Wallet, MapPin, Plus, Check } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductMedia } from "@/components/store/shared/store-supermarket-product-detail-parts";
import type { CartItemDto } from "@/types/store-api";
import { ADDRESS_LIST_QUERY_KEY, listAddresses, createAddress } from "@/services/address/address.api";
import type { AddressEntity } from "@/services/address/address.types";
import { cn } from "@/lib/utils";

export function formatCheckoutMoney(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function StoreCheckoutCartLines({
  items,
  storeName,
}: {
  items: CartItemDto[];
  storeName?: string;
}) {
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return (
    <section className="mt-8 rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-content-neutral-primary">
        {storeName ? `${storeName} · ` : ""}
        {count} item{count === 1 ? "" : "s"}
      </h2>
      <ul className="mt-4 divide-y divide-border-muted">
        {items.map((line) => (
          <li
            key={line.productId}
            className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:size-24">
                <ProductMedia
                  src={
                    line.image?.trim() ||
                    "/images/landing/vendor/vendor-hero-1.png"
                  }
                  alt={line.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-content-neutral-primary">{line.name}</p>
                <p className="mt-1 text-xs text-content-neutral-muted sm:text-sm">
                  Quantity: {line.quantity}
                </p>
              </div>
            </div>
            <p className="text-right text-base font-semibold text-content-neutral-primary sm:min-w-[100px]">
              {formatCheckoutMoney(line.price * line.quantity)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function StoreCheckoutDeliveryCard({
  selectedAddressId,
  onSelectAddress,
}: {
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const [showNew, setShowNew] = React.useState(false);
  const [form, setForm] = React.useState({
    label: "Home",
    addressLine1: "",
    city: "",
    state: "",
    country: "Nigeria",
    instructions: "",
  });

  const { data: addrRes, isPending } = useQuery({
    queryKey: ADDRESS_LIST_QUERY_KEY,
    queryFn: listAddresses,
  });

  const addresses: AddressEntity[] = addrRes?.data ?? [];

  React.useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) ?? addresses[0];
      onSelectAddress(def._id);
    }
  }, [addresses, selectedAddressId, onSelectAddress]);

  const saveMut = useMutation({
    mutationFn: () =>
      createAddress({
        label: form.label,
        type: "home",
        addressLine1: form.addressLine1,
        city: form.city,
        state: form.state,
        country: form.country,
        coordinates: { lat: 0, lng: 0 },
        instructions: form.instructions,
        isDefault: addresses.length === 0,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_LIST_QUERY_KEY });
      onSelectAddress(res.data._id);
      setShowNew(false);
    },
  });

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-content-neutral-primary">Delivery address</h2>

      {isPending ? (
        <div className="mt-4 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-muted" />
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {addresses.map((addr) => (
            <button
              key={addr._id}
              type="button"
              onClick={() => onSelectAddress(addr._id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                selectedAddressId === addr._id
                  ? "border-primary bg-surface-brand-soft/40"
                  : "border-border-muted hover:bg-surface-muted/60"
              )}
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-content-neutral-muted" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-content-neutral-primary">{addr.label}</span>
                <span className="block text-content-neutral-secondary">
                  {addr.addressLine1}, {addr.city}, {addr.state}
                </span>
              </span>
              {selectedAddressId === addr._id && (
                <Check className="size-4 shrink-0 text-primary" />
              )}
            </button>
          ))}

          {!showNew ? (
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="flex items-center gap-2 rounded-xl border border-dashed border-border-muted px-4 py-3 text-sm text-content-neutral-secondary hover:bg-surface-muted/50 w-full"
            >
              <Plus className="size-4" /> Add new address
            </button>
          ) : (
            <div className="rounded-xl border border-border-muted p-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="addr-line1">Street address</Label>
                <Input
                  id="addr-line1"
                  placeholder="e.g. 14 Broad Street"
                  className="rounded-xl"
                  value={form.addressLine1}
                  onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="addr-city">City</Label>
                  <Input
                    id="addr-city"
                    placeholder="Lagos"
                    className="rounded-xl"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addr-state">State</Label>
                  <Input
                    id="addr-state"
                    placeholder="Lagos"
                    className="rounded-xl"
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addr-instructions">Delivery instructions (optional)</Label>
                <Input
                  id="addr-instructions"
                  placeholder="Gate code, landmark, etc."
                  className="rounded-xl"
                  value={form.instructions}
                  onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  className="flex-1 rounded-full"
                  onClick={() => saveMut.mutate()}
                  disabled={!form.addressLine1 || !form.city || !form.state || saveMut.isPending}
                >
                  {saveMut.isPending ? "Saving…" : "Save address"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setShowNew(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export type CheckoutPaymentMethod = "cod" | "wallet" | "card" | "transfer";

const PAY_OPTIONS: { id: CheckoutPaymentMethod; label: string }[] = [
  { id: "cod", label: "Cash on delivery" },
  { id: "wallet", label: "Asap wallet" },
  { id: "card", label: "Debit / credit card" },
  { id: "transfer", label: "Bank transfer" },
];

export function StoreCheckoutSummaryColumn({
  subtotal,
  deliveryFee,
  serviceFee,
  total,
  payment,
  setPayment,
  onPay,
  isPaying = false,
}: {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  payment: CheckoutPaymentMethod;
  setPayment: (p: CheckoutPaymentMethod) => void;
  onPay: () => void;
  isPaying?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-content-neutral-primary">Order summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Sub total</dt>
            <dd className="font-medium text-content-neutral-primary">
              {formatCheckoutMoney(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Delivery fee</dt>
            <dd className="font-medium text-content-neutral-primary">
              {formatCheckoutMoney(deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Service charge</dt>
            <dd className="font-medium text-content-neutral-primary">
              {formatCheckoutMoney(serviceFee)}
            </dd>
          </div>
          <div className="border-t border-border-muted pt-3">
            <div className="flex justify-between text-base font-semibold text-content-neutral-primary">
              <dt>Total</dt>
              <dd>{formatCheckoutMoney(total)}</dd>
            </div>
          </div>
        </dl>
        <Button
          type="button"
          className="mt-6 w-full rounded-full py-6 text-base"
          onClick={onPay}
          disabled={isPaying}
        >
          {isPaying ? "Processing…" : `Pay ${formatCheckoutMoney(total)}`}
        </Button>
      </section>

      <section className="rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-content-neutral-primary">Payment details</h2>
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Payment method</legend>
          {PAY_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-colors",
                payment === opt.id
                  ? "border-primary bg-surface-brand-soft/50"
                  : "border-border-muted hover:bg-surface-muted/80"
              )}
            >
              <input
                type="radio"
                name="payment"
                value={opt.id}
                checked={payment === opt.id}
                onChange={() => setPayment(opt.id)}
                className="size-4 accent-primary"
              />
              <span className="text-content-neutral-primary">{opt.label}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-surface-brand-soft/40 p-4">
        <Wallet className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-semibold text-content-neutral-primary">Earn 5% cash back</p>
          <p className="mt-0.5 text-xs leading-relaxed text-content-neutral-secondary">
            Anytime you use Asap wallet.
          </p>
        </div>
      </div>
    </div>
  );
}
