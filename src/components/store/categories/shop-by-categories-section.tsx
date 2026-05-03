"use client";

import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import { CategoryGridSkeleton } from "@/components/store/skeletons/category-grid-skeleton";
import type { StoreCategoryTile } from "@/lib/vendor-category-tiles";

export interface ShopByCategoriesSectionProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  categories: StoreCategoryTile[];
}

export function ShopByCategoriesSection({
  isLoading,
  isError,
  onRetry,
  categories,
}: ShopByCategoriesSectionProps) {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-6">
      <h1 className="text-lg font-medium text-content-neutral-primary sm:text-xl md:text-2xl lg:text-3xl">
        Shop by Categories
      </h1>

      {isLoading ? (
        <CategoryGridSkeleton count={8} />
      ) : isError ? (
        <EmptyState
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.store}
          illustrationAlt=""
          title="Couldn’t load categories"
          description="Check your connection and try again."
          action={{ label: "Try again", onClick: onRetry }}
        />
      ) : categories.length === 0 ? (
        <EmptyState
          illustrationSrc={EMPTY_STATE_ILLUSTRATION.store}
          illustrationAlt=""
          title="No categories yet"
          description="You can still browse the supermarket and search for products while we add more."
          action={{ label: "Go to Supermarket", href: "/store/supermarkets" }}
        />
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/store/supermarkets?category=${encodeURIComponent(c.slug)}`}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span
                className="relative size-[72px] shrink-0 overflow-hidden rounded-[12px] bg-surface-subtle sm:size-[100px]"
                aria-hidden
              >
                <Image
                  src={c.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 18vw, 100px"
                />
              </span>
              {/* <span className="text-center text-xs text-content-neutral-primary sm:text-sm">
                {c.label}
              </span> */}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
