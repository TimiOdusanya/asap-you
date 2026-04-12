"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = {
  customer: { label: "Customer", path: "/" },
  vendor: { label: "Vendor", path: "/vendor" },
  rider: { label: "Rider", path: "/rider" },
} as const;

type RoleKey = keyof typeof roles;

export function RoleSwitcher({ current }: { current: RoleKey }) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center max-w-[85%] mx-auto pt-6">
      <Link href="/" className="cursor-pointer">
        <Image
          src="/images/logo.svg"
          alt="logo"
          height={62}
          width={90}
          className="cursor-pointer"
        />
      </Link>
      <div className="hidden gap-[27px] lg:flex">
        <span className="text-content-neutral-secondary font-normal text-xl leading-[100%]">
          How it works
        </span>
        <span className="text-content-neutral-secondary font-normal text-xl leading-[100%]">
          Pricing
        </span>
        <span className="text-content-neutral-secondary font-normal text-xl leading-[100%]">
          Services
        </span>
        <span className="text-content-neutral-secondary font-normal text-xl leading-[100%]">
          Blog
        </span>
      </div>

      <Select
        value={current}
        onValueChange={(value) => {
          const key = value as RoleKey;
          router.push(roles[key].path);
        }}
      >
        <SelectTrigger className="w-[130px] rounded-3xl py-6 px-4 border border-primary text-content-neutral-secondary font-normal text-base leading-[100%]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="vendor">Vendor</SelectItem>
          <SelectItem value="rider">Rider</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
