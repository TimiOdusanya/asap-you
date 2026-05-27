/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { FooterCtaButtons } from "@/components/landing-page/footer-cta-buttons";
import { FooterLocationCheck } from "@/components/landing-page/footer-location-check";

const footerLinks = [
  "Company",
  "Features",
  "Blogs",
  "Careers",
  "About us",
  "Terms",
  "Privacy",
  "Cookies",
];

const Footer = () => {
  return (
    <div className="bg-surface-forest-deep py-12 sm:py-16 lg:py-20">
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col justify-center items-center gap-5 sm:gap-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[110%] text-surface-brand-soft">
            We’re Already in Your Neighborhood
          </h1>
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal leading-[130%] text-content-on-dark-section">
            Enter your location to see if we deliver to you
          </h1>
          <FooterLocationCheck />
        </div>

        <div className="w-full h-px bg-white/15" />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
          <img
            src={"/images/landing/logo.svg"}
            alt="logo"
            className="w-[56px] h-auto sm:w-[64px]"
          />
          <h1 className="text-lg sm:text-xl lg:text-2xl font-normal leading-[120%] text-content-on-dark-section">
            Are you Ready to Shop Smarter?
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
            <div className="flex flex-col gap-1.5">
              <span className="text-content-on-dark-section text-sm sm:text-base font-normal leading-[100%] opacity-70">Email</span>
              <span className="text-content-on-dark-section text-sm sm:text-base font-normal leading-[100%]">rushlyco@gmail.com</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-content-on-dark-section text-sm sm:text-base font-normal leading-[100%] opacity-70">Phone number</span>
              <span className="text-content-on-dark-section text-sm sm:text-base font-normal leading-[100%]">+234 812 345 6789</span>
            </div>
          </div>
          <FooterCtaButtons />
        </div>

        <div className="w-full h-px bg-white/15" />

        <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-10 lg:gap-x-16 items-center justify-center mt-2">
          {footerLinks.map((label) => (
            <Link
              key={label}
              href="/"
              className="cursor-pointer text-white-100 text-sm sm:text-base font-light leading-[100%]"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
