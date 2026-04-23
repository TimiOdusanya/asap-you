import React from "react";
import Image from "next/image";

const Shoppers = () => {
  const shoppers = [
    {
      id: 1,
      image: "/icons/landing/brain.svg",
      title: "Groceries, but smarter",
      description: "AI-powered suggestions tailored to your taste",
    },
    {
      id: 2,
      image: "/icons/landing/atm.svg",
      title: "No hidden fees",
      description: "Transparent pricing — no surprises at checkout",
    },
    {
      id: 3,
      image: "/icons/landing/phone.svg",
      title: "Stay updated, always",
      description: "Real-time SMS, email, and in-app order tracking",
    },
    {
      id: 4,
      image: "/icons/landing/timer.svg",
      title: "We remember you",
      description: "Instantly reorder what you’ve bought before",
    },
    {
      id: 5,
      image: "/icons/landing/cart.svg",
      title: "Multi-store carting",
      description: "Add from multiple vendors and check out once",
    },
  ];

  const supermarkets = [
    {
      id: 1,
      image: "/images/landing/ebeano.svg",
      title: "Ebeano Supermarket",
      description: "Most Ordered",
    },
    {
      id: 2,
      image: "/images/landing/justrite.svg",
      title: "Justrite Superstore",
      description: "Most Popular",
    },
    {
      id: 3,
      image: "/images/landing/justrite.svg",
      title: "Hubmart",
      description: "Most Affordable",
    },
    {
      id: 4,
      image: "/images/landing/justrite.svg",
      title: "Green Basket Nigeria",
      description: "Top Rated",
    },
    {
      id: 5,
      image: "/images/landing/justrite.svg",
      title: "Healthplus Pharmacy",
      description: "Wellness Picks",
    },
    {
      id: 6,
      image: "/images/landing/justrite.svg",
      title: "Chikere Supermarket",
      description: "Organic Groceries",
    },
    {
      id: 7,
      image: "/images/landing/justrite.svg",
      title: "Top Choice Supermarket",
      description: "Special Deals",
    },
    {
      id: 8,
      image: "/images/landing/justrite.svg",
      title: "Top Choice Supermarket",
      description: "Special Deals",
    },
    {
      id: 9,
      image: "/images/landing/justrite.svg",
      title: "Top Choice Supermarket",
      description: "Special Deals",
    },
    {
      id: 10,
      image: "/images/landing/justrite.svg",
      title: "Top Choice Supermarket",
      description: "Special Deals",
    },
  ];

  function darkenHex(hex: string, amount: number) {
    let col = hex.replace("#", "");
    if (col.length === 3)
      col = col
        .split("")
        .map((c) => c + c)
        .join("");

    const num = parseInt(col, 16);
    let r = (num >> 16) - amount;
    let g = ((num >> 8) & 0x00ff) - amount;
    let b = (num & 0x0000ff) - amount;

    r = Math.max(r, 0);
    g = Math.max(g, 0);
    b = Math.max(b, 0);

    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div className="space-y-16 sm:space-y-20 max-w-[90%] lg:max-w-[85%] mx-auto py-16 sm:py-20">
      <div className="flex flex-col lg:flex-row lg:justify-between pb-10 sm:pb-16 lg:pb-20 gap-8 lg:gap-16">
        <Image
          src={"/images/landing/shoppers-1.png"}
          alt="shoppers"
          width={500}
          height={500}
          className="w-full max-w-[420px] mx-auto lg:mx-0 h-auto"
        />
        <div className="flex flex-col gap-5 sm:gap-6">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-normal leading-[110%] text-content-neutral-primary">
            Why Our Shoppers Stick With Us?
          </h1>
          <p className="text-base sm:text-lg lg:text-2xl font-normal leading-[140%] text-content-neutral-secondary max-w-[600px]">
            We make everyday shopping feel effortless. From personalized picks
            to seamless updates, everything we build is centered around you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {shoppers.map((shopper) => (
              <div key={shopper.id} className="flex gap-4 sm:gap-6">
                <Image
                  src={shopper.image}
                  alt={shopper.title}
                  width={32}
                  height={32}
                  className="shrink-0"
                />
                <div className="flex flex-col gap-2">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-normal leading-[110%] text-content-neutral-primary">
                    {shopper.title}
                  </h1>
                  <p className="text-sm sm:text-base font-light leading-[140%] text-content-neutral-secondary">
                    {shopper.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-3 sm:gap-6 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-normal leading-[110%] text-content-neutral-soft">
          Your Favorite Stores, One Tap Away
        </h1>
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-normal leading-[110%] text-content-neutral-primary">
          We’ve partnered with stores you already trust.
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-6">
        {supermarkets.map((supermarket, index) => {
          const bgColors = [
            "#FFEFEB",
            "#F0E9FF",
            "#FFE0D3",
            "#FFE6B8",
            "#E2FFFD",
            "#EEEEFF",
            "#FCEDF9",
          ];
          const bgColor = bgColors[index % bgColors.length];

          return (
            <div
              key={supermarket.id}
              className="flex flex-col gap-6 sm:gap-8 items-center justify-center"
            >
              <div className="relative">
                <Image
                  src={supermarket.image}
                  alt={supermarket.title}
                  width={120}
                  height={120}
                  className="rounded-lg w-20 h-20 sm:w-[120px] sm:h-[120px] object-contain"
                />
                <div
                  className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 rounded-[8px] px-3 py-1 whitespace-nowrap text-xs sm:text-base font-medium"
                  style={{
                    backgroundColor: bgColor,
                    color: darkenHex(bgColor, 140),
                  }}
                >
                  {supermarket.description}
                </div>
              </div>

              <h1 className="text-sm sm:text-lg lg:text-xl font-normal leading-[110%] text-content-neutral-primary text-center">
                {supermarket.title}
              </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shoppers;
