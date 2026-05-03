"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ADDRESS_LIST_QUERY_KEY,
  listAddresses,
} from "@/services/address/address.api";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import { useCustomerDeliveryAddressStore } from "@/stores/customer-delivery-address-store";
import {
  formatAddressDisplay,
  pickDefaultAddress,
} from "@/lib/address-display";

const StoreNavbar = () => {
  const openLocation = useCustomerAuthUiStore((s) => s.openLocation);
  const selectedAddress = useCustomerDeliveryAddressStore(
    (s) => s.selectedAddress
  );
  const [menuOpen, setMenuOpen] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ADDRESS_LIST_QUERY_KEY,
    queryFn: listAddresses,
    select: (res) => res.data,
  });

  const defaultFromApi = pickDefaultAddress(data ?? []);
  const displayAddress = selectedAddress ?? defaultFromApi;
  const labelText = displayAddress
    ? formatAddressDisplay(displayAddress)
    : "Add new address";

  React.useEffect(() => {
    if (!menuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  const handleLocationClick = () => {
    setMenuOpen(false);
    openLocation();
  };

  return (
    <div className="w-full border-b-[0.5px] border-border-strong">
      <div className="max-w-[95%] md:max-w-[90%] mx-auto pt-4 pb-3 md:pt-6 md:pb-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="cursor-pointer shrink-0">
            <Image
              src={"/images/logo.svg"}
              alt="logo"
              height={62}
              width={90}
              className="h-9 w-auto md:h-[52px] lg:h-[62px]"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-12 min-w-0">
            <button
              type="button"
              onClick={openLocation}
              className="flex max-w-[220px] min-w-0 items-center gap-2 rounded-md border-none bg-transparent py-6 px-4 text-left text-base font-normal leading-[100%] text-content-neutral-primary cursor-pointer"
            >
              <MapPin className="size-5 shrink-0 text-content-link" aria-hidden />
              {isLoading ? (
                <Skeleton className="h-4 w-[140px] rounded-md" />
              ) : (
                <span className="truncate">{labelText}</span>
              )}
            </button>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-content-neutral-muted"
                aria-hidden
              />
              <Input
                type="text"
                placeholder="Search Asap you"
                className="w-[220px] lg:w-[300px] rounded-sm border-none bg-surface-subtle py-6 pl-10 pr-4 text-base font-normal leading-[100%] text-content-neutral-muted placeholder:text-content-neutral-muted"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <Link
              href="/store/profile"
              className="hidden md:inline-flex size-[52px] items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
              aria-label="Your profile"
            >
              <UserRound size={24} aria-hidden />
            </Link>
            <Link
              href="/store/cart"
              className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 md:size-[52px]"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="size-5 md:size-6" aria-hidden />
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary text-content-neutral-primary"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mt-3 flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={openLocation}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border-muted bg-transparent py-3 px-3 text-left text-sm font-normal leading-tight text-content-neutral-primary"
          >
            <MapPin className="size-4 shrink-0 text-content-link" aria-hidden />
            {isLoading ? (
              <Skeleton className="h-3 w-[120px] rounded-md" />
            ) : (
              <span className="truncate">{labelText}</span>
            )}
          </button>
        </div>

        <div className="mt-2 md:hidden">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-content-neutral-muted"
              aria-hidden
            />
            <Input
              type="text"
              placeholder="Search Asap you"
              className="w-full rounded-sm border-none bg-surface-input-dim py-5 pl-9 pr-4 text-sm font-normal leading-[100%] text-content-neutral-muted placeholder:text-content-neutral-muted"
            />
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Store menu"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col gap-6 bg-surface-canvas p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Image
                src={"/images/logo.svg"}
                alt="logo"
                height={40}
                width={60}
                className="h-9 w-auto"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-muted text-content-neutral-primary"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <button
              type="button"
              onClick={handleLocationClick}
              className="flex items-center gap-3 rounded-lg border border-border-muted px-4 py-3 text-left"
            >
              <MapPin className="size-5 shrink-0 text-content-link" aria-hidden />
              <div className="min-w-0 flex-1">
                <span className="block text-xs text-content-neutral-muted">
                  Deliver to
                </span>
                <span className="block truncate text-sm text-content-neutral-primary">
                  {labelText}
                </span>
              </div>
            </button>

            <nav className="flex flex-col gap-1">
              <Link
                href="/store/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-content-neutral-primary hover:bg-surface-muted"
              >
                <UserRound className="size-5" aria-hidden />
                Account
              </Link>
              <Link
                href="/store/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-content-neutral-primary hover:bg-surface-muted"
              >
                <ShoppingCart className="size-5" aria-hidden />
                Cart
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StoreNavbar;
