import React, { Suspense } from "react";
import { StoreVendorStorefront } from "@/components/store/vendor/store-vendor-storefront";
import { StoreVendorPageSkeleton } from "@/components/store/skeletons/store-vendor-page-skeleton";

export default async function StoreVendorPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;
  return (
    <Suspense fallback={<StoreVendorPageSkeleton />}>
      <StoreVendorStorefront vendorId={vendorId} />
    </Suspense>
  );
}
