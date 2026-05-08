"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShopByCategoriesSection } from "@/components/store/categories/shop-by-categories-section";
import { StoreVendorsSection } from "@/components/store/categories/store-vendors-section";
import { buildVendorCategoryTiles } from "@/lib/vendor-category-tiles";
import {
  VENDOR_CATEGORIES_QUERY_KEY,
  fetchVendorCategories,
} from "@/services/store/vendor-categories.api";

const Categories = () => {
  const { data: categorySlugs = [], isPending, isError, refetch } = useQuery({
    queryKey: VENDOR_CATEGORIES_QUERY_KEY,
    queryFn: fetchVendorCategories,
    select: (res) =>
      res.success && Array.isArray(res.data) ? res.data : [],
  });

  const categoryTiles = useMemo(
    () => buildVendorCategoryTiles(categorySlugs),
    [categorySlugs]
  );

  return (
    <div className="mx-auto max-w-[90%] space-y-12 py-8 sm:space-y-16 sm:py-10 lg:space-y-20">
      <ShopByCategoriesSection
        isLoading={isPending}
        isError={isError}
        onRetry={() => void refetch()}
        categories={categoryTiles}
      />

      <StoreVendorsSection />
    </div>
  );
};

export default Categories;
