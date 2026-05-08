/** GET /v1/vendor/categories */
export interface VendorCategoryListResponse {
  success: boolean;
  data: string[];
}

/** Shapes from GET /v1/category — use property names as returned by the API. */
export interface CategoryDto {
  _id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: CategoryDto[];
}

/** GET /v1/product/all?search=…&status=…&categoryIds=… */
export interface ProductDto {
  _id: string;
  vendorId: string;
  name: string;
  description: string;
  categoryIds: string[];
  subcategory: string | null;
  price: number;
  comparePrice: number;
  cost: number;
  images: string[];
  inventory: {
    quantity: number;
    trackQuantity: boolean;
    allowOutOfStockPurchase: boolean;
    lowStockAlert: number;
  };
  variants: unknown;
  attributes: Record<string, unknown>;
  tags: string[];
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  success: boolean;
  data: ProductDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailStatsDto {
  averageRating: number;
  totalReviews: number;
}

/** Main document on GET /v1/product/:id */
export interface ProductDetailProductDto extends ProductDto {
  stats: ProductDetailStatsDto;
  finalPrice: number;
  discountAmount: number;
}

export interface ProductDetailCategoryRefDto {
  id: string;
  name: string;
}

export interface ProductDetailVendorRefDto {
  id: string;
  name: string;
  category: string;
}

export interface ProductSimilarDiscountDto {
  isActive: boolean;
  type: string;
  value: number;
  startsAt: string | null;
  endsAt: string | null;
}

export interface SimilarProductItemDto extends ProductDto {
  finalPrice: number;
  discountAmount: number;
  discount?: ProductSimilarDiscountDto;
  stats?: ProductDetailStatsDto;
  categories?: ProductDetailCategoryRefDto[];
  vendor?: ProductDetailVendorRefDto;
}

export interface ProductDetailResponseData {
  product: ProductDetailProductDto;
  categories: ProductDetailCategoryRefDto[];
  vendor: ProductDetailVendorRefDto;
  similarProducts: SimilarProductItemDto[];
}

export interface ProductDetailResponse {
  success?: boolean;
  data: ProductDetailResponseData;
}

/** GET /v1/vendor?page=&limit=&categories= */
export interface VendorListItem {
  _id: string;
  businessName: string;
  category: string;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };
  settings: {
    isOpen: boolean;
    deliveryRadius: number;
    minOrderAmount: number;
  };
  stats: {
    averageRating: number;
    totalReviews: number;
  };
  logo?: string;
  createdAt: string;
  productCount: number;
}

export interface VendorListResponse {
  success: boolean;
  data: VendorListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Cart line — property names match API. */
export interface CartItemDto {
  productId: string;
  vendorId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variantId: string | null;
}

export interface CartDataDto {
  items: CartItemDto[];
  itemCount: number;
  subtotal?: number;
}

export interface CartGetResponse {
  success: boolean;
  data: CartDataDto;
}

export interface CartAddBody {
  productId: string;
  quantity: number;
  variantId: string | null;
}

export interface CartAddResponse {
  success: boolean;
  message?: string;
  data: {
    items: CartItemDto[];
    itemCount: number;
  };
}

export interface CartUpdateBody {
  quantity: number;
}

export interface CartUpdateResponse {
  success: boolean;
  message?: string;
  data: {
    items: CartItemDto[];
  };
}

export interface CartRemoveResponse {
  success: boolean;
  message?: string;
  data: {
    items: CartItemDto[];
  };
}

export interface CartClearResponse {
  success: boolean;
  message?: string;
  data: {
    items: CartItemDto[];
    itemCount: number;
  };
}

export interface WishlistProductDto extends ProductDto {
  finalPrice: number;
  discountAmount: number;
}

export interface WishlistEntryDto {
  addedAt: string;
  product: WishlistProductDto;
}

export interface WishlistListResponse {
  success: boolean;
  data: WishlistEntryDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WishlistAddBody {
  productId: string;
}
