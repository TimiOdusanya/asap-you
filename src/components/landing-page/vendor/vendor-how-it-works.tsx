import React from "react";
import Image from "next/image";

const steps = [
  {
    number: 1,
    title: "Sign Up in Minutes",
    description: "Register your store with our easy form",
  },
  {
    number: 2,
    title: "Add Your Products",
    description:
      "List items with prices and details. Update your catalog anytime, stress-free.",
  },
  {
    number: 3,
    title: "Go Live & Sell",
    description:
      "Your store becomes visible, shoppers order, and we take care of the delivery.",
  },
];

const VendorHowItWorks = () => {
  return (
    <div className="max-w-[90%] lg:max-w-[85%] mx-auto py-16 sm:py-20 lg:py-24">
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 xl:gap-24">
        <div className="w-full lg:w-[45%] shrink-0">
          <Image
            src="/images/landing/vendor/vendor-how-it-works.png"
            alt="How it works collage"
            width={480}
            height={480}
            className="w-full h-[600px] rounded-2xl object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal leading-[110%] text-content-neutral-primary">
              How It Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl font-normal leading-[150%] text-content-neutral-secondary max-w-[520px]">
              With just a few clicks, your supermarket can start reaching more
              customers and increasing sales — without the usual hassle.
            </p>
          </div>

          <ol className="flex flex-col gap-6 sm:gap-8">
            {steps.map((step) => (
              <li key={step.number} className="flex items-start gap-4 sm:gap-5">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-brand-soft flex items-center justify-center">
                  <span className="text-surface-brand text-sm sm:text-base font-medium leading-none">
                    {step.number}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-medium leading-[120%] text-content-neutral-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base font-light leading-[140%] text-content-neutral-secondary">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default VendorHowItWorks;
