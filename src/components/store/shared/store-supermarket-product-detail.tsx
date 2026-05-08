"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Star } from "lucide-react";
import { StoreProductDetailCommerce } from "@/components/store/shared/store-product-detail-commerce";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductDetailPageSkeleton } from "@/components/store/skeletons/product-detail-page-skeleton";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  ProductMedia,
  SimilarSupermarketProductCard,
  formatStoreMoney,
} from "@/components/store/shared/store-supermarket-product-detail-parts";
import {
  PRODUCT_DETAIL_SIMILAR_DEFAULT,
  fetchProductDetail,
  productDetailQueryKey,
} from "@/services/store/product-detail.api";
import { cn } from "@/lib/utils";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";

export function StoreSupermarketProductDetail({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: productDetailQueryKey(productId, PRODUCT_DETAIL_SIMILAR_DEFAULT),
    queryFn: () => fetchProductDetail(productId, PRODUCT_DETAIL_SIMILAR_DEFAULT),
    enabled: Boolean(productId),
  });

  const payload = data?.data;
  const product = payload?.product;
  const vendor = payload?.vendor;
  const similar = payload?.similarProducts ?? [];

  const displayImages =
    product && product.images.length > 0
      ? product.images
      : product
        ? [PRODUCT_IMAGE_PLACEHOLDER]
        : [];

  const maxQty = useMemo(() => {
    if (!product) return 1;
    const { inventory } = product;
    if (!inventory.trackQuantity || inventory.allowOutOfStockPurchase) {
      return 99;
    }
    return Math.max(1, inventory.quantity);
  }, [product]);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [productId]);

  useEffect(() => {
    if (selectedImage >= displayImages.length) {
      setSelectedImage(0);
    }
  }, [displayImages.length, selectedImage]);

  if (isPending) {
    return <ProductDetailPageSkeleton />;
  }

  if (isError || !product || !vendor) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <EmptyState
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
          title="Could not load product"
          description="Check your connection and try again."
          action={{ label: "Retry", onClick: () => void refetch() }}
        />
      </div>
    );
  }

  const mainSrc = displayImages[selectedImage] ?? PRODUCT_IMAGE_PLACEHOLDER;

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1 || next > maxQty) return q;
      return next;
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="bg-surface-canvas px-6 py-4">
          <nav className="text-sm text-content-neutral-tertiary" aria-label="Breadcrumb">
            <span>Store</span>
            <span className="mx-2">/</span>
            <span>{payload?.categories[0]?.name ?? "Supermarket"}</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-content-neutral-primary">{product.name}</span>
          </nav>
        </div>

        <div className="p-6">
          <Link
            href="/store/supermarkets"
            className="mb-6 inline-flex cursor-pointer items-center text-surface-forest hover:text-surface-forest-deep"
          >
            <ChevronLeft size={20} className="mr-2 text-surface-forest" />
            Back to supermarkets
          </Link>

          <div className="mb-8 rounded-lg p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="relative h-80 w-full overflow-hidden rounded-lg sm:h-96">
                  <ProductMedia
                    src={mainSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  {displayImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                        selectedImage === index
                          ? "border-surface-brand-muted"
                          : "border-border-subtle"
                      )}
                    >
                      <ProductMedia
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-1 text-sm text-content-neutral-tertiary">
                    Sold by{" "}
                    <span className="text-content-neutral-secondary">{vendor.name}</span>
                  </p>
                  <h1 className="mb-2 text-3xl font-semibold text-content-neutral-primary">
                    {product.name}
                  </h1>
                  <p className="text-lg font-light text-content-neutral-tertiary">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(product.stats.averageRating)
                            ? "fill-current text-content-warning"
                            : "text-content-neutral-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-content-neutral-tertiary">
                    {product.stats.averageRating.toFixed(1)} ({product.stats.totalReviews}{" "}
                    {product.stats.totalReviews === 1 ? "review" : "reviews"})
                  </span>
                </div>

                <div className="border-b border-border-subtle pb-4 text-sm text-content-neutral-tertiary" />

                <div className="flex flex-wrap items-baseline gap-2 text-2xl font-semibold text-content-neutral-primary">
                  <span>{formatStoreMoney(product.finalPrice)}</span>
                  {product.comparePrice > product.finalPrice ? (
                    <span className="text-lg font-normal text-content-neutral-tertiary line-through">
                      {formatStoreMoney(product.comparePrice)}
                    </span>
                  ) : null}
                  {product.discountAmount > 0 ? (
                    <span className="text-base font-medium text-content-positive">
                      You save {formatStoreMoney(product.discountAmount)}
                    </span>
                  ) : null}
                </div>

                {product.inventory.trackQuantity ? (
                  <p className="text-base font-light text-content-neutral-tertiary">
                    {product.inventory.quantity <= product.inventory.lowStockAlert ? (
                      <>
                        Only{" "}
                        <span className="text-content-negative">
                          {product.inventory.quantity} in stock
                        </span>{" "}
                        — order soon
                      </>
                    ) : (
                      <>{product.inventory.quantity} in stock</>
                    )}
                  </p>
                ) : null}

                <StoreProductDetailCommerce
                  productId={product._id}
                  quantity={quantity}
                  maxQty={maxQty}
                  onQuantityDelta={handleQuantityChange}
                />

                <div className="space-y-3 pt-6">
                  <div className="flex flex-col gap-2 rounded-md border border-border-subtle p-4">
                    <span className="font-medium text-content-neutral-primary">Free delivery</span>
                    <p className="cursor-pointer text-sm text-content-accent-coral underline hover:underline">
                      Enter your area to see delivery options
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-md border border-border-subtle p-4">
                    <span className="font-medium text-content-neutral-primary">Returns</span>
                    <p className="cursor-pointer text-sm text-content-accent-coral underline hover:underline">
                      See return policy for this store
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-surface-canvas p-10">
            <h2 className="mb-6 text-2xl font-medium text-content-neutral-primary">
              Similar items you might like
            </h2>
            {similar.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {similar.map((item) => (
                  <SimilarSupermarketProductCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-content-neutral-tertiary">
                No similar products right now.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
