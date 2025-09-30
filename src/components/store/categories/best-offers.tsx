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

const BestOffers = () => {
  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 10,
    minutes: 4,
    seconds: 11
  });

  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        
        // Trigger pulse animation when seconds change
        setIsAnimating(true);
        setPulseAnimation(true);
        
        // Reset pulse animation after 200ms
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
          // Timer ended - reset to initial values
          return {
            days: 12,
            hours: 10,
            minutes: 4,
            seconds: 11
          };
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset animation state
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Format numbers with leading zeros
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-green-700">
      <div className="max-w-[90%] mx-auto py-24 space-y-20">
        <div className="flex justify-around items-center">
          <div className="flex flex-col gap-10 justify-center items-center">
          <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-green-400 text-xl md:text-[20px] font-normal">
              Deals of The Day
            </h1>
            <h2 className="text-white text-[40px] font-semibold max-w-[400px] text-center">
              Grab The Best Offer This Week
            </h2>
          </div>
            <div className="flex flex-col gap-4 justify-center items-center">
              <span className="text-white text-2xl font-normal">
                Hurry up! Offers end in:
              </span>
              <div className="flex gap-6">
                {/* Days */}
                <div className="flex flex-col gap-3 justify-center items-center">
                  <div className={`
                    relative flex bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-xl shadow-lg
                    transition-all duration-300 ease-out
                    ${isAnimating ? 'scale-110 shadow-2xl' : 'scale-100'}
                    ${pulseAnimation ? 'animate-pulse' : ''}
                    hover:scale-105 hover:shadow-xl
                  `}>
                    <span className={`
                      text-white text-3xl font-bold
                      transition-all duration-200
                      ${isAnimating ? 'text-green-100' : 'text-white'}
                    `}>
                      {formatNumber(timeLeft.days)}
                    </span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-green-400 rounded-xl opacity-20 blur-sm -z-10"></div>
                  </div>
                  <span className="text-white text-lg font-medium tracking-wide">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="flex flex-col gap-3 justify-center items-center">
                  <div className={`
                    relative flex bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-xl shadow-lg
                    transition-all duration-300 ease-out
                    ${isAnimating ? 'scale-110 shadow-2xl' : 'scale-100'}
                    ${pulseAnimation ? 'animate-pulse' : ''}
                    hover:scale-105 hover:shadow-xl
                  `}>
                    <span className={`
                      text-white text-3xl font-bold
                      transition-all duration-200
                      ${isAnimating ? 'text-green-100' : 'text-white'}
                    `}>
                      {formatNumber(timeLeft.hours)}
                    </span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-green-400 rounded-xl opacity-20 blur-sm -z-10"></div>
                  </div>
                  <span className="text-white text-lg font-medium tracking-wide">
                    Hrs
                  </span>
                </div>

                {/* Minutes */}
                <div className="flex flex-col gap-3 justify-center items-center">
                  <div className={`
                    relative flex bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-xl shadow-lg
                    transition-all duration-300 ease-out
                    ${isAnimating ? 'scale-110 shadow-2xl' : 'scale-100'}
                    ${pulseAnimation ? 'animate-pulse' : ''}
                    hover:scale-105 hover:shadow-xl
                  `}>
                    <span className={`
                      text-white text-3xl font-bold
                      transition-all duration-200
                      ${isAnimating ? 'text-green-100' : 'text-white'}
                    `}>
                      {formatNumber(timeLeft.minutes)}
                    </span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-green-400 rounded-xl opacity-20 blur-sm -z-10"></div>
                  </div>
                  <span className="text-white text-lg font-medium tracking-wide">
                    Mins
                  </span>
                </div>

                {/* Seconds */}
                <div className="flex flex-col gap-3 justify-center items-center">
                  <div className={`
                    relative flex bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-xl shadow-lg
                    transition-all duration-300 ease-out
                    ${isAnimating ? 'scale-110 shadow-2xl' : 'scale-100'}
                    ${pulseAnimation ? 'animate-pulse' : ''}
                    hover:scale-105 hover:shadow-xl
                  `}>
                    <span className={`
                      text-white text-3xl font-bold
                      transition-all duration-200
                      ${isAnimating ? 'text-green-100' : 'text-white'}
                    `}>
                      {formatNumber(timeLeft.seconds)}
                    </span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-green-400 rounded-xl opacity-20 blur-sm -z-10"></div>
                  </div>
                  <span className="text-white text-lg font-medium tracking-wide">
                    Secs
                  </span>
                </div>
              </div>
            </div>
            <button className="
              relative bg-green-700 border-2 border-green-400 text-white text-base font-medium px-8 py-4 rounded-full 
              cursor-pointer overflow-hidden group
              hover:bg-green-400 hover:border-green-300 hover:scale-105
              transition-all duration-300 ease-out
              hover:shadow-lg hover:shadow-green-400/25
              active:scale-95
            ">
              <span className="relative z-10">SEE ALL</span>
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            {items.map((item, index) => (
                <div
                key={item.id}
                className="
                  flex flex-col justify-center items-center gap-4 bg-white rounded-xl px-12 py-8
                  shadow-lg hover:shadow-2xl
                  transform transition-all duration-500 ease-out
                  hover:scale-105 hover:-translate-y-2
                  group cursor-pointer
                  border border-gray-100 hover:border-green-200
                "
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
                >
                {/* Product Image with hover effect */}
                <div className="relative overflow-hidden rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    width={180} 
                    height={180}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/10 transition-colors duration-300"></div>
                </div>

                <div className="flex flex-col justify-center items-center gap-2">
                    <h3 className="text-lg font-medium text-[#8E8C8C] group-hover:text-gray-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <h3 className="text-gray-400 text-xl font-semibold group-hover:text-gray-500 transition-colors duration-300">
                      {item.subtitle}
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-[#8E8C8C] text-sm font-normal line-through opacity-70">
                      {item.oldPrice}
                    </span>
                    <span className="text-red-500 text-lg font-bold bg-red-50 px-2 py-1 rounded-md">
                      {item.newPrice}
                    </span>
                </div>

                <button className="
                  relative bg-green-400 text-white text-base font-semibold px-8 py-3 rounded-full 
                  cursor-pointer overflow-hidden group/btn
                  hover:bg-green-500 hover:scale-105 hover:shadow-lg
                  transition-all duration-300 ease-out
                  active:scale-95
                  w-full
                ">
                  <span className="relative z-10">Add To Cart</span>
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 group-hover/btn:opacity-0 transition-all duration-500 rounded-full"></div>
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
