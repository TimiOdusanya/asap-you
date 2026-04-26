import React from "react";
import Image from "next/image";

const values = [
  {
    icon: "/icons/landing/rider/icon-flexibility.svg",
    title: "Flexibility",
    description:
      "Work on your terms with the ability to choose your delivery hours.",
    circleColor: "bg-surface-brand",
    dotColor: "bg-surface-brand",
  },
  {
    icon: "/icons/landing/rider/icon-deliveries.svg",
    title: "Earn Consistently",
    description: "Get paid weekly with clear, fair rates.",
    circleColor: "bg-[#c49039]",
    dotColor: "bg-[#c49039]",
  },
  {
    icon: "/icons/landing/rider/icon-motorcycle.svg",
    title: "Easy Logistics",
    description:
      "Simply accept an order, pick it up, and deliver — no complicated process.",
    circleColor: "bg-[#6664c8]",
    dotColor: "bg-[#6664c8]",
  },
  {
    icon: "/icons/landing/rider/icon-secure-payments.svg",
    title: "Secure Payments",
    description: "Guaranteed payouts after every successful delivery.",
    circleColor: "bg-[#d86879]",
    dotColor: "bg-[#d86879]",
  },
];

const RiderCoreValues = () => {
  return (
    <div className="w-full py-16 sm:py-20 lg:py-24 bg-surface-canvas">
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto flex flex-col gap-10 sm:gap-14">
        <div className="flex flex-col gap-3 sm:gap-5 text-center">
          <p className="text-base sm:text-xl md:text-2xl lg:text-[28px] font-normal text-content-neutral-soft tracking-wide">
            Core Value Proposition
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal leading-[110%] text-content-neutral-primary">
            Fast Deliveries. Flexible Work.{" "}
            <span className="text-content-neutral-secondary">
              Reliable Earnings.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-10 lg:gap-x-16">
          {values.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="flex flex-col items-center gap-0">
                <div
                  className={`${item.circleColor} w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center`}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={28}
                    height={28}
                    className="w-6 h-6 sm:w-7 sm:h-7"
                  />
                </div>
                <div className={`w-px h-6 ${item.dotColor} opacity-40`} />
                <div className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-base sm:text-lg font-normal leading-[120%] text-content-neutral-primary">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base font-light leading-[150%] text-content-neutral-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderCoreValues;
