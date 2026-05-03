export type UserRole = "customer" | "vendor" | "rider" | "admin";

export interface UserProfile {
  firstName: string;
  lastName: string;
}

export interface UserPreferencesNotifications {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface UserPreferences {
  notifications: UserPreferencesNotifications;
  language: string;
  currency: string;
}

export interface AuthUser {
  _id: string;
  email: string;
  phone: string;
  role: UserRole;
  profile: UserProfile;
  preferences: UserPreferences;
  emailVerified: boolean;
  phoneVerified: boolean;
  otpVerified?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLogin?: string;
}

export interface LoginResponseBody {
  message: string;
  data: {
    user: AuthUser;
    token: string;
    /** When false, client must collect OTP before treating onboarding as complete. */
    otpVerified?: boolean;
  };
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponseBody {
  message: string;
  data: AuthUser;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface VerifyOtpRequestBody {
  email: string;
  otpCode: string;
}

export interface VerifyOtpResponseBody {
  message: string;
  data: {
    token?: string;
    user?: AuthUser;
  } | null;
}

export interface ResendOtpRequestBody {
  email: string;
}

export interface ResendOtpResponseBody {
  message: string;
  data: null;
}
