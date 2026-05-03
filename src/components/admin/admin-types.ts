export type AdminAccountStatus = "active" | "blocked" | "deleted";

export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface AdminAddress {
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface AdminBankAccount {
  accountNumber: string;
  bankName: string;
  bankCode?: string;
  accountHolderName: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: AdminAccountStatus;
  createdAt: string;
  lastActiveAt?: string;
  ordersCount: number;
  totalSpent: number;
  rating?: number;
  profile?: {
    preferences?: {
      notifications?: { email: boolean; sms: boolean; push: boolean };
      language?: string;
      currency?: string;
    };
    lastKnownAddress?: string;
  };
}

export interface AdminVendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  status: AdminAccountStatus;
  createdAt: string;
  verificationStatus: VerificationStatus;
  submittedAt?: string;
  verifiedAt?: string;
  productsCount: number;
  averageRating?: number;
  onboarding: {
    owner: { firstName: string; lastName: string; email: string };
    business: {
      businessName: string;
      category: string;
      phone: string;
      contactEmail: string;
      legalName?: string;
      isBusinessRegistered: boolean;
      address: AdminAddress;
    };
    verification: {
      businessSize: string;
      logoUrl?: string;
      registrationCertificateUrl?: string;
      bankAccount: AdminBankAccount;
    };
    operatingHours: { day: number; open: string; close: string; isClosed: boolean }[];
  };
}

export interface AdminRider {
  id: string;
  name: string;
  email: string;
  status: AdminAccountStatus;
  createdAt: string;
  verificationStatus: VerificationStatus;
  submittedAt?: string;
  verifiedAt?: string;
  deliveriesCount: number;
  averageRating?: number;
  onboarding: {
    basic: { firstName: string; lastName: string; email: string; phone: string };
    profile: {
      vehicleType: string;
      licenseUrl?: string;
      photoUrl?: string;
      bankAccount: AdminBankAccount;
    };
  };
}

export interface AdminOrder {
  id: string;
  customerName: string;
  vendorName: string;
  total: number;
  status: "pending" | "in_progress" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AdminReview {
  id: string;
  authorName: string;
  target: "product" | "vendor" | "rider";
  targetName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

