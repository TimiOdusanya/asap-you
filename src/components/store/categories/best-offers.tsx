'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";

const items = [
  {
    id: 1,
    image: "/images/store/burger.png",
    title: "Chicken Burger",
    subtitle: "Burger King, Yaba",
    oldPrice: "N 15,500",
    newPrice: "N 8,500",
  },
  {
    id: 2,
    image: "/images/store/burger.png",
    title: "Pepperoni Pizza",
    subtitle: "Domino’s, Ikeja",
    oldPrice: "N 12,000",
    newPrice: "N 7,500",
  },
];

const CountdownCell = ({
  value,
  label,
  isAnimating,
  pulseAnimation,
}: {
  value: string;
  label: string;
  isAnimating: boolean;
  pulseAnimation: boolean;
}) => (
  <div className="flex flex-col gap-2 sm:gap-3 justify-center items-center">
    <div
      className={`
        relative flex items-center justify-center bg-gradient-to-br from-primary to-surface-brand-muted
        p-3 sm:p-5 lg:p-6 rounded-xl shadow-lg min-w-[56px] sm:min-w-[68px]
        transition-all duration-300 ease-out
        ${isAnimating ? 'scale-110 shadow-2xl' : 'scale-100'}
        ${pulseAnimation ? 'animate-pulse' : ''}
        hover:scale-105 hover:shadow-xl
      `}
    >
      <span
        className={`
          text-xl sm:text-2xl lg:text-3xl font-bold
          transition-all duration-200
          ${isAnimating ? 'text-surface-brand-tint' : 'text-primary-foreground'}
        `}
      >
        {value}
      </span>
      <div className="absolute inset-0 bg-primary rounded-xl opacity-20 blur-sm -z-10" />
    </div>
    <span className="text-content-on-brand text-sm sm:text-base lg:text-lg font-medium tracking-wide">
      {label}
    </span>
  </div>
);

const BestOffers = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 10,
    minutes: 4,
    seconds: 11,
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        setIsAnimating(true);
        setPulseAnimation(true);
        setTimeout(() => setPulseAnimation(false), 200);

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        } else {
          return { days: 12, hours: 10, minutes: 4, seconds: 11 };
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-surface-forest-deep">
      <div className="max-w-[90%] mx-auto py-16 sm:py-20 lg:py-24 space-y-12 sm:space-y-16 lg:space-y-20">
        <div className="flex flex-col lg:flex-row lg:justify-around lg:items-center gap-12 lg:gap-10">
          <div className="flex flex-col gap-8 sm:gap-10 justify-center items-center">
            <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center text-center">
              <h1 className="text-primary text-lg sm:text-xl font-normal">
                Deals of The Day
              </h1>
              <h2 className="text-content-on-brand text-3xl sm:text-4xl lg:text-[40px] font-semibold max-w-[400px] leading-[110%]">
                Grab The Best Offer This Week
              </h2>
            </div>

            <div className="flex flex-col gap-4 justify-center items-center">
              <span className="text-content-on-brand text-lg sm:text-xl lg:text-2xl font-normal text-center">
                Hurry up! Offers end in:
              </span>
              <div className="flex gap-3 sm:gap-5 lg:gap-6">
                <CountdownCell
                  value={formatNumber(timeLeft.days)}
                  label="Days"
                  isAnimating={isAnimating}
                  pulseAnimation={pulseAnimation}
                />
                <CountdownCell
                  value={formatNumber(timeLeft.hours)}
                  label="Hrs"
                  isAnimating={isAnimating}
                  pulseAnimation={pulseAnimation}
                />
                <CountdownCell
                  value={formatNumber(timeLeft.minutes)}
                  label="Mins"
                  isAnimating={isAnimating}
                  pulseAnimation={pulseAnimation}
                />
                <CountdownCell
                  value={formatNumber(timeLeft.seconds)}
                  label="Secs"
                  isAnimating={isAnimating}
                  pulseAnimation={pulseAnimation}
                />
              </div>
            </div>

            <button className="
              relative bg-surface-forest-deep border-2 border-primary text-primary-foreground text-sm sm:text-base font-medium
              px-6 sm:px-8 py-3 sm:py-4 rounded-full
              cursor-pointer overflow-hidden group
              hover:bg-primary hover:border-primary hover:scale-105
              transition-all duration-300 ease-out
              hover:shadow-lg hover:shadow-primary/25
              active:scale-95
            ">
              <span className="relative z-10">SEE ALL</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-surface-brand-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-items-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="
                  w-full max-w-sm flex flex-col justify-center items-center gap-4
                  bg-surface-canvas rounded-xl px-6 sm:px-10 py-6 sm:py-8
                  shadow-lg hover:shadow-2xl
                  transform transition-all duration-500 ease-out
                  hover:scale-105 hover:-translate-y-2
                  group cursor-pointer
                  border border-border-muted hover:border-surface-brand-soft
                "
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                <div className="relative overflow-hidden rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={180}
                    height={180}
                    className="w-36 h-36 sm:w-[180px] sm:h-[180px] object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </div>

                <div className="flex flex-col justify-center items-center gap-1 sm:gap-2 text-center">
                  <h3 className="text-base sm:text-lg font-medium text-content-neutral-muted group-hover:text-content-neutral-tertiary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <h3 className="text-content-neutral-primary text-lg sm:text-xl font-semibold group-hover:text-content-neutral-tertiary transition-colors duration-300">
                    {item.subtitle}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-content-neutral-muted text-sm font-normal line-through opacity-70">
                    {item.oldPrice}
                  </span>
                  <span className="text-content-negative-strong text-base sm:text-lg font-bold bg-red-500/10 px-2 py-1 rounded-md">
                    {item.newPrice}
                  </span>
                </div>

                <button className="
                  relative bg-primary text-primary-foreground text-sm sm:text-base font-semibold
                  px-6 sm:px-8 py-2.5 sm:py-3 rounded-full
                  cursor-pointer overflow-hidden group/btn
                  hover:bg-surface-brand-muted hover:scale-105 hover:shadow-lg
                  transition-all duration-300 ease-out
                  active:scale-95
                  w-full
                ">
                  <span className="relative z-10">Add To Cart</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 group-hover/btn:opacity-0 transition-all duration-500 rounded-full" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestOffers;
