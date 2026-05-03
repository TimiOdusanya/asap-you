export const AUTH_ENDPOINTS = {
  LOGIN: "/v1/auth/login",
  REGISTER: "/v1/auth/register",
  OTP_VERIFY: "/v1/auth/otp/verify",
  OTP_SEND: "/v1/auth/otp/send",
} as const;

export const VENDOR_ENDPOINTS = {
  REGISTER: "/v1/auth/register-vendor",
  LOGIN: "/v1/auth/login",
  CATEGORIES: "/v1/vendor/categories",
} as const;

export const RIDER_ENDPOINTS = {
  REGISTER: "/v1/auth/register-rider",
  LOGIN: "/v1/auth/login",
} as const;

/** If the backend uses a versioned path (e.g. /v1/address), change only this value. */
export const ADDRESS_ENDPOINTS = {
  LIST: "/v1/address",
  CREATE: "/v1/address",
} as const;

export const CATEGORY_ENDPOINTS = {
  LIST: "/v1/category",
} as const;

export const PRODUCT_ENDPOINTS = {
  ALL: "/v1/product/all",
} as const;
