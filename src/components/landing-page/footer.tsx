/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

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
          <div className="relative w-full max-w-[515px]">
            <Input
              type="email"
              id="email"
              placeholder="Type your street, area, or city…"
              className="bg-surface-elevated px-5 sm:px-6 py-6 sm:py-9 rounded-[40px] w-full pr-[150px] sm:pr-[190px] text-content-neutral-primary placeholder:text-content-neutral-muted text-sm sm:text-base"
            />
            <Button className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs sm:text-base rounded-[40px] px-3 sm:px-6 py-4 sm:py-6 whitespace-nowrap">
              Current Location
            </Button>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Button className="bg-primary text-primary-foreground text-sm sm:text-base rounded-[40px] px-4 sm:px-6 py-5 sm:py-6">
              Get Started
            </Button>
            <Button className="bg-surface-forest-deep border border-primary text-primary-foreground text-sm sm:text-base rounded-[40px] px-4 sm:px-6 py-5 sm:py-6">
              Become a Vendor
            </Button>
            <Button className="bg-surface-forest-deep border border-primary text-primary-foreground text-sm sm:text-base rounded-[40px] px-4 sm:px-6 py-5 sm:py-6">
              Join as Rider
            </Button>
          </div>
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
