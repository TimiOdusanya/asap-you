"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, MapPin, Sparkles, Star, Truck } from "lucide-react";
import { formatVendorCategoryLabel } from "@/lib/vendor-category-tiles";
import type { VendorListItem } from "@/types/store-api";
import { cn } from "@/lib/utils";

const DISPLAY_HOURS = "9:00 AM – 9:00 PM";

interface StoreVendorStoreHeaderProps {
  vendor: VendorListItem;
  /** When set (e.g. from storefront API), overrides dummy hours copy. */
  todayHoursLabel?: string;
}

function VendorLogoSharp({ vendor, className }: { vendor: VendorListItem; className?: string }) {
  const src = vendor.logo?.trim() || "/images/landing/vendor/vendor-hero-1.png";
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <img
        src={src}
        alt=""
        className={cn("size-full object-cover", className)}
      />
    );
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      className={cn("object-cover", className)}
      sizes="160px"
    />
  );
}

function HeroBackdrop({ vendor }: { vendor: VendorListItem }) {
  const src = vendor.logo?.trim() || "/images/landing/vendor/vendor-hero-1.png";
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <img
        src={src}
        alt=""
        className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl"
        aria-hidden
      />
    );
  }
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt=""
        fill
        className="scale-110 object-cover opacity-35 blur-2xl"
        sizes="100vw"
        aria-hidden
      />
    </div>
  );
}

export function StoreVendorStoreHeader({
  vendor,
  todayHoursLabel,
}: StoreVendorStoreHeaderProps) {
  const { address, settings, stats } = vendor;
  const locationLine = [address.addressLine1, address.city, address.state]
    .filter(Boolean)
    .join(" · ");
  const isOpen = settings.isOpen;
  const hoursLine =
    todayHoursLabel ??
    (isOpen ? `Today ${DISPLAY_HOURS}` : `Opens ${DISPLAY_HOURS}`);

  return (
    <div className="overflow-hidden rounded-3xl border border-border-muted bg-surface-canvas shadow-md ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
      <div className="relative min-h-[200px] sm:min-h-[240px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-surface-brand-soft/80 to-surface-subtle" />
        <HeroBackdrop vendor={vendor} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent sm:from-black/50" />

        <div className="relative flex h-full min-h-[200px] flex-col justify-between p-4 sm:min-h-[240px] sm:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-3">
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50"
            >
              <ChevronLeft className="size-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">All stores</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md sm:text-sm",
                isOpen
                  ? "bg-emerald-500/90 text-white"
                  : "bg-white/90 text-content-neutral-primary dark:bg-neutral-900/90 dark:text-white"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={cn(
                    "absolute inline-flex size-full rounded-full opacity-75",
                    isOpen ? "animate-ping bg-white" : "bg-content-neutral-muted"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex size-2 rounded-full",
                    isOpen ? "bg-white" : "bg-content-neutral-muted"
                  )}
                />
              </span>
              {isOpen ? "Open now" : "Closed"}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 space-y-2 text-white drop-shadow-md">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/85 sm:text-sm">
                <Sparkles className="size-3.5 text-amber-200" aria-hidden />
                {formatVendorCategoryLabel(vendor.category)}
              </p>
              <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.1]">
                {vendor.businessName}
              </h1>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/90 sm:text-base">
                <Clock className="size-4 shrink-0 text-white/80" aria-hidden />
                <span>{hoursLine}</span>
              </p>
            </div>

            <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white/90 shadow-2xl ring-2 ring-black/10 sm:mx-0 sm:size-36 lg:size-40">
              <VendorLogoSharp vendor={vendor} className="rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t border-border-muted bg-surface-subtle/50 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
        <div className="flex gap-3 rounded-2xl bg-surface-canvas p-3.5 ring-1 ring-border-muted/80 sm:p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-content-neutral-muted">
              Location
            </p>
            <p className="mt-0.5 text-sm font-medium leading-snug text-content-neutral-primary">
              {locationLine}
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl bg-surface-canvas p-3.5 ring-1 ring-border-muted/80 sm:p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Truck className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-content-neutral-muted">
              Delivery
            </p>
            <p className="mt-0.5 text-sm font-medium text-content-neutral-primary">
              Within {settings.deliveryRadius} km
            </p>
            <p className="text-xs text-content-neutral-secondary">
              Min order ₦{settings.minOrderAmount.toLocaleString("en-NG")}
            </p>
          </div>
        </div>
        <div className="flex gap-3 rounded-2xl bg-surface-canvas p-3.5 ring-1 ring-border-muted/80 sm:p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400">
            <Star className="size-5 fill-current" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-content-neutral-muted">
              Reviews
            </p>
            <p className="mt-0.5 text-sm font-medium text-content-neutral-primary">
              {stats.totalReviews > 0
                ? `${stats.averageRating.toFixed(1)} · ${stats.totalReviews} reviews`
                : "New on Asap"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
