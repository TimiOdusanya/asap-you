"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleNotchIcon } from "@phosphor-icons/react";

interface VendorStepCommissionProps {
  onSubmit: () => void;
  onBack: () => void;
  isPending: boolean;
}

const VendorStepCommission = ({ onSubmit, onBack, isPending }: VendorStepCommissionProps) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-center text-xl sm:text-2xl font-semibold text-surface-brand">
        : Pricing &amp; Commission Agreement
      </h2>

      <div className="flex flex-col gap-4">
        <p className="text-sm text-content-neutral-secondary leading-relaxed">
          As part of selling on our platform, each vendor agrees to a service commission
          applied to every successful order.
        </p>

        <ul className="list-disc pl-5 space-y-2 text-sm text-content-neutral-secondary leading-relaxed">
          <li>
            The platform will charge a commission of 10–15% per order, depending on the
            category of products or services offered.
          </li>
          <li>
            This commission covers platform maintenance, customer support, secure payment
            processing, and order facilitation.
          </li>
          <li>
            Payouts to vendors will be made after deducting the applicable commission.
          </li>
          <li>
            By proceeding, you acknowledge and agree to these commission terms.
          </li>
        </ul>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          role="checkbox"
          aria-checked={agreed}
          tabIndex={0}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
            agreed ? "bg-surface-brand border-surface-brand" : "border-border-strong bg-white"
          }`}
          onClick={() => setAgreed((v) => !v)}
          onKeyDown={(e) => e.key === " " && setAgreed((v) => !v)}
        >
          {agreed && (
            <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
              <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-sm text-content-neutral-secondary">
          I agree to the platform&apos;s commission terms.
        </span>
      </label>

      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          type="button"
          disabled={!agreed || isPending}
          onClick={onSubmit}
          className="rounded-full px-10 bg-surface-forest-deep hover:bg-surface-forest-deep/90 disabled:opacity-50"
        >
          {isPending ? (
            <CircleNotchIcon className="size-5 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-content-neutral-muted hover:text-content-neutral-secondary cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default VendorStepCommission;
