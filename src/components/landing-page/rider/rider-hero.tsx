import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BikeIcon } from "lucide-react";
import { HeroFlipImage } from "@/components/landing-page/hero-flip-image";

const RiderHero = () => {
  return (
    <div className="relative overflow-x-hidden">
      <section className="mx-auto flex w-full max-w-[90%] flex-col pt-4 lg:max-w-[85%] sm:min-h-[calc(100dvh-5.25rem)] sm:justify-between sm:pt-8 lg:min-h-[calc(100dvh-6.25rem)] lg:pt-10">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex flex-col gap-3 sm:gap-6">
            <h1 className="text-[28px] font-normal leading-[110%] text-content-neutral-primary sm:text-[36px] md:text-[48px] xl:text-[64px]">
              Ride, Deliver,
            </h1>
            <h1 className="text-[28px] font-normal leading-[110%] text-content-neutral-primary sm:text-[36px] md:text-[48px] xl:text-[64px]">
              And Earn
            </h1>
          </div>
          <div className="flex flex-col gap-4 sm:gap-6 lg:max-w-[500px]">
            <p className="text-base font-normal leading-[140%] text-content-neutral-secondary sm:text-lg md:text-xl xl:text-2xl">
              Join our network of reliable riders, deliver essential goods, and
              get paid on time — every time.
            </p>
            <Button
              type="button"
              variant="default"
              className="w-[200px] rounded-full px-6 py-5 text-base sm:py-6"
              asChild
            >
              <Link href="/rider/signup">
                <BikeIcon className="size-4" aria-hidden />
                Become a Rider
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-4 items-end gap-1.5 pb-8 sm:mt-0 sm:gap-3 sm:pb-16 md:gap-5 md:pb-20 lg:gap-8 lg:pb-24 xl:gap-10 xl:pb-28">
          {Array.from({ length: 4 }, (_, i) => (
            <HeroFlipImage
              key={i}
              src={`/images/landing/rider/rider-hero-${i + 1}.png`}
              alt={`rider hero ${i + 1}`}
              className="w-full min-w-0"
            />
          ))}
        </div>
      </section>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-screen -translate-x-1/2"
        aria-hidden
      >
        <Image
          src="/images/landing/vector.svg"
          alt=""
          width={1440}
          height={300}
          className="h-auto w-full"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
};

export default RiderHero;
