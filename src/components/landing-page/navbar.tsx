import Image from "next/image";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center max-w-[85%] mx-auto pt-6">
      <Link href="/">
        <Image
          src={"/images/logo.svg"}
          alt="logo"
          height={62}
          width={90}
          className="cursor-pointer"
        />
      </Link>
      <div className="flex gap-[27px]">
        <span className="text-gray-300 font-normal text-xl leading-[100%]">
          {" "}
          How it works
        </span>
        <span className="text-gray-300 font-normal text-xl leading-[100%]">
          {" "}
          Pricing
        </span>
        <span className="text-gray-300 font-normal text-xl leading-[100%]">
          {" "}
          Services
        </span>
        <span className="text-gray-300 font-normal text-xl leading-[100%]">
          {" "}
          Blog
        </span>
      </div>

      <Select>
        <SelectTrigger className="w-[130px] rounded-3xl py-6 px-4 border border-green-300 text-gray-300 font-normal text-base leading-[100%]">
          <SelectValue placeholder="Customer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Customer</SelectItem>
          <SelectItem value="dark">
            <Link href="/vendor">Vendor</Link>
          </SelectItem>
          <Link href="/rider">
            <SelectItem value="system">Rider</SelectItem>
          </Link>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Navbar;
