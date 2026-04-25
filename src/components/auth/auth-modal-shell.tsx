"use client";

import Image from "next/image";
import * as React from "react";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react";

const BRAND = "#4CAF50";

const shellPadding = "p-6 sm:p-8";

export function AuthModalShell({
  leftTitle,
  leftSubtitle,
  leftFooter,

  children,
  className,
  promoPosition = "start",
  showCloseButton = true,
}: {
  leftTitle: string;
  leftSubtitle: string;
  leftFooter?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** `start` = green panel first (left on desktop). `end` = green panel last (right on desktop). */
  promoPosition?: "start" | "end";
  showCloseButton?: boolean;
}) {
  const promoPanel = (
    <div
      className="relative hidden md:flex min-h-[200px] flex-1 flex-col md:min-h-[520px] md:max-w-[45%]"
      style={{ backgroundColor: "#0f2310" }}
    >
      <Image
        src="/images/auth/auth-bg.svg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="relative z-10 shrink-0 p-4 sm:p-6">
        <Image
          src="/images/logo.svg"
          alt="Asap You"
          width={ 80 }
          height={ 32 }
          className="h-6 w-auto"
        />
      </div>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-14 px-6 pb-10 text-center sm:px-8">
        <div className="flex max-w-[280px] flex-col items-center gap-5">
          <h2 className="text-[24px] font-medium leading-tight text-white sm:text-2xl">
            {leftTitle}
          </h2>
          <p className="text-sm leading-relaxe max-w-[200px] text-center text-white/90">{leftSubtitle}</p>
        </div>
        {leftFooter ? (
          <div className="flex w-full flex-col items-center">{leftFooter}</div>
        ) : null}
      </div>
    </div>
  );

  const formPanel = (
    <div className="relative flex flex-1 flex-col bg-white md:max-w-[55%] overflow-y-auto">
      {showCloseButton ? (
        <DialogClose
          className="absolute top-4 right-4 z-20 cursor-pointer rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          type="button"
        >
          <X className="size-5" weight="regular" aria-hidden />
          <span className="sr-only">Close</span>
        </DialogClose>
      ) : null}
      <div className={cn(shellPadding, "flex min-h-0 flex-1 flex-col pt-10 md:pt-12")}>
        {children}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl max-h-[90svh] md:max-h-[90vh] md:w-[min(92vw,880px)] md:flex-row",
        className
      )}
    >
      {promoPosition === "end" ? (
        <>
          {formPanel}
          {promoPanel}
        </>
      ) : (
        <>
          {promoPanel}
          {formPanel}
        </>
      )}
    </div>
  );
}

export const authBrandStyle = { color: BRAND } as const;
export const authBrandBg = { backgroundColor: BRAND } as const;
