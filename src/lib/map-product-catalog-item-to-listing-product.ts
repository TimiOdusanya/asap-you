import type { Product } from "@/components/store/shared/ProductCard";
import {
  formatStoreMoney,
  PRODUCT_IMAGE_PLACEHOLDER,
} from "@/components/store/shared/store-supermarket-product-detail-parts";
import { isProductOutOfStock } from "@/lib/product-availability";
import type { ProductCatalogItemDto } from "@/types/store-api";

function discountBadge(p: ProductCatalogItemDto): string | undefined {
  const amt = p.discountAmount ?? 0;
  if (p.discount?.isActive) {
    if (p.discount.type === "percent") {
      return `${p.discount.value}% off`;
    }
    return `${formatStoreMoney(p.discount.value)} off`;
  }
  if (amt > 0) {
    return `${formatStoreMoney(amt)} off`;
  }
  return undefined;
}

export function mapProductCatalogItemToListingProduct(
  p: ProductCatalogItemDto
): Product {
  const listPrice = p.comparePrice > 0 ? p.comparePrice : p.price;
  const effective = p.effectivePrice ?? p.finalPrice ?? p.price;
  const hasStrike = effective < listPrice || (p.discountAmount ?? 0) > 0;
  const img = p.images[0]?.trim() || PRODUCT_IMAGE_PLACEHOLDER;
  const rating = p.stats?.averageRating ?? 0;
  const tag = p.tags[0];
  const discount = discountBadge(p) ?? (hasStrike ? "Sale" : undefined);

  return {
    id: p._id,
    name: p.name,
    store: "Supermarket",
    rating,
    currentPrice: formatStoreMoney(effective),
    originalPrice: hasStrike ? formatStoreMoney(listPrice) : undefined,
    discount,
    image: img,
    category: tag ?? "Groceries",
    outOfStock: isProductOutOfStock(p),
  };
}
