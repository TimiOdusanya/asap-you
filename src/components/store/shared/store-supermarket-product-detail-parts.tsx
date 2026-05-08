import Image from "next/image";
import Link from "next/link";
import { Star, Store } from "lucide-react";
import type { SimilarProductItemDto } from "@/types/store-api";
import { cn } from "@/lib/utils";

export const PRODUCT_IMAGE_PLACEHOLDER = "/images/landing/vendor/vendor-hero-1.png";

export function formatStoreMoney(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function ProductMedia({
  src,
  alt,
  className,
  fill,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(fill && "absolute inset-0 size-full", className)}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={cn(fill && "object-cover", className)}
    />
  );
}

function similarDiscountLabel(p: SimilarProductItemDto): string | null {
  if (p.discountAmount <= 0 || !p.discount?.isActive) return null;
  if (p.discount.type === "percent") {
    return `${p.discount.value}% off`;
  }
  return `Save ${formatStoreMoney(p.discount.value)}`;
}

export function SimilarSupermarketProductCard({ item }: { item: SimilarProductItemDto }) {
  const href = `/store/supermarket/${item._id}`;
  const imageSrc = item.images[0]?.trim() || PRODUCT_IMAGE_PLACEHOLDER;
  const badge = similarDiscountLabel(item);
  const showCompare = item.comparePrice > item.finalPrice;
  const rating = item.stats?.averageRating ?? 0;
  const reviewCount = item.stats?.totalReviews ?? 0;

  return (
    <Link
      href={href}
      className="rounded-lg transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-brand-muted"
    >
      <div className="relative p-2 sm:p-4">
        {badge ? (
          <div className="absolute right-2 top-2 z-10 rounded bg-content-warning px-2 py-1 text-xs text-content-neutral-primary">
            {badge}
          </div>
        ) : null}
        <div className="relative mb-3 h-36 w-full sm:h-48">
          <ProductMedia
            src={imageSrc}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="truncate text-sm font-normal text-content-neutral-secondary sm:text-lg">
            {item.name}
          </h3>
          {item.vendor ? (
            <div className="flex items-center truncate text-xs text-content-positive sm:text-sm">
              <Store className="size-3 shrink-0 sm:size-4" aria-hidden />
              <span className="ml-1 truncate">{item.vendor.name}</span>
            </div>
          ) : null}
          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3 sm:size-4",
                    i < Math.floor(rating)
                      ? "fill-current text-content-warning"
                      : "text-content-neutral-muted"
                  )}
                />
              ))}
            </div>
            <span className="ml-1 text-xs text-content-neutral-tertiary sm:text-sm">
              {rating.toFixed(1)} ({reviewCount}{" "}
              {reviewCount === 1 ? "review" : "reviews"})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {showCompare ? (
              <span className="text-xs text-content-neutral-tertiary line-through sm:text-base">
                {formatStoreMoney(item.comparePrice)}
              </span>
            ) : null}
            <span className="text-sm font-normal text-content-neutral-secondary sm:text-lg">
              {formatStoreMoney(item.finalPrice)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
