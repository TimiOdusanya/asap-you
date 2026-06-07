import type { OrderDto, OrderStatus } from "@/types/order";

export interface AdminUserRecord {
  _id: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  preferences?: {
    notifications?: { email: boolean; sms: boolean; push: boolean };
    language?: string;
    currency?: string;
  };
  createdAt: string;
  updatedAt: string;
  ordersCount?: number;
  totalSpent?: number;
}

export interface AdminVendorDocument {
  type: string;
  url: string;
  status: string;
  uploadedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface AdminVendorRecord {
  _id: string;
  userId: string;
  businessName: string;
  description?: string;
  category: string;
  isActive: boolean;
  isBusinessRegistered?: boolean;
  businessSize?: string;
  logo?: string | null;
  businessInfo?: {
    legalName?: string;
    contactEmail?: string;
    contactPhone?: string;
    taxId?: string;
    businessRegistration?: string;
  };
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  bankAccount?: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
  };
  settings?: {
    operatingHours?: { day: number; open: string; close: string; isClosed: boolean }[];
  };
  verification: {
    isVerified: boolean;
    verifiedAt?: string | null;
    documents?: AdminVendorDocument[];
  };
  stats?: {
    totalOrders?: number;
    averageRating?: number;
    totalReviews?: number;
  };
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    phone: string;
    profile?: AdminUserRecord["profile"];
  } | null;
}

export interface AdminRiderRecord {
  _id: string;
  userId: string;
  vehicleType: string;
  license: string;
  photo?: string;
  isActive: boolean;
  status: string;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    bankCode?: string;
    accountHolderName: string;
  };
  stats: {
    totalDeliveries: number;
    completedDeliveries: number;
    averageRating: number;
    totalEarnings: number;
  };
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    phone: string;
    profile?: AdminUserRecord["profile"];
  } | null;
}

export interface AdminReviewRecord {
  _id: string;
  rating: number;
  comment?: string;
  targetType: string;
  targetId?: string;
  isActive: boolean;
  createdAt: string;
  customerName?: string;
  productName?: string | null;
}

export interface AdminDashboardData {
  users: {
    byRole: Record<string, number>;
    total: number;
    active: number;
    inactive: number;
  };
  riders: { total: number; active: number };
  vendors: { total: number; active: number; verified: number };
  ordersLast24h: {
    total: number;
    byStatus: { status: string; count: number }[];
  };
  pendingVendorVerifications: number;
  pendingRiderApprovals: number;
  blockedCustomers: number;
  recentOrders: {
    _id: string;
    orderId: string;
    customerName: string;
    status: OrderStatus;
    pricing: { total: number };
    createdAt: string;
    vendor?: { _id: string | null; businessName: string | null };
  }[];
  recentReviews: {
    _id: string;
    rating: number;
    comment: string;
    targetType: string;
    createdAt: string;
    customerName: string;
  }[];
}

export interface AdminPaginatedUsers {
  users: AdminUserRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminPaginatedVendors {
  vendors: AdminVendorRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminPaginatedRiders {
  riders: AdminRiderRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminPaginatedOrders {
  orders: OrderDto[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminPaginatedReviews {
  reviews: AdminReviewRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUserDetailData {
  user: AdminUserRecord;
  vendor: AdminVendorRecord | null;
  rider: AdminRiderRecord | null;
  orders: OrderDto[];
  reviews: AdminReviewRecord[];
}

export interface AdminVendorDetailData {
  vendor: AdminVendorRecord;
  user: {
    email: string;
    phone: string;
    profile?: AdminUserRecord["profile"];
  } | null;
  products: {
    _id: string;
    name: string;
    price: number;
    stats?: { averageRating?: number };
    isActive: boolean;
  }[];
  productCount: number;
}

export interface AdminRiderDetailData {
  rider: AdminRiderRecord;
  user: {
    email: string;
    phone: string;
    profile?: AdminUserRecord["profile"];
  } | null;
  stats: AdminRiderRecord["stats"];
  recentOrders: {
    _id: string;
    orderId: string;
    customerName: string;
    status: OrderStatus;
    pricing: { total: number };
    createdAt: string;
  }[];
  reviews: {
    _id: string;
    rating: number;
    comment?: string;
    isActive: boolean;
    createdAt: string;
    customerName?: string;
  }[];
}
