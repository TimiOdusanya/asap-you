import React from "react";

interface RiderStepIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Basic Details" },
  { number: 2, label: "Profile Setup" },
  { number: 3, label: "Verification" },
];

const RiderStepIndicator = ({ currentStep }: RiderStepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                currentStep >= step.number
                  ? "bg-surface-brand text-white"
                  : "bg-surface-muted text-content-neutral-muted border border-border-muted"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-[11px] font-normal whitespace-nowrap ${
                currentStep >= step.number
                  ? "text-content-neutral-primary"
                  : "text-content-neutral-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-px w-16 sm:w-24 mb-4 transition-colors ${
                currentStep > step.number ? "bg-surface-brand" : "bg-border-muted"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RiderStepIndicator;
