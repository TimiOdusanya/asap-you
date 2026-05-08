import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductMedia } from "@/components/store/shared/store-supermarket-product-detail-parts";
import {
  STORE_DELIVERY_FEE,
  STORE_SERVICE_FEE,
} from "@/lib/store-checkout-fees";
import type { CartItemDto } from "@/types/store-api";
import { cn } from "@/lib/utils";

export function formatCheckoutMoney(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function StoreCheckoutCartLines({ items }: { items: CartItemDto[] }) {
  return (
    <section className="mt-8 rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-content-neutral-primary">
        Your items ({items.reduce((n, i) => n + i.quantity, 0)})
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

export function StoreCheckoutDeliveryCard() {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-canvas p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-content-neutral-primary">
        Delivery information
      </h2>
      <div className="mt-6 grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="co-name">Full name</Label>
          <Input id="co-name" placeholder="Type here…" className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="co-address">Address</Label>
          <Input id="co-address" placeholder="Type here…" className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="co-phone">Mobile number</Label>
          <Input id="co-phone" type="tel" placeholder="Type here…" className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="co-email">Email address</Label>
          <Input id="co-email" type="email" placeholder="Type here…" className="rounded-xl" />
        </div>
        <Button type="button" className="mt-2 w-full rounded-full py-6 sm:w-auto sm:px-10">
          Save information
        </Button>
      </div>
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
  total,
  payment,
  setPayment,
  onPay,
}: {
  subtotal: number;
  total: number;
  payment: CheckoutPaymentMethod;
  setPayment: (p: CheckoutPaymentMethod) => void;
  onPay: () => void;
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
              {formatCheckoutMoney(STORE_DELIVERY_FEE)}
            </dd>
          </div>
          <div className="flex justify-between text-content-neutral-secondary">
            <dt>Services charge</dt>
            <dd className="font-medium text-content-neutral-primary">
              {formatCheckoutMoney(STORE_SERVICE_FEE)}
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
        >
          Pay {formatCheckoutMoney(total)}
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
