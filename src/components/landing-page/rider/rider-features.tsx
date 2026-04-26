import React from "react";
import Image from "next/image";

const features = [
  {
    icon: "/icons/landing/rider/icon-schedule.svg",
    title: "Set Your Schedule",
    description:
      "Work full-time or part-time — it's all up to you. Choose your delivery hours and take on orders when it suits your lifestyle.",
  },
  {
    icon: "/icons/landing/rider/icon-smart-navigation.svg",
    title: "Smart Navigation",
    description:
      "In-app directions to make every delivery seamless. Get optimised routes so you spend less time on the road and more time earning.",
  },
  {
    icon: "/icons/landing/rider/icon-easy-logistics.svg",
    title: "Low-Stress Process",
    description:
      "Simple app to manage your routes and earnings. Accept an order, pick it up, and deliver — no complicated process involved.",
  },
  {
    icon: "/icons/landing/rider/icon-secure-payments.svg",
    title: "Safe & Reliable",
    description:
      "We protect you every step of the way. From verified vendors to in-app support, you always have a safety net on every ride.",
  },
];

const RiderFeatures = () => {
  return (
    <div className="w-full bg-surface-forest py-16 sm:py-20 lg:py-24">
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col gap-3 sm:gap-5 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[110%] text-surface-brand-soft">
            Why Riders Love Our Platform.&rdquo;
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[110%] text-surface-brand-tint">
            Simple Selling, Faster Growing.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 rounded-xl bg-surface-forest-card p-6 sm:p-7"
            >
              <div className="bg-surface-brand rounded-full p-2.5 w-fit">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-content-on-dark-section text-lg sm:text-xl font-normal leading-[120%]">
                {feature.title}
              </h3>
              <p className="text-content-on-dark-section/70 text-sm sm:text-base font-light leading-[150%]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderFeatures;
