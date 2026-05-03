"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  UsersIcon,
  StorefrontIcon,
  TruckIcon,
  StarIcon,
  ShoppingCartIcon,
  GearIcon,
  ShieldCheckIcon,
  SignOutIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/stores/auth-store";

interface NavItem {
  href: string;
  label: string;
  Icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Overview", Icon: ShieldCheckIcon },
  { href: "/admin/customers", label: "Customers", Icon: UsersIcon },
  { href: "/admin/vendors", label: "Vendors", Icon: StorefrontIcon },
  { href: "/admin/riders", label: "Riders", Icon: TruckIcon },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCartIcon },
  { href: "/admin/reviews", label: "Reviews", Icon: StarIcon },
  { href: "/admin/settings", label: "Settings", Icon: GearIcon },
];

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  const handleLogout = () => {
    clearSession();
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-surface-forest">
      <div className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/admin/dashboard" onClick={onClose} className="group">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white">
              <ShieldCheckIcon className="size-5" aria-hidden />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-[11px] text-white/70">Console</p>
            </div>
          </div>
        </Link>
        {onClose ? (
          <button
            onClick={onClose}
            className="cursor-pointer text-white/70 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <XIcon className="size-5" />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 px-3 py-2">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-brand text-white"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <item.Icon className="size-5 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <SignOutIcon className="size-5 shrink-0" aria-hidden />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-full w-[240px] shrink-0 flex-col overflow-y-auto lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute bottom-0 left-0 top-0 w-[240px]">
            <SidebarContent />
          </aside>
        </div>
      ) : null}
    </>
  );
}

