import type { AuthUser } from "@/services/auth/auth.types";

export interface RegisterRiderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: string;
  license: File;
  photo: File;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    bankCode: string;
    accountHolderName: string;
  };
}

interface RiderUser {
  _id: string;
  email: string;
  phone: string;
  role: string;
  profile: { firstName: string; lastName: string };
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface RiderEntity {
  _id: string;
  userId: string;
  vehicleType: string;
  license: string;
  photo: string;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    bankCode: string;
    accountHolderName: string;
    isVerified: boolean;
  };
  status: string;
  stats: {
    totalDeliveries: number;
    completedDeliveries: number;
    averageRating: number;
    totalEarnings: number;
  };
  isActive: boolean;
  createdAt: string;
}

export interface RegisterRiderResponseBody {
  message: string;
  data: { user: RiderUser; rider: RiderEntity };
}

export interface RiderLoginResponseBody {
  message: string;
  data: { token: string; user: AuthUser };
}
