export type NotificationType =
  | "order_placed"
  | "order_accepted"
  | "order_rejected"
  | "order_preparing"
  | "order_ready"
  | "rider_assigned"
  | "order_picked_up"
  | "order_on_the_way"
  | "order_delivered"
  | "order_cancelled"
  | "delivery_confirmed"
  | "rider_location_update"
  | "promotional"
  | "system"
  | "security";

export interface NotificationDto {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: {
    orderId?: string;
    [key: string]: unknown;
  };
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsListResponse {
  success: boolean;
  data: NotificationDto[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
