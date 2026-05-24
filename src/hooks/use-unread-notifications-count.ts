"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import {
  fetchNotifications,
  NOTIFICATIONS_QUERY_KEY,
} from "@/services/notifications/notifications.api";
import { useAuthStore } from "@/stores/auth-store";

export function useUnreadNotificationsCount() {
  const authHydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "unread-count"] as const,
    queryFn: () => fetchNotifications(1, 1),
    enabled: authHydrated && Boolean(token),
    staleTime: 30_000,
    refetchInterval: 30_000,
    select: (res) => (res.success ? res.unreadCount : 0),
  });

  return data ?? 0;
}
