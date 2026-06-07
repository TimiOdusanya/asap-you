import Image from "next/image";
import Link from "next/link";
import { MarketingPageShell } from "@/components/landing-page/marketing/marketing-page-shell";

const services = [
  {
    icon: "/icons/landing/cart.svg",
    title: "Grocery delivery",
    description:
      "Fresh produce, pantry staples, and household essentials from partner supermarkets near you.",
  },
  {
    icon: "/icons/landing/timer.svg",
    title: "Express delivery",
    description:
      "Most orders arrive within 45–60 minutes with live tracking from store prep to your doorstep.",
  },
  {
    icon: "/icons/landing/phone.svg",
    title: "Real-time updates",
    description:
      "SMS, email, and in-app notifications keep you informed at every stage of your order.",
  },
  {
    icon: "/icons/landing/atm.svg",
    title: "Transparent pricing",
    description:
      "Store prices plus clear delivery and service fees — no surprises when you checkout.",
  },
  {
    icon: "/icons/landing/brain.svg",
    title: "Smart reordering",
    description:
      "Quickly repeat past purchases and discover items tailored to what you buy most often.",
  },
  {
    icon: "/icons/landing/cart.svg",
    title: "Multi-vendor checkout",
    description:
      "Shop from multiple stores in one session and manage everything from a single cart experience.",
  },
];

export function ServicesPageContent() {
  return (
    <MarketingPageShell>
      <section className="mx-auto max-w-[90%] lg:max-w-[85%] py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-surface-brand">
            Services
          </p>
          <h1 className="mt-4 text-3xl font-normal leading-[110%] text-content-neutral-primary sm:text-4xl lg:text-5xl">
            Everything you need for faster everyday shopping
          </h1>
          <p className="mt-5 text-base leading-relaxed text-content-neutral-secondary sm:text-lg">
            Asapu is built for busy households, professionals, and anyone who wants reliable
            delivery across the Oshodi–Ikeja corridor.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-border-muted bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-brand/10">
                <Image src={service.icon} alt="" width={28} height={28} aria-hidden />
              </div>
              <h2 className="mt-5 text-xl font-normal text-content-neutral-primary">
                {service.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-content-neutral-secondary sm:text-base">
                {service.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-border-muted bg-surface-subtle px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-normal text-content-neutral-primary sm:text-3xl">
            Want to sell or deliver with Asapu?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-content-neutral-secondary">
            Join as a vendor or rider and grow with a platform designed for local commerce.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/vendor"
              className="inline-flex h-11 items-center rounded-full bg-surface-brand px-6 text-sm font-medium text-white transition hover:bg-surface-brand/90"
            >
              Become a vendor
            </Link>
            <Link
              href="/rider"
              className="inline-flex h-11 items-center rounded-full border border-border-muted bg-white px-6 text-sm text-content-neutral-primary transition hover:bg-surface-muted"
            >
              Join as a rider
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
