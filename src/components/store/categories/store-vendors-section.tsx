"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { InfiniteScrollSentinel } from "@/components/ui/infinite-scroll-sentinel";
import { StoreVendorGridSkeleton } from "@/components/store/skeletons/store-vendor-grid-skeleton";
import { formatVendorCategoryLabel } from "@/lib/vendor-category-tiles";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import {
  fetchVendorsPage,
  STORE_VENDOR_CATEGORY_SLUGS,
  VENDORS_PAGE_LIMIT,
  vendorsListQueryKey,
} from "@/services/store/vendors.api";
import type { VendorListItem } from "@/types/store-api";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE = "/images/landing/vendor/vendor-hero-1.png";

const FILTER_OPTIONS: { slug: null | string; label: string }[] = [
  { slug: null, label: "All Stores" },
  ...STORE_VENDOR_CATEGORY_SLUGS.map((slug) => ({
    slug,
    label: formatVendorCategoryLabel(slug),
  })),
];

function VendorCardImage({ vendor }: { vendor: VendorListItem }) {
  const src = vendor.logo?.trim() || PLACEHOLDER_IMAGE;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full rounded-2xl object-cover"
      />
    );
  }
  return (
    <Image
      src={src}
      alt=""
      fill
      className="rounded-2xl object-cover"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
    />
  );
}

export function StoreVendorsSection() {
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: vendorsListQueryKey(activeSlug),
    queryFn: ({ pageParam }) =>
      fetchVendorsPage({
        page: pageParam as number,
        limit: VENDORS_PAGE_LIMIT,
        category: activeSlug,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      if (!last?.success || !last.pagination) return undefined;
      const { page, totalPages } = last.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const vendors = React.useMemo(() => {
    if (!data?.pages?.length) return [];
    return data.pages.flatMap((page) =>
      page.success && Array.isArray(page.data) ? page.data : []
    );
  }, [data]);

  const loadMore = React.useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-lg font-medium text-content-neutral-primary sm:text-xl md:text-2xl lg:text-3xl">
        All Stores Near You
      </h1>

      <div
        className={cn(
          "-mx-1 mb-6 flex gap-3 overflow-x-auto px-1 pb-2 sm:mb-8 sm:flex-wrap sm:gap-5 sm:overflow-visible",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {FILTER_OPTIONS.map((opt) => {
          const selected =
            activeSlug === opt.slug ||
            (opt.slug === null && activeSlug === null);
          return (
            <button
              key={opt.slug ?? "all"}
              type="button"
              onClick={() => setActiveSlug(opt.slug)}
              className={cn(
                "cursor-pointer whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm transition-colors sm:px-6 sm:py-3 sm:text-base",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "border border-transparent bg-surface-subtle text-content-neutral-muted hover:border-primary"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {isError ? (
        <div className="rounded-2xl border border-border-muted bg-surface-canvas px-6 py-12 text-center">
          <p className="text-content-neutral-secondary">
            We couldn&apos;t load stores. Check your connection and try again.
          </p>
          <Button
            type="button"
            className="mt-4 rounded-full"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <StoreVendorGridSkeleton count={8} />
      ) : vendors.length === 0 ? (
        <EmptyState
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.store}
          illustrationAlt=""
          title="No stores in this category yet"
          description="Try another category or browse all stores to discover vendors near you."
          action={{ label: "Show all stores", onClick: () => setActiveSlug(null) }}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {vendors.map((vendor) => (
              <Link
                key={vendor._id}
                href={`/store/vendor/${encodeURIComponent(vendor._id)}`}
                className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:h-48 sm:aspect-auto">
                  <VendorCardImage vendor={vendor} />
                </div>
                <div className="space-y-1.5 py-3 sm:space-y-2 sm:py-4">
                  <h3 className="truncate text-sm font-normal text-content-neutral-primary group-hover:text-primary sm:text-base md:text-lg">
                    {vendor.businessName}
                  </h3>
                  <p className="truncate text-xs text-content-neutral-muted sm:text-sm">
                    {formatVendorCategoryLabel(vendor.category)} ·{" "}
                    {vendor.address.city}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-content-warning" aria-hidden>
                        ★
                      </span>
                      <span className="text-xs text-content-neutral-tertiary sm:text-sm">
                        {vendor.stats.totalReviews > 0
                          ? `${vendor.stats.averageRating.toFixed(1)} (${vendor.stats.totalReviews})`
                          : "New"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-content-neutral-tertiary">
                      <Clock className="size-3.5 shrink-0 sm:size-4" aria-hidden />
                      <span className="text-xs font-light sm:text-sm">
                        {vendor.settings.isOpen
                          ? `${vendor.settings.deliveryRadius} km`
                          : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <InfiniteScrollSentinel
            hasMore={Boolean(hasNextPage)}
            isBusy={isFetchingNextPage}
            onLoadMore={loadMore}
          />
        </>
      )}
    </div>
  );
}
