import React from "react";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import Image from "next/image";

const Home = () => {
  return (
    <div className="mt-20 space-y-20 max-w-[90%] lg:max-w-[85%] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-[32px] sm:text-[32px] md:text-[40px] xl:text-[64px] font-normal leading-[100%] text-gray-400">
            Skip the Queue,
          </h1>
          <h1 className="text-[32px] sm:text-[32px] md:text-[40px] xl:text-[64px] font-normal leading-[100%] text-gray-400">
            Shop in Seconds.
          </h1>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-[16px] sm:text-[16px] md:text-[24px] xl:text-[24px] font-normal leading-[140%] text-gray-300 sm:max-w-[300px] md:max-w-[300px] xl:max-w-[500px]">
            No more long lines or traffic. Order from your favorite stores in
            minute — with 99.9% on-time delivery
          </p>
          <Button variant="default" className="w-[150px]">
            {" "}
            <RocketIcon className="size-4" /> Get Started
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6 sm:gap-10 md:gap-16 lg:gap-20 z-10 relative">
        {Array.from({ length: 4 }, (_, i) => (
          <Image
            key={i}
            src={`/images/landing/hero-${i + 1}.svg`}
            alt={`hero-${i + 1}`}
            width={200}
            height={250}
            className="w-[60px] sm:w-[60px] md:w-[120px] lg:w-[150px] xl:w-[250px] h-auto"
          />
        ))}
      </div>

      <div className="absolute sm:hidden md:block lg:hidden xl:block bottom-0 left-0 z-0 w-full">
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
