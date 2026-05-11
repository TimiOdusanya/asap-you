import type { ProductDto } from "@/types/store-api";

export const VENDOR_STORE_MENU_TAB_IDS = [
  "snacks",
  "beverages",
  "main_menu",
  "proteins",
  "sides",
  "desserts",
] as const;

export type VendorStoreMenuTabId = (typeof VENDOR_STORE_MENU_TAB_IDS)[number];

export const VENDOR_STORE_MENU_TAB_LABELS: Record<VendorStoreMenuTabId, string> =
  {
    snacks: "Snacks",
    beverages: "Beverages",
    main_menu: "Main menu",
    proteins: "Proteins",
    sides: "Sides",
    desserts: "Desserts",
  };

/** Stable dummy bucket per product for tab filtering until menu categories exist on products. */
export function vendorStoreTabForProduct(productId: string): VendorStoreMenuTabId {
  let sum = 0;
  for (let i = 0; i < productId.length; i++) {
    sum += productId.charCodeAt(i);
  }
  return VENDOR_STORE_MENU_TAB_IDS[sum % VENDOR_STORE_MENU_TAB_IDS.length];
}

export function groupProductsByVendorTab(
  products: ProductDto[]
): Record<VendorStoreMenuTabId, ProductDto[]> {
  const out = {} as Record<VendorStoreMenuTabId, ProductDto[]>;
  for (const id of VENDOR_STORE_MENU_TAB_IDS) {
    out[id] = [];
  }
  for (const p of products) {
    out[vendorStoreTabForProduct(p._id)].push(p);
  }
  return out;
}
