import type {
  ProductDto,
  VendorListItem,
  VendorStorefrontProductDto,
  VendorStorefrontVendorDto,
} from "@/types/store-api";

export function vendorStorefrontVendorToListItem(
  v: VendorStorefrontVendorDto
): VendorListItem {
  const parts = v.addressFormatted.split(" · ").map((s) => s.trim());
  return {
    _id: v.id,
    businessName: v.businessName,
    category: v.category,
    address: {
      addressLine1: parts[0] ?? v.addressFormatted,
      city: parts[1] ?? "",
      state: parts[2] ?? "",
      postalCode: parts[3] ?? "",
      coordinates: { type: "Point", coordinates: [0, 0] },
    },
    settings: {
      isOpen: v.isOpen,
      deliveryRadius: v.deliveryRadiusKm,
      minOrderAmount: v.minOrderAmount,
    },
    stats: {
      averageRating: v.averageRating,
      totalReviews: v.totalReviews,
    },
    logo: v.logo,
    createdAt: "",
    productCount: 0,
  };
}

export function storefrontProductToProductDto(
  vendorId: string,
  p: VendorStorefrontProductDto
): ProductDto {
  const listPrice = p.price > 0 ? p.price : p.finalPrice;
  const sellPrice = p.finalPrice > 0 ? p.finalPrice : p.price;
  const max = Math.max(1, p.maxOrderable);
  return {
    _id: p._id,
    vendorId,
    name: p.name,
    description: p.description ?? "",
    categoryIds: [],
    subcategory: null,
    price: p.showFromPrefix ? p.priceFrom : sellPrice,
    comparePrice: listPrice,
    cost: 0,
    images: Array.isArray(p.images) ? p.images : [],
    inventory: {
      quantity: max,
      trackQuantity: true,
      allowOutOfStockPurchase: false,
      lowStockAlert: 0,
    },
    variants: null,
    attributes: {},
    tags: [],
    status: "active",
    isActive: true,
    createdAt: "",
    updatedAt: "",
  };
}
