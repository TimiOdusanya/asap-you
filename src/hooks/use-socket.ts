"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "@/lib/env";
import { tokenStorage } from "@/lib/token-storage";

export interface OrderStatusUpdate {
  orderId: string;
  status: string;
  timestamp: string;
}

export interface RiderLocationUpdate {
  orderId: string;
  location: { lat: number; lng: number; heading?: number; speed?: number };
  timestamp: string;
}

export interface UserNotificationEvent {
  _id: string;
  type: string;
  title: string;
  message: string;
  data?: { orderId?: string; [key: string]: unknown };
  createdAt: string;
}

let globalSocket: Socket | null = null;

function getSocket(): Socket | null {
  const token = tokenStorage.get();
  if (!token) return null;

  if (globalSocket?.connected) return globalSocket;

  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }

  globalSocket = io(API_BASE_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return globalSocket;
}

function matchesOrder(
  orderId: string | null | undefined,
  payload: { orderId?: string }
): boolean {
  if (!orderId) return true;
  return payload.orderId === orderId;
}

/** Subscribe to a specific order room and listen for status updates + rider location. */
export function useOrderSocket(
  orderId: string | null | undefined,
  handlers: {
    onStatusUpdate?: (update: OrderStatusUpdate) => void;
    onRiderAssigned?: (data: { orderId: string; riderId: string }) => void;
    onRiderLocation?: (update: RiderLocationUpdate) => void;
    onDelivered?: (data: { orderId: string; deliveredAt: string }) => void;
  }
) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!orderId) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit("join:order", orderId);

    const onStatus = (data: OrderStatusUpdate) => {
      if (!matchesOrder(orderId, data)) return;
      handlersRef.current.onStatusUpdate?.(data);
    };
    const onAssigned = (data: { orderId: string; riderId: string }) => {
      if (!matchesOrder(orderId, data)) return;
      handlersRef.current.onRiderAssigned?.(data);
    };
    const onLocation = (data: RiderLocationUpdate) => {
      if (!matchesOrder(orderId, data)) return;
      handlersRef.current.onRiderLocation?.(data);
    };
    const onDelivered = (data: { orderId: string; deliveredAt: string }) => {
      if (!matchesOrder(orderId, data)) return;
      handlersRef.current.onDelivered?.(data);
    };

    socket.on("order:status_updated", onStatus);
    socket.on("order:rider_assigned", onAssigned);
    socket.on("rider:location", onLocation);
    socket.on("order:delivered", onDelivered);

    return () => {
      socket.off("order:status_updated", onStatus);
      socket.off("order:rider_assigned", onAssigned);
      socket.off("rider:location", onLocation);
      socket.off("order:delivered", onDelivered);
      socket.emit("leave:order", orderId);
    };
  }, [orderId]);
}

/** User-room push notifications (all roles). */
export function useUserNotificationSocket(
  onNotification?: (payload: UserNotificationEvent) => void
) {
  const handlerRef = useRef(onNotification);
  handlerRef.current = onNotification;

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNotificationEvent = (payload: UserNotificationEvent) => {
      handlerRef.current?.(payload);
    };

    socket.on("notification", onNotificationEvent);
    return () => {
      socket.off("notification", onNotificationEvent);
    };
  }, []);
}

/** Admin order feed via admins room. */
export function useAdminOrdersSocket(onUpdate?: () => void, enabled = true) {
  const handlerRef = useRef(onUpdate);
  handlerRef.current = onUpdate;

  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();
    if (!socket) return;

    const refresh = () => handlerRef.current?.();

    socket.on("order:status_updated", refresh);
    socket.on("order:rider_assigned", refresh);
    socket.on("order:delivered", refresh);

    return () => {
      socket.off("order:status_updated", refresh);
      socket.off("order:rider_assigned", refresh);
      socket.off("order:delivered", refresh);
    };
  }, [enabled]);
}

export function emitRiderLocation(lat: number, lng: number, heading?: number, speed?: number) {
  const socket = getSocket();
  socket?.emit("rider:location_update", { lat, lng, heading, speed });
}

export function disconnectSocket() {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }
}
