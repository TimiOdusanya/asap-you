import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthUser } from "@/services/auth/auth.types";

export function ProfileAccountPanel({ user }: { user: AuthUser }) {
  const { firstName, lastName } = user.profile;
  const { language, currency } = user.preferences;

  return (
    <div className="rounded-2xl border border-border-muted bg-surface-canvas p-6 shadow-sm sm:p-8">
      <h2 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-content-neutral-primary">
        Personal details
      </h2>
      <p className="mt-1 text-sm text-content-neutral-secondary">
        Update how we reach you and deliver your orders.
      </p>
      <p className="mt-2 text-xs text-content-neutral-muted">
        Language {language.toUpperCase()} · Currency {currency}
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pf-first">First name</Label>
          <Input
            id="pf-first"
            key={`first-${user._id}`}
            defaultValue={firstName}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pf-last">Last name</Label>
          <Input
            id="pf-last"
            key={`last-${user._id}`}
            defaultValue={lastName}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="pf-email">Email</Label>
          <Input
            id="pf-email"
            type="email"
            key={`email-${user._id}`}
            defaultValue={user.email}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="pf-phone">Phone</Label>
          <Input
            id="pf-phone"
            type="tel"
            key={`phone-${user._id}`}
            defaultValue={user.phone}
            className="rounded-xl"
          />
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" className="rounded-full px-8">
          Save changes
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-border-muted"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function ProfileOrdersPanel() {
  const rows = [
    { id: "AS-240891", date: "28 Jan 2026", total: "₦12,400", status: "Delivered" },
    { id: "AS-240755", date: "22 Jan 2026", total: "₦8,920", status: "On the way" },
    { id: "AS-240701", date: "18 Jan 2026", total: "₦15,200", status: "Delivered" },
  ];
  return (
    <div className="rounded-2xl border border-border-muted bg-surface-canvas shadow-sm">
      <div className="border-b border-border-muted px-6 py-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-manrope)] text-lg font-semibold text-content-neutral-primary">
          Order history
        </h2>
        <p className="mt-1 text-sm text-content-neutral-secondary">
          Track and reorder from your past purchases.
        </p>
      </div>
      <ul className="divide-y divide-border-muted">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"
          >
            <div>
              <p className="font-medium text-content-neutral-primary">{r.id}</p>
              <p className="text-sm text-content-neutral-muted">{r.date}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <span className="text-sm font-semibold text-content-neutral-primary">
                {r.total}
              </span>
              <span
                className={
                  r.status === "Delivered"
                    ? "rounded-full bg-surface-brand-soft px-3 py-1 text-xs font-medium text-content-link"
                    : "rounded-full bg-surface-brand-tint px-3 py-1 text-xs font-medium text-content-neutral-primary"
                }
              >
                {r.status}
              </span>
              <Button variant="ghost" size="sm" className="rounded-full text-primary">
                View
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProfileInboxPanel() {
  const items = [
    {
      title: "Your order AS-240891 has arrived",
      preview: "Tap to confirm delivery and rate your experience.",
      time: "2h ago",
      unread: true,
    },
    {
      title: "Weekend offer — 15% off produce",
      preview: "Valid at participating stores until Sunday midnight.",
      time: "Yesterday",
      unread: false,
    },
  ];
  return (
    <div className="space-y-3">
      {items.map((m, i) => (
        <button
          key={i}
          type="button"
          className="w-full rounded-2xl border border-border-muted bg-surface-canvas p-5 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-content-neutral-primary">{m.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-content-neutral-secondary">
                {m.preview}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-content-neutral-muted">{m.time}</span>
              {m.unread ? (
                <span className="size-2 rounded-full bg-primary" aria-label="Unread" />
              ) : null}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function ProfileReviewsPanel() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <article className="rounded-2xl border border-border-muted bg-surface-canvas p-5 shadow-sm">
        <p className="text-sm font-medium text-content-neutral-primary">
          Fresh Basket Market
        </p>
        <p className="mt-1 text-xs text-content-neutral-muted">Order AS-240891</p>
        <p className="mt-3 text-sm leading-relaxed text-content-neutral-secondary">
          “Produce was crisp and the rider was polite. Will order again.”
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-primary">★★★★★</span>
          <Button variant="ghost" size="sm" className="rounded-full text-xs">
            Edit review
          </Button>
        </div>
      </article>
      <article className="rounded-2xl border border-border-muted bg-surface-canvas p-5 shadow-sm">
        <p className="text-sm font-medium text-content-neutral-primary">
          Artisan Bakery Co.
        </p>
        <p className="mt-1 text-xs text-content-neutral-muted">Order AS-240701</p>
        <p className="mt-3 text-sm leading-relaxed text-content-neutral-secondary">
          “Bread still warm — amazing.”
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-primary">★★★★☆</span>
          <Button variant="ghost" size="sm" className="rounded-full text-xs">
            Edit review
          </Button>
        </div>
      </article>
    </div>
  );
}

export { ProfileWishlistsPanel } from "./profile-wishlists-panel";
