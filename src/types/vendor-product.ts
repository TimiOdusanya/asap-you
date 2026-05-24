import type { ProductCatalogItemDto } from "@/types/store-api";

export interface VendorInventoryStatsDto {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  inventoryValue: number;
}

export interface VendorProductDto extends ProductCatalogItemDto {
  categoryNames?: string[];
  activeDiscountPercent?: number;
}

export interface VendorProductsResponse {
  success: boolean;
  data: VendorProductDto[];
  stats: VendorInventoryStatsDto;
}
