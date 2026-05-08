"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Inbox, Package, Star, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import {
  ProfileAccountPanel,
  ProfileInboxPanel,
  ProfileOrdersPanel,
  ProfileReviewsPanel,
  ProfileWishlistsPanel,
} from "@/components/store/profile/profile-panels";
import { CustomerProfileSkeleton } from "@/components/store/profile/customer-profile-skeleton";

const TABS = [
  { id: "account" as const, label: "Account", icon: UserRound },
  { id: "orders" as const, label: "Orders", icon: Package },
  { id: "inbox" as const, label: "Inbox", icon: Inbox },
  { id: "reviews" as const, label: "Reviews", icon: Star },
  { id: "wishlists" as const, label: "Wishlists", icon: Heart },
];

export type ProfileTabId = (typeof TABS)[number]["id"];

function displayNameFromUser(
  firstName: string | undefined,
  lastName: string | undefined,
  email: string
) {
  const n = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ");
  return n || email.split("@")[0] || "Account";
}

function initialFromUser(firstName: string | undefined, email: string) {
  const c = firstName?.trim()?.charAt(0) || email.charAt(0);
  return c ? c.toUpperCase() : "?";
}

export function CustomerProfilePage() {
  const [tab, setTab] = React.useState<ProfileTabId>("account");
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);

  if (!hydrated || !user) {
    return <CustomerProfileSkeleton />;
  }

  const displayName = displayNameFromUser(
    user.profile?.firstName,
    user.profile?.lastName,
    user.email
  );
  const initial = initialFromUser(user.profile?.firstName, user.email);

  return (
    <div className="min-h-[60vh] bg-surface-subtle pb-16 pt-6 sm:pt-10">
      <div className="mx-auto max-w-[95%] md:max-w-[90%] lg:max-w-5xl">
        <nav className="mb-6 text-sm text-content-neutral-muted">
          <Link href="/store" className="hover:text-content-link">
            Store
          </Link>
          <span className="mx-2 text-border-strong">/</span>
          <span className="text-content-neutral-primary">Profile</span>
        </nav>

        <header className="mb-8 flex flex-col gap-6 border-b border-border-muted pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-sm sm:size-20 sm:text-xl"
              aria-hidden
            >
              {initial}
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-manrope)] text-xl font-semibold tracking-tight text-content-neutral-primary sm:text-3xl">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-content-neutral-secondary sm:text-base">
                {user.email}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full border-border-muted">
            <Link href="/store">Back to store</Link>
          </Button>
        </header>

        <div
          role="tablist"
          aria-label="Profile sections"
          className={cn(
            "-mx-1 mb-8 flex gap-1 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const selected = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                id={`tab-${id}`}
                aria-controls={`panel-${id}`}
                onClick={() => setTab(id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-surface-canvas text-content-neutral-secondary ring-1 ring-border-muted hover:bg-surface-muted hover:text-content-neutral-primary"
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="transition-opacity duration-200"
        >
          {tab === "account" ? <ProfileAccountPanel user={user} /> : null}
          {tab === "orders" ? <ProfileOrdersPanel /> : null}
          {tab === "inbox" ? <ProfileInboxPanel /> : null}
          {tab === "reviews" ? <ProfileReviewsPanel /> : null}
          {tab === "wishlists" ? <ProfileWishlistsPanel /> : null}
        </div>
      </div>
    </div>
  );
}
