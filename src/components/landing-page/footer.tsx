/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-green-700 py-20">
      <div className="max-w-[85%] mx-auto flex flex-col gap-6">
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-[48px] font-normal leading-[100%] text-gray-200">
            We’re Already in Your Neighborhood
          </h1>
          <h1 className="text-[24px] font-normal leading-[100%] text-white-50">
            Enter your location to see if we deliver to you
          </h1>
          <div className="relative w-[515px]">
            <Input
              type="email"
              id="email"
              placeholder="Type your street, area, or city…"
              className="bg-gray-700 px-6 py-9 rounded-[40px] w-full" // padding-right ~ button width
            />
            <Button className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-300 text-white text-base rounded-[40px] px-6 py-6">
              Current Location
            </Button>
          </div>
        </div>
        <img
          src="/images/landing/lines.png"
          alt="line"
          className="w-[1300px] h-auto mb-4"
        />

        <div className="flex justify-between items-center">
          <img
            src={"/images/landing/logo.svg"}
            alt="line"
            className="w-[64px] h-[44px]"
          />
          <h1 className="text-[24px] font-normal leading-[100%] text-white-50">
            Are you Ready to Shop Smarter?
          </h1>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-white-50 text-base font-normal leading-[100%]">Email</span>
              <span className="text-white-50 text-base font-normal leading-[100%]">rushlyco@gmail.com</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white-50 text-base font-normal leading-[100%]">Phone number</span>
              <span className="text-white-50 text-base font-normal leading-[100%]">+234 812 345 6789</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-green-300 text-white text-base rounded-[40px] px-6 py-6">
              Get Started
            </Button>
            <Button className="bg-green-700 border border-green-400 text-white text-base rounded-[40px] px-6 py-6">
              Become a Vendor
            </Button>
            <Button className="bg-green-700 border border-green-400 text-white text-base rounded-[40px] px-6 py-6">
              Join as Rider
            </Button>
          </div>
        </div>

        <img
          src="/images/landing/lines.png"
          alt="line"
          className="w-[1300px] h-auto mt-4"
        />

        <div className="flex gap-16 items-center justify-center mt-6">
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            Company
          </Link>
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            Features
          </Link>
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            Blogs
          </Link>
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            Careers
          </Link>
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            About us
          </Link>
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            Terms
          </Link>
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            Privacy
          </Link>
          <Link href="/" className="text-white-100 text-base font-light leading-[100%]">
            Cookies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
