import type { AuthUser } from "@/services/auth/auth.types";

export interface VendorAddress {
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
}

export interface VendorBankAccount {
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
}

export interface VendorBusinessInfo {
  legalName: string;
  contactEmail: string;
  contactPhone: string;
  taxId: string;
}

export interface VendorOperatingHour {
  day: number;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface RegisterVendorPayload {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  businessName: string;
  category: string;
  businessSize: string;
  isBusinessRegistered: string;
  logo: File;
  bankAccount: VendorBankAccount;
  businessInfo: VendorBusinessInfo;
  address: VendorAddress;
  operatingHours: VendorOperatingHour[];
  businessRegistrationCertificate?: File;
}

export interface VendorEntity {
  _id: string;
  userId: string;
  businessName: string;
  description: string;
  category: string;
  logo: string;
  isBusinessRegistered: boolean;
  businessSize: string;
  bankAccount: VendorBankAccount;
  address: VendorAddress;
  businessInfo: VendorBusinessInfo & { businessRegistration?: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterVendorResponseBody {
  message: string;
  data: {
    user: AuthUser;
    vendor: VendorEntity;
  };
}

export interface VendorLoginResponseBody {
  message: string;
  data: {
    user: AuthUser;
    token: string;
    otpVerified?: boolean;
  };
}
