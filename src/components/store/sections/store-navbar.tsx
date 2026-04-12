"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import { MapPin, ShoppingCart, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  ADDRESS_LIST_QUERY_KEY,
  listAddresses,
} from "@/services/address/address.api";
import { useCustomerAuthUiStore } from "@/stores/customer-auth-ui-store";
import { useCustomerDeliveryAddressStore } from "@/stores/customer-delivery-address-store";
import {
  formatAddressDisplay,
  pickDefaultAddress,
} from "@/lib/address-display";

const StoreNavbar = () => {
  const openLocation = useCustomerAuthUiStore((s) => s.openLocation);
  const selectedAddress = useCustomerDeliveryAddressStore(
    (s) => s.selectedAddress
  );

  const { data, isLoading } = useQuery({
    queryKey: ADDRESS_LIST_QUERY_KEY,
    queryFn: listAddresses,
    select: (res) => res.data,
  });

  const defaultFromApi = pickDefaultAddress(data ?? []);
  const displayAddress = selectedAddress ?? defaultFromApi;
  const labelText = isLoading
    ? "Loading…"
    : displayAddress
      ? formatAddressDisplay(displayAddress)
      : "Add new address";

  return (
    <div className="w-full border-b-[0.5px] border-border-strong">
      <div className="flex justify-between items-center max-w-[90%] mx-auto pt-6 pb-4">
        <Link href="/" className="cursor-pointer">
          <Image
            src={"/images/logo.svg"}
            alt="logo"
            height={62}
            width={90}
            className="cursor-pointer"
          />
        </Link>
        <div className="flex gap-10">
          <button
            type="button"
            onClick={openLocation}
            className="flex max-w-[220px] min-w-0 items-center gap-2 rounded-md border-none bg-transparent py-6 px-4 text-left text-base font-normal leading-[100%] text-content-neutral-primary cursor-pointer"
          >
            <MapPin className="size-5 shrink-0 text-content-link" aria-hidden />
            <span className="truncate">{labelText}</span>
          </button>
          <Input
            type="text"
            placeholder="Search Asap you"
            className="w-[300px] rounded-sm py-6 px-4 border-none bg-surface-input-dim text-content-on-brand font-normal text-base leading-[100%] placeholder:text-white/75"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex justify-center items-center bg-primary rounded-full h-13 w-13">
            <UserRound className="text-primary-foreground" size={24} />
          </div>
          <div className="flex justify-center items-center bg-primary rounded-full h-13 w-13">
            <ShoppingCart className="text-primary-foreground" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreNavbar;
