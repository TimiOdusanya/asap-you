"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Bike,
  CheckCheck,
  Loader2,
  Package,
  Sparkle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { EMPTY_STATE_ILLUSTRATION } from "@/lib/empty-state-illustrations";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NOTIFICATIONS_QUERY_KEY,
} from "@/services/notifications/notifications.api";
import type { NotificationDto, NotificationType } from "@/types/notification";
import { cn } from "@/lib/utils";

function notificationVisual(type: NotificationType) {
  if (type.startsWith("order_") || type === "delivery_confirmed") {
    return { Icon: Package, className: "bg-primary/10 text-primary" };
  }
  if (type.startsWith("rider_")) {
    return { Icon: Bike, className: "bg-cyan-100 text-cyan-700" };
  }
  if (type === "promotional") {
    return { Icon: Sparkle, className: "bg-amber-100 text-amber-700" };
  }
  if (type === "security") {
    return { Icon: ShieldCheck, className: "bg-violet-100 text-violet-700" };
  }
  return { Icon: Bell, className: "bg-surface-muted text-content-neutral-secondary" };
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

function NotificationRow({
  item,
  onOpen,
}: {
  item: NotificationDto;
  onOpen: (item: NotificationDto) => void;
}) {
  const { Icon, className } = notificationVisual(item.type);
  const orderId =
    item.data && typeof item.data.orderId === "string" ? item.data.orderId : null;

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        "flex w-full gap-3 rounded-2xl border p-4 text-left transition-all",
        item.isRead
          ? "border-border-muted bg-white hover:border-primary/20"
          : "border-primary/25 bg-primary/[0.03] shadow-sm hover:border-primary/35"
      )}
    >
      <div
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          className
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-snug",
              item.isRead
                ? "font-medium text-content-neutral-primary"
                : "font-semibold text-content-neutral-primary"
            )}
          >
            {item.title}
          </p>
          {!item.isRead ? (
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-content-neutral-secondary">
          {item.message}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-content-neutral-muted">
          <span>{formatRelativeTime(item.createdAt)}</span>
          {orderId ? (
            <span className="rounded-full bg-surface-muted px-2 py-0.5 font-medium text-content-neutral-secondary">
              View order
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export function StoreNotifications() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => fetchNotifications(1, 50),
    refetchInterval: 30_000,
  });

  const markReadMut = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const markAllMut = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      toast.success("All caught up");
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  const handleOpen = (item: NotificationDto) => {
    if (!item.isRead) {
      markReadMut.mutate(item._id);
    }
    const orderId =
      item.data && typeof item.data.orderId === "string" ? item.data.orderId : null;
    if (orderId) {
      router.push(`/store/orders/${orderId}`);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        illustrationSrc={EMPTY_STATE_ILLUSTRATION.platform}
        illustrationAlt=""
        title="No notifications yet"
        description="Order updates, delivery alerts, and promotions will show up here."
        action={{ label: "Browse store", href: "/store" }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {unreadCount > 0 ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] px-4 py-3">
          <p className="text-sm text-content-neutral-secondary">
            <span className="font-semibold text-content-neutral-primary">{unreadCount}</span>{" "}
            unread notification{unreadCount === 1 ? "" : "s"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full border-primary/30 text-primary"
            onClick={() => markAllMut.mutate()}
            disabled={markAllMut.isPending}
          >
            <CheckCheck className="mr-1.5 size-4" />
            Mark all read
          </Button>
        </div>
      ) : (
        <p className="flex items-center gap-2 text-sm text-content-neutral-muted">
          <CheckCheck className="size-4 text-emerald-600" />
          You&apos;re all caught up
        </p>
      )}

      {unread.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-content-neutral-muted">
            New
          </h2>
          <ul className="space-y-2">
            {unread.map((item) => (
              <li key={item._id}>
                <NotificationRow item={item} onOpen={handleOpen} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {read.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-content-neutral-muted">
            Earlier
          </h2>
          <ul className="space-y-2">
            {read.map((item) => (
              <li key={item._id}>
                <NotificationRow item={item} onOpen={handleOpen} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
