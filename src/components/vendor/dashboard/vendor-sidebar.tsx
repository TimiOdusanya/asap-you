"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeadsetIcon,
  SignOutIcon,
  XIcon,
  ShoppingBagIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/auth-store";

interface NavItem {
  href: string;
  label: string;
  svgIcon?: string;
  PhosphorIcon?: React.ElementType;
}

const navItems: NavItem[] = [
  {
    href: "/vendor/dashboard",
    label: "Dashboard",
    svgIcon: "/icons/vendor/icon-dashboard.svg",
  },
  {
    href: "/vendor/dashboard/add-product",
    label: "Add product",
    PhosphorIcon: ShoppingBagIcon,
  },
  {
    href: "/vendor/dashboard/view-store",
    label: "View Store",
    svgIcon: "/icons/vendor/icon-view-store.svg",
  },
  {
    href: "/vendor/dashboard/settings",
    label: "Settings",
    svgIcon: "/icons/vendor/icon-settings.svg",
  },
];

interface VendorSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const VendorSidebar = ({ mobileOpen = false, onClose }: VendorSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  const handleLogout = () => {
    clearSession();
    router.push("/vendor/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface-forest">
      <div className="p-4 sm:p-6 flex items-center justify-between">
        <Link href="/vendor">
          <Image
            src="/images/logo.svg"
            alt="Rushly"
            width={64}
            height={26}
            className="h-7 w-auto"
          />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-white/70 hover:text-white cursor-pointer"
          >
            <XIcon className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-surface-brand text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.svgIcon ? (
                <Image
                  src={item.svgIcon}
                  alt=""
                  aria-hidden
                  width={20}
                  height={20}
                  className="w-5 h-5 shrink-0 brightness-0 invert opacity-90"
                />
              ) : item.PhosphorIcon ? (
                <item.PhosphorIcon className="size-5 shrink-0" />
              ) : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium cursor-pointer w-full text-left">
          <HeadsetIcon className="size-5 shrink-0" />
          Help and support
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium cursor-pointer w-full text-left"
        >
          <SignOutIcon className="size-5 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-[220px] shrink-0 flex-col min-h-screen">
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

export default VendorSidebar;
