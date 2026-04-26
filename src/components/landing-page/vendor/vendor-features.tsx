import React from "react";
import Image from "next/image";

const features = [
  {
    icon: "/icons/landing/vendor/icon-reach-customers.svg",
    title: "Reach More Customers",
    description:
      "Expand beyond your store walls. With instant access to thousands of active shoppers, your products are seen by more people, increasing your chances of making daily sales.",
  },
  {
    icon: "/icons/landing/vendor/icon-seamless-logistics.svg",
    title: "Seamless Logistics",
    description:
      "No need to worry about riders or late deliveries. We handle the entire delivery process, making sure your customers receive their items quickly and reliably.",
  },
  {
    icon: "/icons/landing/vendor/icon-dashboard.svg",
    title: "Easy-to-Use Dashboard",
    description:
      "From product uploads to tracking orders, everything happens in one place. Our dashboard is built for simplicity, helping you stay on top of your business without stress.",
  },
  {
    icon: "/icons/landing/vendor/icon-timely-payments.svg",
    title: "Timely Payments",
    description:
      "No more chasing after payments. You get paid securely and on schedule, so you can reinvest and grow your store with peace of mind.",
  },
  {
    icon: "/icons/landing/vendor/icon-vendor-support.svg",
    title: "Dedicated Vendor Support",
    description:
      "You're never alone. Our vendor support team is available to guide you, answer questions, and help you make the most out of your store on the platform.",
  },
  {
    icon: "/icons/landing/vendor/icon-grow-insights.svg",
    title: "Grow With Insights",
    description:
      "Track performance, understand customer behavior, and get valuable insights that help you make smarter business decisions and grow steadily.",
  },
];

const VendorFeatures = () => {
  return (
    <div className="w-full bg-surface-forest py-16 sm:py-20 lg:py-24">
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col gap-3 sm:gap-5 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[110%] text-surface-brand-soft">
            From Your Storefront to Their Doorstep.
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[110%] text-surface-brand-tint">
            Simple Selling, Faster Growing.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

export default VendorFeatures;
