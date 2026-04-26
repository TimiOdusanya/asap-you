import React from "react";
import Image from "next/image";
import Navbar from "@/components/landing-page/navbar";
import Footer from "@/components/landing-page/footer";

interface RiderAuthBgProps {
  children: React.ReactNode;
}

const RiderAuthBg = ({ children }: RiderAuthBgProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-forest-deep">
      <Navbar current="rider" variant="inverted" />

      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14 relative overflow-hidden">
        <div className="hidden md:block absolute bottom-0 left-0 w-full pointer-events-none z-0">
          <Image
            src="/images/landing/vector.svg"
            alt=""
            width={1440}
            height={400}
            className="w-full opacity-30"
          />
        </div>

        <div className="relative z-10 w-full sm:w-[80%] md:w-[65%] lg:w-[55%] max-w-[640px]">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RiderAuthBg;
