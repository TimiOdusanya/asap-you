"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminOrdersSocket, useUserNotificationSocket } from "@/hooks/use-socket";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { useAuthStore } from "@/stores/auth-store";
import { NOTIFICATIONS_QUERY_KEY } from "@/services/notifications/notifications.api";
import { myOrdersQueryKey } from "@/services/store/orders.api";
import { vendorOrdersQueryKey } from "@/services/vendor/vendor-orders.api";

/** Keeps notifications and order lists in sync via WebSocket. Mount once per authenticated shell. */
export function RealtimeSync() {
  const queryClient = useQueryClient();
  const hydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const enabled = hydrated && Boolean(token);

  useUserNotificationSocket(
    React.useCallback(() => {
      if (!enabled) return;
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      if (role === "customer") {
        queryClient.invalidateQueries({ queryKey: myOrdersQueryKey() });
      }
      if (role === "vendor") {
        queryClient.invalidateQueries({ queryKey: vendorOrdersQueryKey() });
      }
    }, [enabled, queryClient, role])
  );

  useAdminOrdersSocket(
    React.useCallback(() => {
      if (!enabled || role !== "admin") return;
      queryClient.invalidateQueries({ queryKey: vendorOrdersQueryKey() });
    }, [enabled, queryClient, role]),
    enabled && role === "admin"
  );

  return null;
}
