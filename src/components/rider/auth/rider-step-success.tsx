import React from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@phosphor-icons/react";
import RiderStepIndicator from "./rider-step-indicator";

interface Props {
  onContinue: () => void;
}

const RiderStepSuccess = ({ onContinue }: Props) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
      <div className="flex justify-end">
        <p className="text-sm text-content-neutral-muted">
          Already a rider?{" "}
          <a href="/rider/login" className="text-surface-brand font-medium hover:underline">Login</a>
        </p>
      </div>
      <h2 className="text-center text-2xl font-semibold text-surface-brand">Sign up</h2>
      <RiderStepIndicator currentStep={3} />

      <div className="flex flex-col items-center gap-6 py-6">
        <div className="relative flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-surface-brand-soft flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-surface-forest-deep flex items-center justify-center">
              <CheckIcon weight="bold" className="size-8 text-white" />
            </div>
          </div>
        </div>

        <p className="text-center text-base sm:text-lg text-content-neutral-secondary max-w-sm leading-relaxed">
          Your account is under review. You&apos;ll be notified once approved.&rdquo;
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onContinue} className="rounded-full px-10 bg-surface-brand hover:bg-surface-brand/90">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RiderStepSuccess;
