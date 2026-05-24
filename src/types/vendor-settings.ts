export interface VendorOperatingHourDto {
  day: number;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface VendorSettingsDto {
  _id: string;
  businessName: string;
  description: string;
  category: string;
  logo: string | null;
  businessInfo: {
    legalName: string;
    contactEmail: string;
    contactPhone: string;
    taxId?: string;
    businessRegistration?: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  settings: {
    isOpen: boolean;
    operatingHours: VendorOperatingHourDto[];
    deliveryRadius: number;
    minOrderAmount: number;
    preparationTime: number;
    autoAcceptOrders: boolean;
  };
  stats: {
    totalOrders: number;
    completedOrders: number;
    averageRating: number;
    totalReviews: number;
    monthlyRevenue: number;
  };
  email: string;
  phone: string;
}

export interface VendorSettingsResponse {
  success: boolean;
  data: VendorSettingsDto;
  message?: string;
}

export interface UpdateVendorSettingsPayload {
  businessName?: string;
  description?: string;
  category?: string;
  businessInfo?: {
    legalName?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  settings?: {
    isOpen?: boolean;
    operatingHours?: VendorOperatingHourDto[];
    minOrderAmount?: number;
    preparationTime?: number;
    deliveryRadius?: number;
  };
}
