import React from "react";
import { Button } from "@/components/ui/button";
import { CameraIcon, FileCsvIcon, LightningIcon } from "@phosphor-icons/react";

interface VendorStepWelcomeProps {
  firstName: string;
  onNext: () => void;
}

const VendorStepWelcome = ({ firstName, onNext }: VendorStepWelcomeProps) => {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-surface-brand">
          Hi {firstName}, Welcome to Vendors Tab
        </h2>
        <p className="text-sm sm:text-base text-content-neutral-secondary leading-relaxed max-w-[420px]">
          Lets get your store ready for customers. You&apos;re just few steps away from going live.
          Our guided process will help you create a professional store that customers will love.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[380px] text-left">
        <div className="flex items-center gap-3">
          <CameraIcon className="size-5 text-surface-brand shrink-0" />
          <span className="text-sm text-content-neutral-secondary">Products with images sell 3x faster</span>
        </div>
        <div className="flex items-center gap-3">
          <FileCsvIcon className="size-5 text-surface-brand shrink-0" />
          <span className="text-sm text-content-neutral-secondary">Bulk upload available for multiple products</span>
        </div>
        <div className="flex items-center gap-3">
          <LightningIcon className="size-5 text-surface-brand shrink-0" />
          <span className="text-sm text-content-neutral-secondary">Real-time preview of your store</span>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90"
      >
        Let&apos;s get you Started
      </Button>
    </div>
  );
};

export default VendorStepWelcome;
