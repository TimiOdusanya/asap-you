import { VendorProductEdit } from "@/components/vendor/dashboard/vendor-product-edit";

export default async function VendorProductEditPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <VendorProductEdit productId={productId} />;
}
