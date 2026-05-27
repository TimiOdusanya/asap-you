import * as React from "react";
import { Wallet, MapPin, Plus, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProductMedia } from "@/components/store/shared/store-supermarket-product-detail-parts";
import type { CartItemDto } from "@/types/store-api";
import { ADDRESS_LIST_QUERY_KEY, listAddresses } from "@/services/address/address.api";
import type { AddressEntity } from "@/services/address/address.types";
import { StoreCheckoutAddressForm } from "@/components/store/checkout/store-checkout-address-form";
import { ensureAddressDeliverable } from "@/lib/delivery-coverage-client";
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
  const [showNew, setShowNew] = React.useState(false);
  const [validatingId, setValidatingId] = React.useState<string | null>(null);

  const { data: addrRes, isPending } = useQuery({
    queryKey: ADDRESS_LIST_QUERY_KEY,
    queryFn: listAddresses,
  });

  const addresses: AddressEntity[] = addrRes?.data ?? [];

  React.useEffect(() => {
    if (addresses.length === 0 || selectedAddressId) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    let cancelled = false;
    void ensureAddressDeliverable(def, { silent: true }).then((ok) => {
      if (!cancelled && ok) onSelectAddress(def._id);
    });
    return () => {
      cancelled = true;
    };
  }, [addresses, selectedAddressId, onSelectAddress]);

  const handleSelectAddress = React.useCallback(
    async (addr: AddressEntity) => {
      setValidatingId(addr._id);
      const ok = await ensureAddressDeliverable(addr);
      setValidatingId(null);
      if (ok) onSelectAddress(addr._id);
    },
    [onSelectAddress]
  );

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
              onClick={() => void handleSelectAddress(addr)}
              disabled={validatingId === addr._id}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:opacity-60",
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
            <StoreCheckoutAddressForm
              existingCount={addresses.length}
              onSaved={(id) => {
                onSelectAddress(id);
                setShowNew(false);
              }}
              onCancel={() => setShowNew(false)}
            />
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
