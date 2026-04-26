"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = {
  customer: { label: "Customer", path: "/" },
  vendor: { label: "Vendor", path: "/vendor" },
  rider: { label: "Rider", path: "/rider" },
} as const;

export type RoleKey = keyof typeof roles;
export type NavLink = { label: string; href: string };

const defaultNavLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "#blog" },
];

export type NavbarVariant = "default" | "inverted";

interface RoleSwitcherProps {
  current: RoleKey;
  navLinks?: { label: string; href: string }[];
  variant?: NavbarVariant;
}

export function RoleSwitcher({
  current,
  navLinks = defaultNavLinks,
  variant = "default",
}: RoleSwitcherProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!menuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  const handleRoleChange = (value: string) => {
    const key = value as RoleKey;
    setMenuOpen(false);
    router.push(roles[key].path);
  };

  const isInverted = variant === "inverted";
  const linkClass = cn(
    "font-normal leading-[100%] whitespace-nowrap transition-colors",
    "text-sm sm:text-base lg:text-lg xl:text-xl",
    isInverted
      ? "text-content-on-dark-section hover:text-white"
      : "text-content-neutral-secondary"
  );
  const selectTriggerClass = cn(
    "w-[130px] min-h-11 flex-shrink-0 rounded-3xl border px-4 py-5 sm:py-6",
    "font-normal text-sm sm:text-base leading-[100%]",
    isInverted
      ? "border-white/40 bg-white/5 text-content-on-dark-section data-[state=open]:ring-white/20"
      : "border border-primary text-content-neutral-secondary"
  );
  const menuButtonClass = cn(
    "inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border transition-colors",
    isInverted
      ? "border-white/50 text-content-on-dark-section hover:bg-white/10"
      : "border border-primary text-content-neutral-primary"
  );
  const logoClass =
    "h-9 w-auto cursor-pointer sm:h-11 lg:h-[62px]";

  return (
    <>
      <div className="w-full">
        <div
          className={cn(
            "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
            "pt-4 sm:pt-5 lg:pt-6 pb-3 sm:pb-4"
          )}
        >
          <div className="flex min-h-12 items-center justify-between gap-3 sm:min-h-14 sm:gap-4">
            <Link href="/" className="shrink-0 self-center">
              <Image
                src="/images/logo.svg"
                alt="Rushly"
                height={62}
                width={90}
                className={logoClass}
              />
            </Link>

            <nav
              className="hidden min-w-0 flex-1 items-center justify-center gap-6 px-2 lg:flex xl:gap-10 2xl:gap-12"
              aria-label="Page sections"
            >
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
              <div className="hidden lg:block">
                <Select value={current} onValueChange={handleRoleChange}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="rider">Rider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                className={cn("lg:hidden", menuButtonClass)}
              >
                <Menu className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col gap-8 bg-surface-canvas p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <Image
                src="/images/logo.svg"
                alt="Rushly"
                height={40}
                width={60}
                className="h-9 w-auto"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-muted text-content-neutral-primary"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-lg text-content-neutral-primary hover:bg-surface-muted"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-2">
              <span className="px-1 text-sm text-content-neutral-muted">
                Switch role
              </span>
              <Select value={current} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full rounded-2xl border border-primary py-5 px-4 text-base font-normal text-content-neutral-secondary leading-[100%]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="rider">Rider</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
