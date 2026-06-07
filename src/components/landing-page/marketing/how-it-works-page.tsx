import Image from "next/image";
import Link from "next/link";
import { GetStartedButton } from "@/components/landing-page/get-started-button";
import { MarketingPageShell } from "@/components/landing-page/marketing/marketing-page-shell";

const steps = [
  {
    step: "01",
    title: "Browse nearby stores",
    description:
      "Explore supermarkets, pharmacies, and local vendors in the Oshodi–Ikeja corridor — all in one place.",
    image: "/images/landing/arrival-1.png",
  },
  {
    step: "02",
    title: "Build your cart",
    description:
      "Add items from your favorite stores, apply your saved preferences, and review transparent pricing before checkout.",
    image: "/images/landing/arrival-2.png",
  },
  {
    step: "03",
    title: "Pay securely",
    description:
      "Checkout with card, bank transfer, or wallet. Delivery fees and service charges are shown upfront.",
    image: "/images/landing/arrival-3.png",
  },
  {
    step: "04",
    title: "Track to your door",
    description:
      "Follow your order in real time as the store prepares it and a rider brings it straight to you.",
    image: "/images/landing/arrival-4.png",
  },
];

export function HowItWorksPageContent() {
  return (
    <MarketingPageShell>
      <section className="mx-auto max-w-[90%] lg:max-w-[85%] py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-surface-brand">
            How it works
          </p>
          <h1 className="mt-4 text-3xl font-normal leading-[110%] text-content-neutral-primary sm:text-4xl lg:text-5xl">
            From aisle to arrival in four simple steps
          </h1>
          <p className="mt-5 text-base leading-relaxed text-content-neutral-secondary sm:text-lg">
            Asapu connects you to trusted local stores and reliable riders so groceries and
            essentials reach you fast — without the queue or the traffic.
          </p>
        </div>

        <div className="mt-14 space-y-10 lg:mt-20 lg:space-y-16">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[340/374] overflow-hidden rounded-2xl border border-border-muted bg-surface-subtle shadow-lg">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit rounded-full bg-surface-brand/10 px-4 py-1.5 text-sm font-medium text-surface-brand">
                  Step {item.step}
                </span>
                <h2 className="text-2xl font-normal leading-[115%] text-content-neutral-primary sm:text-3xl">
                  {item.title}
                </h2>
                <p className="text-base leading-relaxed text-content-neutral-secondary sm:text-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-surface-forest px-6 py-10 text-center sm:px-10 sm:py-14 lg:mt-24">
          <h2 className="text-2xl font-normal leading-[115%] text-surface-brand-soft sm:text-3xl">
            Ready to skip the queue?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-content-on-dark-section sm:text-lg">
            Create your account and place your first order in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GetStartedButton />
            <Link
              href="/"
              className="inline-flex h-11 items-center rounded-full border border-white/30 px-6 text-sm text-content-on-dark-section transition hover:bg-white/10"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
