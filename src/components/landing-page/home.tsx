import React from "react";
import Image from "next/image";
import { GetStartedButton } from "@/components/landing-page/get-started-button";

const Home = () => {
  return (
    <div className="mt-10 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-16 lg:space-y-20 max-w-[90%] lg:max-w-[85%] mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-12">
        <div className="flex flex-col gap-3 sm:gap-6">
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] xl:text-[64px] font-normal leading-[110%] text-content-neutral-primary">
            Skip the Queue,
          </h1>
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] xl:text-[64px] font-normal leading-[110%] text-content-neutral-primary">
            Shop in Seconds.
          </h1>
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 lg:max-w-[500px]">
          <p className="text-base sm:text-lg md:text-xl xl:text-2xl font-normal leading-[140%] text-content-neutral-secondary">
            No more long lines or traffic. Order from your favorite stores in
            minutes — with 99.9% on-time delivery.
          </p>
          <GetStartedButton />
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 z-10 relative">
        {Array.from({ length: 4 }, (_, i) => (
          <Image
            key={i}
            src={`/images/landing/hero-${i + 1}.svg`}
            alt={`hero-${i + 1}`}
            width={200}
            height={250}
            className="w-[70px] sm:w-[100px] md:w-[140px] lg:w-[170px] xl:w-[250px] h-auto"
          />
        ))}
      </div>

      <div className="hidden md:block absolute bottom-0 left-0 z-0 w-full">
        <Image
          src={"/images/landing/vector.svg"}
          alt="home"
          width={1200}
          height={1000}
        />
      </div>
    </div>
  );
};

export default Home;
