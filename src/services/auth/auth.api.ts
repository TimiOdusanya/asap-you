import { apiClient } from "@/services/api/http";
import { AUTH_ENDPOINTS } from "@/services/api/endpoints";
import type {
  AuthUser,
  LoginRequestBody,
  LoginResponseBody,
  RegisterRequestBody,
  RegisterResponseBody,
  ResendOtpRequestBody,
  ResendOtpResponseBody,
  VerifyOtpRequestBody,
  VerifyOtpResponseBody,
} from "@/services/auth/auth.types";

export const currentUserQueryKey = ["auth", "me"] as const;

export interface CurrentUserResponse {
  message: string;
  data: AuthUser;
}

export interface UpdateProfilePayload {
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  };
  preferences?: {
    notifications?: { email?: boolean; sms?: boolean; push?: boolean };
    language?: string;
    currency?: string;
  };
}

export async function login(body: LoginRequestBody): Promise<LoginResponseBody> {
  const { data } = await apiClient.post<LoginResponseBody>(
    AUTH_ENDPOINTS.LOGIN,
    body
  );
  return data;
}

export async function register(
  body: RegisterRequestBody
): Promise<RegisterResponseBody> {
  const { data } = await apiClient.post<RegisterResponseBody>(
    AUTH_ENDPOINTS.REGISTER,
    body
  );
  return data;
}

export async function verifyOtp(
  body: VerifyOtpRequestBody
): Promise<VerifyOtpResponseBody> {
  const { data } = await apiClient.post<VerifyOtpResponseBody>(
    AUTH_ENDPOINTS.OTP_VERIFY,
    body
  );
  return data;
}

export async function resendOtp(
  body: ResendOtpRequestBody
): Promise<ResendOtpResponseBody> {
  const { data } = await apiClient.post<ResendOtpResponseBody>(
    AUTH_ENDPOINTS.OTP_SEND,
    body
  );
  return data;
}

export async function fetchCurrentUser(): Promise<CurrentUserResponse> {
  const { data } = await apiClient.get<CurrentUserResponse>(AUTH_ENDPOINTS.ME);
  return data;
}

export async function updateUserProfile(
  body: UpdateProfilePayload
): Promise<CurrentUserResponse> {
  const { data } = await apiClient.patch<CurrentUserResponse>(
    AUTH_ENDPOINTS.PROFILE,
    body
  );
  return data;
}
