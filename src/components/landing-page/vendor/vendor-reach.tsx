import React from "react";
import Image from "next/image";

const features = [
  {
    icon: "/icons/landing/vendor/icon-visibility.svg",
    title: "More Visibility",
    description:
      "Get discovered by a wider customer base actively shopping every day.",
    circleColor: "bg-surface-brand",
    dotColor: "bg-surface-brand",
  },
  {
    icon: "/icons/landing/vendor/icon-reliable-delivery.svg",
    title: "Reliable Delivery",
    description: "We handle logistics from pickup to doorstep so you don't have to.",
    circleColor: "bg-[#c49039]",
    dotColor: "bg-[#c49039]",
  },
  {
    icon: "/icons/landing/vendor/icon-easy-management.svg",
    title: "Easy Management",
    description: "Track orders and update inventory with simple, stress-free tools.",
    circleColor: "bg-[#6664c8]",
    dotColor: "bg-[#6664c8]",
  },
  {
    icon: "/icons/landing/vendor/icon-secure-payouts.svg",
    title: "Secure Payouts",
    description: "Receive your earnings safely and on time, every time.",
    circleColor: "bg-[#d86879]",
    dotColor: "bg-[#d86879]",
  },
];

const VendorReach = () => {
  return (
    <div className="w-full py-16 sm:py-20 lg:py-24 bg-surface-canvas">
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col gap-3 sm:gap-5 text-center">
          <p className="text-base sm:text-3xl md:text-4xl lg:text-[36px] font-normal text-content-neutral-soft tracking-wide">
            Expand Your Reach Without the Extra Hassle
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal leading-[110%] text-content-neutral-primary">
            Gain instant visibility to{" "}
            <span className="text-content-neutral-secondary">network of shoppers</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-10 lg:gap-x-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="flex flex-col items-center gap-0">
                <div
                  className={`${feature.circleColor} w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center`}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={28}
                    height={28}
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                </div>
                <div className={`w-px h-6 ${feature.dotColor} opacity-40`} />
                <div
                  className={`w-2.5 h-2.5 rounded-full ${feature.dotColor}`}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-normal leading-[120%] text-content-neutral-primary">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base font-light leading-[150%] text-content-neutral-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorReach;
