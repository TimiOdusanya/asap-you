"use client";

import Link from "next/link";
import { WhatsappLogoIcon } from "@phosphor-icons/react";
import { MarketingPageShell } from "@/components/landing-page/marketing/marketing-page-shell";
import { WHATSAPP_DISPLAY_NUMBER, WHATSAPP_URL } from "@/lib/whatsapp";

export function ChatUsPageContent() {
  return (
    <MarketingPageShell>
      <section className="mx-auto flex max-w-[90%] flex-col items-center justify-center px-4 py-20 sm:py-28 lg:max-w-[85%] lg:py-32">
        <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-green-100 bg-gradient-to-b from-green-50 via-white to-white px-6 py-14 text-center shadow-xl sm:px-12">
          <div className="pointer-events-none absolute -top-8 right-0 h-36 w-36 rounded-full bg-green-200/30 blur-3xl" />
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E]">
            <WhatsappLogoIcon className="size-9" weight="fill" aria-hidden />
          </div>
          <h1 className="relative mt-6 text-3xl font-normal leading-[110%] text-content-neutral-primary sm:text-4xl">
            Chat with us
          </h1>
          <p className="relative mx-auto mt-4 max-w-md text-base leading-relaxed text-content-neutral-secondary">
            Tap the button below to start a conversation with our support team on WhatsApp at{" "}
            <span className="font-medium text-content-neutral-primary">{WHATSAPP_DISPLAY_NUMBER}</span>.
          </p>
          <div className="relative mt-8 flex flex-col items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-medium text-white transition hover:bg-[#20bd5a]"
            >
              <WhatsappLogoIcon className="size-5" weight="fill" aria-hidden />
              Chat on WhatsApp
            </a>
            <Link
              href="/"
              className="text-sm text-content-neutral-muted transition hover:text-content-neutral-secondary"
            >
              Return to home
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
