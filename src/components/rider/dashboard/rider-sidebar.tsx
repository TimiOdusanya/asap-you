"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  HeadsetIcon, SignOutIcon, XIcon,
  HouseIcon, TruckIcon, ClockCounterClockwiseIcon,
  CurrencyDollarIcon, LifebuoyIcon, GearIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/auth-store";
import {
  fetchRiderProfile,
  goOffline,
  goOnline,
  riderProfileQueryKey,
} from "@/services/rider/rider-deliveries.api";
import { cn } from "@/lib/utils";

interface NavItem { href: string; label: string; Icon: React.ElementType }

const navItems: NavItem[] = [
  { href: "/rider/dashboard", label: "Dashboard", Icon: HouseIcon },
  { href: "/rider/dashboard/active-deliveries", label: "Active Deliveries", Icon: TruckIcon },
  { href: "/rider/dashboard/order-history", label: "Order History", Icon: ClockCounterClockwiseIcon },
  { href: "/rider/dashboard/earnings", label: "Earnings", Icon: CurrencyDollarIcon },
  { href: "/rider/dashboard/support", label: "Support", Icon: LifebuoyIcon },
  { href: "/rider/dashboard/settings", label: "Settings", Icon: GearIcon },
];

interface RiderSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const RiderSidebar = ({ mobileOpen = false, onClose }: RiderSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  const { data: profileRes } = useQuery({
    queryKey: riderProfileQueryKey,
    queryFn: fetchRiderProfile,
  });

  const status = profileRes?.data?.status ?? "offline";
  const isOnline = status === "online" || status === "busy" || status === "on_delivery";

  const toggleMut = useMutation({
    mutationFn: () => (isOnline ? goOffline() : goOnline()),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: riderProfileQueryKey });
    },
    onError: () => toast.error("Could not update availability"),
  });

  const handleLogout = () => {
    clearSession();
    router.push("/rider/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-border-muted">
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <Link href="/rider">
          <Image src="/images/logo.svg" alt="Rushly" width={64} height={26} className="h-7 w-auto" />
        </Link>
        {onClose && (
          <button type="button" onClick={onClose} className="lg:hidden text-content-neutral-muted hover:text-content-neutral-primary cursor-pointer">
            <XIcon className="size-5" />
          </button>
        )}
      </div>

      <div className="mx-3 mb-3 rounded-xl border border-border-muted bg-surface-subtle p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-content-neutral-muted">Availability</p>
            <p className="text-sm font-semibold capitalize text-content-neutral-primary">{status.replace(/_/g, " ")}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleMut.mutate()}
            disabled={toggleMut.isPending}
            className={cn(
              "relative h-7 w-12 rounded-full transition-colors cursor-pointer disabled:opacity-60",
              isOnline ? "bg-surface-brand" : "bg-surface-muted"
            )}
            aria-label={isOnline ? "Go offline" : "Go online"}
          >
            {toggleMut.isPending ? (
              <Loader2 className="absolute inset-0 m-auto size-4 animate-spin text-white" />
            ) : (
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
                  isOnline ? "translate-x-5" : "translate-x-0"
                )}
              />
            )}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-surface-brand text-white"
                  : "text-content-neutral-secondary hover:bg-surface-muted hover:text-content-neutral-primary"
              }`}>
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 flex flex-col gap-0.5">
        <Link
          href="/rider/dashboard/support"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-content-neutral-secondary hover:bg-surface-muted transition-colors text-sm font-medium"
        >
          <HeadsetIcon className="size-5 shrink-0" />
          Help and support
        </Link>
        <button type="button" onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-content-neutral-secondary hover:bg-surface-muted transition-colors text-sm font-medium cursor-pointer w-full text-left">
          <SignOutIcon className="size-5 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-full w-[200px] shrink-0 flex-col overflow-y-auto lg:flex xl:w-[220px]">
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[220px] flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
};

export default RiderSidebar;
