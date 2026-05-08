import { StoreSupermarketProductDetail } from "@/components/store/shared/store-supermarket-product-detail";

export default async function StoreSupermarketProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  return <StoreSupermarketProductDetail productId={productId} />;
}
