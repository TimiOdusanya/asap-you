import React from "react";
import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";
import type { RoleKey } from "@/components/landing-page/role-switcher";

interface MarketingPageShellProps {
  children: React.ReactNode;
  current?: RoleKey;
}

export function MarketingPageShell({
  children,
  current = "customer",
}: MarketingPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-canvas">
      <Navbar current={current} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
