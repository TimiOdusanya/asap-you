import type { AuthUser } from "@/services/auth/auth.types";

export function isOtpVerified(user: Pick<AuthUser, "otpVerified" | "emailVerified"> | null | undefined): boolean {
  if (!user) return false;
  return user.otpVerified === true || user.emailVerified === true;
}
