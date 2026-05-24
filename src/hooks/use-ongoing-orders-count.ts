"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { isOngoingOrderStatus } from "@/lib/order-status";
import { fetchMyOrders, myOrdersQueryKey } from "@/services/store/orders.api";
import { useAuthStore } from "@/stores/auth-store";

export function useOngoingOrdersCount() {
  const authHydrated = useAuthHydrated();
  const token = useAuthStore((s) => s.token);

  const { data } = useQuery({
    queryKey: [...myOrdersQueryKey(), "ongoing-count"] as const,
    queryFn: () => fetchMyOrders(1, 50),
    enabled: authHydrated && Boolean(token),
    staleTime: 60_000,
  });

  return React.useMemo(() => {
    const orders = data?.data ?? [];
    return orders.filter((o) => isOngoingOrderStatus(o.status)).length;
  }, [data]);
}
