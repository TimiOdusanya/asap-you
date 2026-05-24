export interface VendorProductCategoryDto {
  id: string;
  name: string;
  icon: string;
  iconUrl: string;
  sortOrder: number;
  productCount?: number;
}

export interface VendorProductCategoriesResponse {
  success: boolean;
  data: VendorProductCategoryDto[];
  message?: string;
}

export interface CreateVendorProductCategoriesPayload {
  categories: Array<{ name: string; icon: string }>;
}
