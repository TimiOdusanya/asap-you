const STORE_CATEGORY_IMAGES = [
  "/images/store/supermarket.svg",
  "/images/store/restaurant.svg",
  "/images/store/drinks.svg",
  "/images/store/pharmacy2.svg",
] as const;

const SLUG_TO_IMAGE: Record<string, string> = {
  supermarket: "/images/store/supermarket.svg",
  restaurant: "/images/store/restaurant.svg",
  drinks: "/images/store/drinks.svg",
  pharmacy: "/images/store/pharmacy2.svg",
  gas_station: "/images/store/gas-filling.svg",
  bakery: "/images/store/bakery.svg",
  electronics: "/images/store/electronics.svg",
  fashion: "/images/store/fashion.svg",
};

export interface StoreCategoryTile {
  slug: string;
  label: string;
  imageSrc: string;
}

export function formatVendorCategoryLabel(slug: string): string {
  return slug
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function resolveVendorCategoryImage(slug: string, index: number): string {
  const mapped = SLUG_TO_IMAGE[slug];
  if (mapped) return mapped;
  return STORE_CATEGORY_IMAGES[index % STORE_CATEGORY_IMAGES.length];
}

export function buildVendorCategoryTiles(slugs: string[]): StoreCategoryTile[] {
  return slugs.map((slug, index) => ({
    slug,
    label: formatVendorCategoryLabel(slug),
    imageSrc: resolveVendorCategoryImage(slug, index),
  }));
}
