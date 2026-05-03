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
