import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RocketIcon } from "lucide-react";

const VendorHero = () => {
  return (
    <div className="mt-10 sm:mt-16 lg:mt-20 space-y-12 sm:space-y-16 lg:space-y-20 max-w-[90%] lg:max-w-[85%] mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-12">
        <div className="flex flex-col gap-3 sm:gap-6">
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] xl:text-[64px] font-normal leading-[110%] text-content-neutral-primary">
            Selling Smarter,
          </h1>
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] xl:text-[64px] font-normal leading-[110%] text-content-neutral-primary">
            Not Harder.
          </h1>
        </div>
        <div className="flex flex-col gap-4 sm:gap-6 lg:max-w-[500px]">
          <p className="text-base sm:text-lg md:text-xl xl:text-2xl font-normal leading-[140%] text-content-neutral-secondary">
            Reach thousands of ready-to-buy customers, enjoy seamless delivery
            support, and get paid on time — every time.
          </p>
          <Button
            type="button"
            variant="default"
            className="w-[200px] rounded-full px-6 py-5 sm:py-6 text-base"
            asChild
          >
            <Link href="/vendor/signup">
              <RocketIcon className="size-4" aria-hidden />
              Become a Vendor
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-center items-end gap-3 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14 z-10 relative">
          {[1, 2, 3, 4].map((i) => (
            <Image
              key={i}
              src={`/images/landing/vendor/vendor-hero-${i}.png`}
              alt={`vendor hero ${i}`}
              width={260}
              height={320}
              className="w-[80px] sm:w-[130px] md:w-[180px] lg:w-[220px] xl:w-[260px] h-auto rounded-[20px] sm:rounded-[28px] object-cover"
            />
          ))}
        </div>

        <div className="hidden md:block absolute bottom-0 left-0 z-0 w-full pointer-events-none">
          <Image
            src="/images/landing/vector.svg"
            alt=""
            width={1200}
            height={400}
            className="w-full opacity-60"
          />
        </div>
      </div>
    </div>
  );
};

export default VendorHero;
