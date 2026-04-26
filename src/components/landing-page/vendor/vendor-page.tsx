import React from "react";
import Navbar from "@/components/landing-page/navbar";
import VendorHero from "@/components/landing-page/vendor/vendor-hero";
import VendorFeatures from "@/components/landing-page/vendor/vendor-features";
import VendorHowItWorks from "@/components/landing-page/vendor/vendor-how-it-works";
import VendorReach from "@/components/landing-page/vendor/vendor-reach";
import FaqSection from "@/components/landing-page/shopping-section/faq-section";
import Footer from "@/components/landing-page/footer";

const vendorFaqs = [
  {
    question: "How do I register my supermarket on the platform?",
    answer:
      "Signing up is simple. Click 'Become a Vendor', fill in your store details, upload your products, and you're ready to start selling. The entire process takes less than 10 minutes.",
  },
  {
    question: "What are the charges or commissions?",
    answer:
      "We operate on a transparent commission model with no hidden fees. A small percentage is deducted per completed order. You'll see the exact breakdown in your vendor dashboard before going live.",
  },
  {
    question: "How do I receive payments for my sales?",
    answer:
      "Payments are processed automatically and sent directly to your registered bank account on a set schedule — typically within 24–48 hours after delivery is confirmed.",
  },
  {
    question: "Can I manage my inventory on the platform?",
    answer:
      "Yes. Your vendor dashboard gives you full control — add, edit, or remove products anytime, set stock levels, and get notified when items are running low.",
  },
];

const VendorPage = () => {
  return (
    <div className="bg-surface-canvas">
      <Navbar current="vendor" />
      <VendorHero />
      <VendorFeatures />
      <div id="how-it-works">
        <VendorHowItWorks />
      </div>
      <VendorReach />
      <FaqSection
        faqs={vendorFaqs}
        heading={
          <h2 className="text-center text-3xl sm:text-4xl font-normal mb-12">
            <span className="text-content-neutral-soft">Still</span>{" "}
            <span className="text-content-neutral-secondary">Curious?</span>
          </h2>
        }
      />
      <Footer />
    </div>
  );
};

export default VendorPage;
