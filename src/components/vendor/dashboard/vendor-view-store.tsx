"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { StorefrontIcon, ArrowSquareOutIcon, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchVendorProducts,
  vendorProductsQueryKey,
} from "@/services/vendor/vendor-products.api";
import {
  fetchVendorSettings,
  vendorSettingsQueryKey,
} from "@/services/vendor/vendor-settings.api";

function formatCategoryLabel(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAddress(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(", ");
}

function ViewStoreSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6" role="status" aria-label="Loading store">
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

const VendorViewStore = () => {
  const settingsQuery = useQuery({
    queryKey: vendorSettingsQueryKey,
    queryFn: fetchVendorSettings,
  });

  const productsQuery = useQuery({
    queryKey: vendorProductsQueryKey,
    queryFn: fetchVendorProducts,
  });

  const isPending = settingsQuery.isPending || productsQuery.isPending;
  const isError = settingsQuery.isError || productsQuery.isError;

  if (isPending) {
    return <ViewStoreSkeleton />;
  }

  if (isError || !settingsQuery.data?.data) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <WarningCircle className="size-10 text-red-400" />
        <p className="font-semibold text-content-neutral-primary">Could not load your store</p>
        <Button
          className="rounded-full"
          onClick={() => {
            settingsQuery.refetch();
            productsQuery.refetch();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  const store = settingsQuery.data.data;
  const productStats = productsQuery.data?.stats;
  const vendorId = store._id;
  const storefrontHref = `/store/vendor/${encodeURIComponent(vendorId)}`;

  const totalProducts = productStats?.totalProducts ?? 0;
  const lowStock = productStats?.lowStock ?? 0;
  const outOfStock = productStats?.outOfStock ?? 0;
  const averageRating = store.stats.averageRating;
  const totalReviews = store.stats.totalReviews;
  const totalOrders = store.stats.totalOrders;
  const addressLine = formatAddress([
    store.address.addressLine1,
    store.address.city,
    store.address.state,
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">View Store</h1>

      <div className="bg-white rounded-2xl border border-border-muted p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
        <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-surface-subtle border border-border-muted">
          {store.logo ? (
            <Image
              src={store.logo}
              alt={store.businessName}
              fill
              className="object-cover"
              unoptimized={store.logo.startsWith("http")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <StorefrontIcon className="size-8 text-surface-forest" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h2 className="text-lg font-semibold text-content-neutral-primary">{store.businessName}</h2>
          <p className="text-sm text-content-neutral-secondary">{formatCategoryLabel(store.category)}</p>
          {addressLine ? (
            <p className="text-sm text-content-neutral-muted">{addressLine}</p>
          ) : null}
          <p className="text-sm text-content-neutral-muted line-clamp-2">{store.description}</p>
          <span
            className={`inline-flex mt-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              store.settings.isOpen
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {store.settings.isOpen ? "Open for orders" : "Closed"}
          </span>
        </div>
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <Button className="bg-surface-brand hover:bg-surface-brand/90 rounded-full px-6 gap-2" asChild>
            <Link href={storefrontHref} target="_blank" rel="noreferrer">
              <ArrowSquareOutIcon className="size-4" />
              Preview store
            </Link>
          </Button>
          <Button variant="outline" className="rounded-full px-6 border-border-muted" asChild>
            <Link href="/vendor/dashboard/settings">Edit store info</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total listings", value: String(totalProducts), note: "Active products" },
          { label: "Low stock", value: String(lowStock), note: "Needs restock soon" },
          { label: "Out of stock", value: String(outOfStock), note: "Unavailable items" },
          {
            label: "Average rating",
            value: totalReviews > 0 ? averageRating.toFixed(1) : "—",
            note: totalReviews > 0 ? `${totalReviews} reviews` : "No reviews yet",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-border-muted p-5 flex flex-col gap-1"
          >
            <span className="text-xs text-content-neutral-muted">{item.label}</span>
            <span className="text-2xl font-semibold text-content-neutral-primary">{item.value}</span>
            <span className="text-xs text-content-neutral-muted">{item.note}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border-muted p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-content-neutral-primary mb-3">Order activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-content-neutral-muted">Total orders</p>
            <p className="text-xl font-semibold text-content-neutral-primary">{totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-content-neutral-muted">Completed deliveries</p>
            <p className="text-xl font-semibold text-content-neutral-primary">{store.stats.completedOrders}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-full border-border-muted" asChild>
            <Link href="/vendor/dashboard">Manage products</Link>
          </Button>
          <Button variant="outline" className="rounded-full border-border-muted" asChild>
            <Link href="/vendor/dashboard/add-product">Add product</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorViewStore;
