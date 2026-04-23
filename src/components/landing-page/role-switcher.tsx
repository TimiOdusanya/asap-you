"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
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

type RoleKey = keyof typeof roles;

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "#blog" },
];

export function RoleSwitcher({ current }: { current: RoleKey }) {
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

  return (
    <div className="flex justify-between items-center max-w-[90%] lg:max-w-[85%] mx-auto pt-4 sm:pt-6">
      <Link href="/" className="cursor-pointer">
        <Image
          src="/images/logo.svg"
          alt="logo"
          height={62}
          width={90}
          className="h-9 w-auto sm:h-11 lg:h-[62px] cursor-pointer"
        />
      </Link>

      <div className="hidden gap-[27px] lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-content-neutral-secondary font-normal text-xl leading-[100%]"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="hidden lg:block">
        <Select value={current} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[130px] rounded-3xl py-6 px-4 border border-primary text-content-neutral-secondary font-normal text-base leading-[100%]">
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
        className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary text-content-neutral-primary"
      >
        <Menu className="size-5" aria-hidden />
      </button>

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
                alt="logo"
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
                <SelectTrigger className="w-full rounded-2xl py-5 px-4 border border-primary text-content-neutral-secondary font-normal text-base leading-[100%]">
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
    </div>
  );
}
