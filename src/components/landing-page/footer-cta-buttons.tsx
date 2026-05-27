"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";

export function FooterCtaButtons() {
  const openSignUp = useCustomerAuthUiStore((s) => s.openSignUp);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <Button
        type="button"
        onClick={() => openSignUp()}
        className="bg-primary text-primary-foreground text-sm sm:text-base rounded-[40px] px-4 sm:px-6 py-5 sm:py-6"
      >
        Get Started
      </Button>
      <Button
        asChild
        className="bg-surface-forest-deep border border-primary text-primary-foreground text-sm sm:text-base rounded-[40px] px-4 sm:px-6 py-5 sm:py-6 hover:bg-surface-forest-deep/90"
      >
        <Link href="/vendor/signup">Become a Vendor</Link>
      </Button>
      <Button
        asChild
        className="bg-surface-forest-deep border border-primary text-primary-foreground text-sm sm:text-base rounded-[40px] px-4 sm:px-6 py-5 sm:py-6 hover:bg-surface-forest-deep/90"
      >
        <Link href="/rider/signup">Join as Rider</Link>
      </Button>
    </div>
  );
}
