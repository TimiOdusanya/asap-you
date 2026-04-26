"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeadsetIcon, SignOutIcon, XIcon,
  HouseIcon, TruckIcon, ClockCounterClockwiseIcon,
  CurrencyDollarIcon, LifebuoyIcon, GearIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/auth-store";

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
  const clearSession = useAuthStore((s) => s.clearSession);

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
          <button onClick={onClose} className="lg:hidden text-content-neutral-muted hover:text-content-neutral-primary cursor-pointer">
            <XIcon className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
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
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-content-neutral-secondary hover:bg-surface-muted transition-colors text-sm font-medium cursor-pointer w-full text-left">
          <HeadsetIcon className="size-5 shrink-0" />
          Help and support
        </button>
        <button onClick={handleLogout}
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
