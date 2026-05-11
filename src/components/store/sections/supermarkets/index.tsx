"use client";

import React, { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import ProductListingPage from "../../shared/ProductListingPage";
import { getBreadcrumbs } from "@/lib/storeData";
import { mapProductCatalogItemToListingProduct } from "@/lib/map-product-catalog-item-to-listing-product";
import {
  fetchProductCatalog,
  productCatalogQueryKey,
} from "@/services/store/products-list.api";
import { StoreSupermarketFilterSidebar } from "@/components/store/supermarkets/store-supermarket-filter-sidebar";
import type { ProductCatalogQuery } from "@/types/store-api";

function buildCatalogBase(
  searchParams: URLSearchParams
): Omit<ProductCatalogQuery, "page"> {
  const category = (searchParams.get("category") ?? "supermarket")
    .trim()
    .toLowerCase();

  const parseNum = (key: string, fallback: number) => {
    const raw = searchParams.get(key);
    if (raw === null || raw === "") return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const discountOnly = searchParams.has("discountOnly")
    ? searchParams.get("discountOnly") === "true"
    : true;

  return {
    limit: Math.min(100, Math.max(1, parseNum("limit", 12))),
    status: searchParams.get("status") ?? "active",
    vendorCategories: category,
    vendorId: searchParams.get("vendorId")?.trim() || undefined,
    discountOnly,
    minRating: searchParams.has("minRating")
      ? parseNum("minRating", 0)
      : undefined,
    priceMin: searchParams.has("priceMin")
      ? parseNum("priceMin", 0)
      : undefined,
    priceMax: searchParams.has("priceMax")
      ? parseNum("priceMax", 0)
      : undefined,
    sort: searchParams.get("sort") ?? "discountDesc",
    search: searchParams.get("search")?.trim() || undefined,
    categoryIds: searchParams.get("categoryIds")?.trim() || undefined,
  };
}

const API_SORT_OPTIONS = [
  { value: "discountDesc", label: "Discount: highest first" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "ratingDesc", label: "Rating" },
] as const;

const Supermarkets = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterKey = searchParams.toString();

  const baseQuery = useMemo(
    () => buildCatalogBase(new URLSearchParams(filterKey)),
    [filterKey]
  );

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: productCatalogQueryKey(baseQuery),
    queryFn: async ({ pageParam }) => {
      const res = await fetchProductCatalog({
        ...baseQuery,
        page: pageParam as number,
      });
      if (!res.success) throw new Error("Failed to load products");
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (last) => {
      if (!last?.success || !last.pagination) return undefined;
      const { page, totalPages } = last.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const products = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        Array.isArray(page.data)
          ? page.data.map(mapProductCatalogItemToListingProduct)
          : []
      ) ?? [],
    [data]
  );

  const breadcrumbs = getBreadcrumbs("Supermarket");

  const sortValue = baseQuery.sort ?? "discountDesc";

  const onSortChange = (value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("sort", value);
    router.push(`/store/supermarkets?${p.toString()}`);
  };

  const isLoading = isPending;

  return (
    <ProductListingPage
      category="Supermarket"
      products={products}
      breadcrumbs={breadcrumbs}
      isLoading={isLoading}
      filterSidebar={<StoreSupermarketFilterSidebar />}
      hideStubActiveFilters
      sortValue={sortValue}
      onSortChange={onSortChange}
      sortOptions={[...API_SORT_OPTIONS]}
      hasNextPage={Boolean(hasNextPage)}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={
        hasNextPage ? () => void fetchNextPage() : undefined
      }
      productPathSegment="supermarket"
      emptyState={
        isError
          ? {
              title: "Could not load products",
              description:
                "Check your connection or adjust filters in the address bar, then try again.",
              action: { label: "Back to store", href: "/store" },
            }
          : undefined
      }
    />
  );
};

export default Supermarkets;
