"use client";

import Link from "next/link";
import { NewspaperIcon } from "@phosphor-icons/react";
import { MarketingPageShell } from "@/components/landing-page/marketing/marketing-page-shell";

export function BlogPageContent() {
  return (
    <MarketingPageShell>
      <section className="mx-auto flex max-w-[90%] flex-col items-center justify-center px-4 py-20 sm:py-28 lg:max-w-[85%] lg:py-32">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border-muted bg-white px-6 py-14 text-center shadow-xl sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-surface-brand/10 blur-2xl" />
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-brand/10 text-surface-brand">
            <NewspaperIcon className="size-8" weight="duotone" aria-hidden />
          </div>
          <p className="relative mt-6 text-sm font-medium uppercase tracking-[0.2em] text-surface-brand">
            Blog
          </p>
          <h1 className="relative mt-4 text-3xl font-normal leading-[110%] text-content-neutral-primary sm:text-4xl">
            Stories, tips, and updates — coming soon
          </h1>
          <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-content-neutral-secondary sm:text-lg">
            We&apos;re preparing articles on smarter shopping, vendor spotlights, and delivery
            insights for the Asapu community.
          </p>
          <span className="relative mt-8 inline-flex rounded-full bg-surface-subtle px-4 py-2 text-sm text-content-neutral-muted">
            Launching soon
          </span>
          <div className="relative mt-10">
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-full bg-surface-brand px-6 text-sm font-medium text-white transition hover:bg-surface-brand/90"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
