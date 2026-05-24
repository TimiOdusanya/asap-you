export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "on_the_way"
  | "arrived"
  | "delivered"
  | "cancelled"
  | "failed";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export type PaymentMethod = "card" | "bank_transfer" | "cash" | "wallet";

export interface OrderItemDto {
  productId: string;
  variantId?: string | null;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderPricingDto {
  subtotal: number;
  deliveryFee: number;
  serviceCharge: number;
  discount: number;
  total: number;
  currency: string;
}

export interface OrderAddressDto {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  coordinates?: { lat: number; lng: number };
}

export interface OrderDeliveryDto {
  address: OrderAddressDto;
  instructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  actor?: string;
}

export interface OrderPaymentDto {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paystackReference?: string;
  paidAt?: string;
  failureReason?: string;
}

export interface OrderDto {
  _id: string;
  orderId: string;
  customerId: string;
  vendorId: string | { _id: string; businessName: string; logo?: string };
  riderId?: string;
  status: OrderStatus;
  items: OrderItemDto[];
  pricing: OrderPricingDto;
  delivery: OrderDeliveryDto;
  timeline: OrderTimelineEntry[];
  payment: OrderPaymentDto;
  customerPhone: string;
  customerName: string;
  notes?: string;
  confirmationCode?: string;
  confirmedAt?: string;
  vendorAcceptedAt?: string;
  riderAssignedAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTrackDto {
  orderId: string;
  status: OrderStatus;
  timeline: OrderTimelineEntry[];
  delivery: OrderDeliveryDto;
  rider?: {
    riderId?: string;
    name?: string;
    phone?: string;
    vehicleType?: string;
    rating?: number;
  } | null;
  riderLocation?: {
    coordinates: { lat: number; lng: number };
    lastUpdated?: string;
    heading?: number;
    speed?: number;
  } | null;
  vendorAcceptedAt?: string;
  riderAssignedAt?: string;
  confirmedAt?: string;
}

export interface AvailableRiderDto {
  _id: string;
  name: string;
  phone: string | null;
  vehicleType: string;
  rating: number;
  totalDeliveries: number;
}

export interface CheckoutPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
  vendorId?: string;
  notes?: string;
  customerPhone?: string;
  customerName?: string;
}

export interface CheckoutResponseData {
  orders: Array<{
    orderId: string;
    status: OrderStatus;
    items: OrderItemDto[];
    pricing: OrderPricingDto;
  }>;
  payment?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
  paymentMethod: string;
  walletBalance?: number;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: CheckoutResponseData;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    orders: Array<{
      orderId: string;
      total: number;
      status: OrderStatus;
      paymentStatus: PaymentStatus;
    }>;
  };
}

export interface OrderListResponse {
  success: boolean;
  data: OrderDto[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface OrderDetailResponse {
  success: boolean;
  data: OrderDto;
}

export interface OrderTrackResponse {
  success: boolean;
  data: OrderTrackDto;
}

export interface AvailableRidersResponse {
  success: boolean;
  data: AvailableRiderDto[];
}

export interface RiderActiveDeliveryData {
  orderId: string;
  status: OrderStatus;
  items: OrderItemDto[];
  pricing: OrderPricingDto;
  customer: {
    customerId: string;
    name: string;
    phone: string;
  };
  vendor: {
    vendorId: string;
    businessName: string;
    phone?: string;
    address?: unknown;
  } | null;
  delivery: OrderDeliveryDto;
  timeline: OrderTimelineEntry[];
  vendorAcceptedAt?: string;
  riderAssignedAt?: string;
  createdAt: string;
}

export interface RiderActiveDeliveryResponse {
  success: boolean;
  data: RiderActiveDeliveryData | null;
  message?: string;
}
