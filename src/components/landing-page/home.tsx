import React from "react";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";
import Image from "next/image";

const Home = () => {
  return (
    <div className="mt-20 space-y-20 max-w-[85%] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-[64px] font-normal leading-[100%] text-gray-400">Skip the Queue,</h1>
          <h1 className="text-[64px] font-normal leading-[100%] text-gray-400">Shop in Seconds.</h1>
        </div>
        <div className="flex flex-col gap-6">
            <p className="text-[24px] font-normal leading-[140%] text-gray-300 max-w-[500px]">No more long lines or traffic. 
                Order from your favorite stores in minute  — with 99.9% on-time delivery</p>
                <Button variant="default" className="w-[150px]"> <RocketIcon className="size-4" /> Get Started</Button>
        </div>
      </div>

      <div className="flex gap-[80px] justify-center items-center z-10 relative">
        <Image src={"/images/landing/hero-1.svg"} alt="home" width={250} height={300} />
        <Image src={"/images/landing/hero-2.svg"} alt="home" width={250} height={300} />
        <Image src={"/images/landing/hero-3.svg"} alt="home" width={250} height={300} />
        <Image src={"/images/landing/hero-4.svg"} alt="home" width={250} height={300} />
      </div>

        <div className="absolute bottom-0 left-0 z-0 w-full">
            <Image src={"/images/landing/vector.svg"} alt="home" width={1200} height={1000} />
        </div>
    </div>
  );
};

export default Home;
