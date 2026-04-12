import { apiClient } from "@/services/api/http";
import { AUTH_ENDPOINTS } from "@/services/api/endpoints";
import type {
  LoginRequestBody,
  LoginResponseBody,
  RegisterRequestBody,
  RegisterResponseBody,
  ResendOtpRequestBody,
  ResendOtpResponseBody,
  VerifyOtpRequestBody,
  VerifyOtpResponseBody,
} from "@/services/auth/auth.types";

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
