"use client";

import { RocketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";

export function GetStartedButton() {
  const openSignIn = useCustomerAuthUiStore((s) => s.openSignIn);

  return (
    <Button
      type="button"
      variant="default"
      className="w-[150px]"
      onClick={() => openSignIn()}
    >
      <RocketIcon className="size-4" aria-hidden />
      Get Started
    </Button>
  );
}
