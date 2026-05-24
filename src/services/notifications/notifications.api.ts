import { apiClient } from "@/services/api/http";
import { NOTIFICATION_ENDPOINTS } from "@/services/api/endpoints";
import type { NotificationsListResponse } from "@/types/notification";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

export async function fetchNotifications(
  page = 1,
  limit = 30
): Promise<NotificationsListResponse> {
  const { data } = await apiClient.get<NotificationsListResponse>(
    NOTIFICATION_ENDPOINTS.LIST,
    { params: { page, limit } }
  );
  return data;
}

export async function markNotificationRead(
  notificationId: string
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(NOTIFICATION_ENDPOINTS.markRead(notificationId));
  return data;
}

export async function markAllNotificationsRead(): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.patch(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
  return data;
}
