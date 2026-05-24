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
  ME: "/v1/vendor/me",
  /** GET ?page=&limit=&categories=slug (omit categories for all stores) */
  LIST: "/v1/vendor",
  byId: (vendorId: string) =>
    `/v1/vendor/${encodeURIComponent(vendorId)}`,
  storefront: (vendorId: string) =>
    `/v1/vendor/${encodeURIComponent(vendorId)}/storefront`,
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
  /** Authenticated vendor — own catalog + inventory stats */
  MINE: "/v1/product",
  manage: (productId: string) =>
    `/v1/product/manage/${encodeURIComponent(productId)}`,
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

export const SETTINGS_ENDPOINTS = {
  GET: "/v1/settings",
} as const;

export const ORDER_ENDPOINTS = {
  CHECKOUT: "/v1/order/checkout",
  VERIFY_PAYMENT: "/v1/order/verify-payment",
  MY_ORDERS: "/v1/order/my-orders",
  RECENT: "/v1/order/my-orders/recent",
  byId: (orderId: string) => `/v1/order/my-orders/${encodeURIComponent(orderId)}`,
  track: (orderId: string) => `/v1/order/my-orders/${encodeURIComponent(orderId)}/track`,
  confirmationCode: (orderId: string) =>
    `/v1/order/my-orders/${encodeURIComponent(orderId)}/confirmation-code`,
  cancel: (orderId: string) => `/v1/order/my-orders/${encodeURIComponent(orderId)}/cancel`,
} as const;

export const VENDOR_ORDER_ENDPOINTS = {
  LIST: "/v1/order/vendor/orders",
  AVAILABLE_RIDERS: "/v1/order/vendor/available-riders",
  byId: (orderId: string) => `/v1/order/vendor/orders/${encodeURIComponent(orderId)}`,
  accept: (orderId: string) => `/v1/order/vendor/orders/${encodeURIComponent(orderId)}/accept`,
  reject: (orderId: string) => `/v1/order/vendor/orders/${encodeURIComponent(orderId)}/reject`,
  ready: (orderId: string) => `/v1/order/vendor/orders/${encodeURIComponent(orderId)}/ready`,
  assignRider: (orderId: string) =>
    `/v1/order/vendor/orders/${encodeURIComponent(orderId)}/assign-rider`,
  track: (orderId: string) => `/v1/order/vendor/orders/${encodeURIComponent(orderId)}/track`,
} as const;

export const RIDER_DELIVERY_ENDPOINTS = {
  PROFILE: "/v1/rider/profile",
  GO_ONLINE: "/v1/rider/go-online",
  GO_OFFLINE: "/v1/rider/go-offline",
  LOCATION: "/v1/rider/location",
  DELIVERIES: "/v1/rider/deliveries",
  ACTIVE: "/v1/rider/deliveries/active",
  byId: (orderId: string) => `/v1/rider/deliveries/${encodeURIComponent(orderId)}`,
  track: (orderId: string) => `/v1/rider/deliveries/${encodeURIComponent(orderId)}/track`,
  pickUp: (orderId: string) => `/v1/rider/deliveries/${encodeURIComponent(orderId)}/pick-up`,
  onTheWay: (orderId: string) => `/v1/rider/deliveries/${encodeURIComponent(orderId)}/on-the-way`,
  arrived: (orderId: string) => `/v1/rider/deliveries/${encodeURIComponent(orderId)}/arrived`,
  confirm: (orderId: string) => `/v1/rider/deliveries/${encodeURIComponent(orderId)}/confirm`,
} as const;

export const ADMIN_ENDPOINTS = {
  DASHBOARD: "/v1/admin/dashboard",
  ORDERS: "/v1/order/vendor/orders",
} as const;

export const NOTIFICATION_ENDPOINTS = {
  LIST: "/v1/notifications",
  markRead: (id: string) => `/v1/notifications/${encodeURIComponent(id)}/read`,
  MARK_ALL_READ: "/v1/notifications/read-all",
} as const;
