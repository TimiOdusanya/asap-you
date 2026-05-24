import type {
  ProductDto,
  VendorListItem,
  VendorStorefrontProductDto,
  VendorStorefrontVendorDto,
} from "@/types/store-api";
import {
  getMaxPurchasableQuantity,
  isProductOutOfStock,
} from "@/lib/product-availability";

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

  const inventory = {
    quantity: p.inventory?.quantity ?? p.maxOrderable ?? 0,
    trackQuantity: p.inventory?.trackQuantity ?? p.maxOrderable !== null,
    allowOutOfStockPurchase: p.inventory?.allowOutOfStockPurchase ?? false,
    lowStockAlert: 0,
  };

  const productShape = {
    status: p.status ?? "active",
    inventory,
  };

  const outOfStock = isProductOutOfStock(productShape);
  const maxQty = getMaxPurchasableQuantity(productShape);

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
      ...inventory,
      quantity: outOfStock ? 0 : maxQty,
    },
    variants: null,
    attributes: {},
    tags: [],
    status: outOfStock ? "out_of_stock" : (p.status ?? "active"),
    isActive: true,
    createdAt: "",
    updatedAt: "",
  };
}
