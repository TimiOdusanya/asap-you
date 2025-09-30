import Image from "next/image";
import React from "react";

import Link from "next/link";
import { MapPin, ShoppingCart, UserRound } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const StoreNavbar = () => {
  return (
    <div className="w-full border-b-[0.5px] border-[#8E8C8C]">
      <div className="flex justify-between items-center max-w-[90%] mx-auto pt-6 pb-4">
        <Link href="/">
          <Image
            src={"/images/logo.svg"}
            alt="logo"
            height={62}
            width={90}
            className="cursor-pointer"
          />
        </Link>
        <div className="flex gap-10">
        <Select>
          <SelectTrigger className="w-[160px] border-none py-6 px-4 text-gray-400 font-normal text-base leading-[100%]">
            <MapPin className="text-[#265728] size={20}" /> <SelectValue placeholder="Airport St" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Airport Str</SelectItem>
            <SelectItem value="dark">
              <Link href="/vendor">Vendor</Link>
            </SelectItem>
            <Link href="/rider">
              <SelectItem value="system">Rider</SelectItem>
            </Link>
          </SelectContent>
        </Select>   
        <Input  
          type="text"
          placeholder="Search Asap you"
          className="w-[300px] rounded-sm py-6 px-4 border-none bg-[8E8C8C] text-gray-300 font-normal text-base leading-[100%]"
        />
        </div>

        <div className="flex gap-4">
          <div className="flex justify-center items-center bg-green-400 rounded-full h-13 w-13"><UserRound className="text-white" size={24}/></div>
          <div className="flex justify-center items-center bg-green-400 rounded-full h-13 w-13"><ShoppingCart className="text-white" size={24}/></div>
        </div>
      </div>
    </div>
  );
};

export default StoreNavbar;
