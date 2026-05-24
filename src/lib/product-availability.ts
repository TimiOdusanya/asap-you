/** Shared product availability checks for store UI and cart validation. */

export interface ProductAvailabilityInput {
  status?: string;
  inventory?: {
    quantity?: number;
    trackQuantity?: boolean;
    allowOutOfStockPurchase?: boolean;
  };
}

export function isProductOutOfStock(product: ProductAvailabilityInput): boolean {
  if (product.status === "inactive" || product.status === "out_of_stock") {
    return true;
  }

  const inventory = product.inventory;
  if (!inventory) return false;
  if (inventory.allowOutOfStockPurchase) return false;
  if (!inventory.trackQuantity) return false;

  return (inventory.quantity ?? 0) <= 0;
}

export function isProductPurchasable(product: ProductAvailabilityInput): boolean {
  return !isProductOutOfStock(product);
}

export function getMaxPurchasableQuantity(product: ProductAvailabilityInput): number {
  if (isProductOutOfStock(product)) return 0;
  const inventory = product.inventory;
  if (!inventory?.trackQuantity || inventory.allowOutOfStockPurchase) {
    return 99;
  }
  return Math.max(0, inventory.quantity ?? 0);
}
