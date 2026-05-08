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
  /** GET ?page=&limit=&categories=slug (omit categories for all stores) */
  LIST: "/v1/vendor",
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
  /** GET ?similarLimit= */
  byId: (productId: string) =>
    `/v1/product/${encodeURIComponent(productId)}`,
} as const;

export const CART_ENDPOINTS = {
  GET: "/v1/cart",
  ADD: "/v1/cart/add",
  item: (productId: string) =>
    `/v1/cart/item/${encodeURIComponent(productId)}`,
  CLEAR: "/v1/cart/clear",
} as const;

export const WISHLIST_ENDPOINTS = {
  LIST: "/v1/wishlist",
  item: (productId: string) =>
    `/v1/wishlist/${encodeURIComponent(productId)}`,
} as const;
