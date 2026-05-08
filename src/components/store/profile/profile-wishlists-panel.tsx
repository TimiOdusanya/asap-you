"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StoreWishlistGridSkeleton } from "@/components/store/skeletons/store-wishlist-grid-skeleton";
import {
  ProductMedia,
  formatStoreMoney,
} from "@/components/store/shared/store-supermarket-product-detail-parts";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import {
  WISHLIST_QUERY_KEY_ROOT,
  fetchWishlistPage,
  removeWishlistItem,
  wishlistPageQueryKey,
} from "@/services/store/wishlist.api";

const PAGE_LIMIT = 50;

export function ProfileWishlistsPanel() {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: wishlistPageQueryKey(page, PAGE_LIMIT),
    queryFn: () => fetchWishlistPage(page, PAGE_LIMIT),
  });

  const entries = data?.success && data.data ? data.data : [];
  const pagination = data?.pagination;
  const hasPrev = page > 1;
  const hasNext = pagination ? page < pagination.totalPages : false;

  const removeMut = useMutation({
    mutationFn: (productId: string) => removeWishlistItem(productId),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY_ROOT });
      toast.success(res.message ?? "Removed from wishlist");
    },
    onError: () => toast.error("Could not remove item"),
  });

  if (isPending) {
    return <StoreWishlistGridSkeleton count={6} />;
  }

  if (isError) {
    return (
      <EmptyState
        className="mx-auto w-full max-w-lg"
        illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
        illustrationAlt=""
        title="Could not load wishlist"
        description="Try again in a moment."
        action={{ label: "Retry", onClick: () => void refetch() }}
      />
    );
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        className="mx-auto w-full max-w-lg"
        illustrationSrc={EMPTY_STATE_ILLUSTRATION.store}
        illustrationAlt=""
        title="Your wishlist is empty"
        description="Save products you love from product pages."
        action={{ label: "Browse store", href: "/store" }}
      />
    );
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((row) => {
          const p = row.product;
          const img = p.images[0]?.trim() || "/images/landing/vendor/vendor-hero-1.png";
          return (
            <div
              key={`${p._id}-${row.addedAt}`}
              className="overflow-hidden rounded-2xl border border-border-muted bg-surface-canvas shadow-sm"
            >
              <Link
                href={`/store/supermarket/${p._id}`}
                className="relative block aspect-[4/3] bg-surface-muted"
              >
                <ProductMedia
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </Link>
              <div className="p-4">
                <Link
                  href={`/store/supermarket/${p._id}`}
                  className="font-medium text-content-neutral-primary hover:underline"
                >
                  {p.name}
                </Link>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {formatStoreMoney(p.finalPrice)}
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button asChild variant="outline" size="sm" className="flex-1 rounded-full border-border-muted">
                    <Link href={`/store/supermarket/${p._id}`}>View product</Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-content-negative hover:bg-surface-muted"
                    disabled={removeMut.isPending}
                    onClick={() => removeMut.mutate(p._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {pagination && pagination.totalPages > 1 ? (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={!hasPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="flex items-center px-2 text-sm text-content-neutral-muted">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
