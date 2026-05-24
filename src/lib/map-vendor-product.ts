import type { VendorProductDto } from "@/types/vendor-product";
import type { VendorProduct } from "@/components/vendor/dashboard/vendor-product-card";

const FALLBACK_IMAGE = "/images/landing/pepper.png";

function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function formatAddedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function mapVendorProductDtoToCard(product: VendorProductDto): VendorProduct {
  const unitPrice = product.finalPrice ?? product.price;
  const stock = product.inventory.quantity;
  const isAvailable =
    product.status === "active" &&
    (stock > 0 || product.inventory.allowOutOfStockPurchase);

  return {
    id: String(product._id),
    name: product.name,
    description: product.description,
    category: product.categoryNames?.join(", ") || "Uncategorized",
    price: formatPrice(unitPrice),
    stock,
    image: product.images[0] ?? FALLBACK_IMAGE,
    isAvailable,
    addedAt: formatAddedDate(product.createdAt),
    discount: product.activeDiscountPercent,
  };
}

export function formatInventoryValue(value: number): string {
  return formatPrice(value);
}
