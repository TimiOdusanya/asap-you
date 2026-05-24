"use client";

import * as React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { StoreOrderCard } from "@/components/store/orders/store-order-card";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import { isOngoingOrderStatus } from "@/lib/order-status";
import { fetchMyOrders, myOrdersQueryKey } from "@/services/store/orders.api";
import type { OrderDto } from "@/types/order";
import { cn } from "@/lib/utils";

type OrdersTab = "ongoing" | "completed";

function splitOrders(orders: OrderDto[]) {
  const ongoing: OrderDto[] = [];
  const completed: OrderDto[] = [];
  for (const order of orders) {
    if (isOngoingOrderStatus(order.status)) ongoing.push(order);
    else completed.push(order);
  }
  return { ongoing, completed };
}

function OrdersTabBar({
  active,
  onChange,
  ongoingCount,
  completedCount,
}: {
  active: OrdersTab;
  onChange: (tab: OrdersTab) => void;
  ongoingCount: number;
  completedCount: number;
}) {
  const tabs: { id: OrdersTab; label: string; count: number }[] = [
    { id: "ongoing", label: "Ongoing", count: ongoingCount },
    { id: "completed", label: "Completed", count: completedCount },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-1 rounded-2xl bg-surface-muted/80 p-1.5 ring-1 ring-border-muted/60"
      role="tablist"
      aria-label="Order categories"
    >
      {tabs.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all",
              selected
                ? "bg-white text-content-neutral-primary shadow-sm ring-1 ring-black/[0.04]"
                : "text-content-neutral-muted hover:text-content-neutral-secondary"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                selected ? "bg-primary/12 text-primary" : "bg-white/60 text-content-neutral-muted"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function OrdersListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-[148px] animate-pulse rounded-2xl bg-surface-muted" />
      ))}
    </div>
  );
}

function TabEmptyState({ tab }: { tab: OrdersTab }) {
  const isOngoing = tab === "ongoing";
  return (
    <EmptyState
      className="rounded-2xl border border-dashed border-border-muted bg-white/80 py-12"
      illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
      illustrationAlt=""
      title={isOngoing ? "No ongoing orders" : "No completed orders yet"}
      description={
        isOngoing
          ? "When you place an order, it will show here until it is delivered."
          : "Delivered and past orders will appear in this tab."
      }
      action={isOngoing ? { label: "Start shopping", href: "/store" } : undefined}
    />
  );
}

export function StoreOrderHistory() {
  const [activeTab, setActiveTab] = React.useState<OrdersTab>("ongoing");

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: myOrdersQueryKey(),
      queryFn: ({ pageParam = 1 }) => fetchMyOrders(pageParam as number, 20),
      initialPageParam: 1,
      getNextPageParam: (last, all) =>
        last.pagination.page < last.pagination.totalPages ? all.length + 1 : undefined,
    });

  const orders = data?.pages.flatMap((p) => p.data) ?? [];
  const { ongoing, completed } = React.useMemo(() => splitOrders(orders), [orders]);

  React.useEffect(() => {
    if (ongoing.length === 0 && completed.length > 0 && activeTab === "ongoing") {
      setActiveTab("completed");
    }
  }, [ongoing.length, completed.length, activeTab]);

  const visibleOrders = activeTab === "ongoing" ? ongoing : completed;

  if (isPending) {
    return (
      <div className="space-y-5">
        <div className="h-14 animate-pulse rounded-2xl bg-surface-muted" />
        <OrdersListSkeleton />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
        illustrationAlt=""
        title="No orders yet"
        description="Your order history will appear here once you've placed an order."
        action={{ label: "Browse store", href: "/store" }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <OrdersTabBar
        active={activeTab}
        onChange={setActiveTab}
        ongoingCount={ongoing.length}
        completedCount={completed.length}
      />

      {activeTab === "ongoing" && ongoing.length > 0 ? (
        <p className="flex items-center gap-2 text-xs text-content-neutral-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          Active orders update in real time — tap to track
        </p>
      ) : null}

      {visibleOrders.length === 0 ? (
        <TabEmptyState tab={activeTab} />
      ) : (
        <ul className="space-y-3" role="list">
          {visibleOrders.map((order) => (
            <li key={order._id}>
              <StoreOrderCard order={order} />
            </li>
          ))}
        </ul>
      )}

      {hasNextPage ? (
        <Button
          variant="outline"
          className="w-full rounded-full border-border-muted"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading…
            </>
          ) : (
            "Load more orders"
          )}
        </Button>
      ) : null}
    </div>
  );
}
