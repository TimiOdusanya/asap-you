import React from "react";
import Navbar from "@/components/landing-page/navbar";
import RiderHero from "@/components/landing-page/rider/rider-hero";
import RiderFeatures from "@/components/landing-page/rider/rider-features";
import RiderHowItWorks from "@/components/landing-page/rider/rider-how-it-works";
import RiderCoreValues from "@/components/landing-page/rider/rider-core-values";
import FaqSection from "@/components/landing-page/shopping-section/faq-section";
import Footer from "@/components/landing-page/footer";

const riderFaqs = [
  {
    question: "How do I register as a rider?",
    answer:
      "Click 'Become a Rider', fill in your personal and vehicle details, upload required documents, and complete a quick onboarding. You can start accepting deliveries as soon as your account is verified.",
  },
  {
    question: "What documents do I need?",
    answer:
      "You'll need a valid government-issued ID, a driver's license, and proof of vehicle ownership or registration. Additional documents may be required depending on your location.",
  },
  {
    question: "How do I get paid?",
    answer:
      "Earnings are calculated per completed delivery and paid out weekly directly to your registered bank account. You can track every payment in real time through the app.",
  },
  {
    question: "Can I choose my hours?",
    answer:
      "Absolutely. You set your own availability — work whenever it fits your schedule. There are no minimum hour requirements, so you stay in full control of how much you earn.",
  },
];

const RiderPage = () => {
  return (
    <div className="bg-surface-canvas">
      <Navbar current="rider" />
      <RiderHero />
      <RiderFeatures />
      <RiderHowItWorks />
      <RiderCoreValues />
      <FaqSection
        faqs={riderFaqs}
        heading={
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-normal mb-8 sm:mb-12">
            <span className="text-content-neutral-soft">Still</span>{" "}
            <span className="text-content-neutral-secondary">Curious?</span>
          </h2>
        }
      />
      <Footer />
    </div>
  );
};

export default RiderPage;
