import React, { Suspense } from "react";
import Supermarkets from "@/components/store/sections/supermarkets";
import { ProductGridSkeleton } from "@/components/store/skeletons/product-grid-skeleton";

export default function SupermarketsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-subtle py-8">
          <div className="mx-auto max-w-[95%] md:max-w-[90%]">
            <ProductGridSkeleton viewMode="grid" />
          </div>
        </div>
      }
    >
      <Supermarkets />
    </Suspense>
  );
}
