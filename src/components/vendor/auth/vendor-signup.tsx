"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { registerVendor } from "@/services/vendor/vendor.api";
import { getApiErrorMessage, toastApiSuccessMessage } from "@/lib/toast-api";
import VendorAuthBg from "./vendor-auth-bg";
import VendorStepBasic, { type BasicDetailsData } from "./vendor-step-basic";
import VendorStepBusiness, { type BusinessInfoData } from "./vendor-step-business";
import VendorStepVerification, { type VerificationData } from "./vendor-step-verification";
import VendorStepCommission from "./vendor-step-commission";
import VendorStepWelcome from "./vendor-step-welcome";
import VendorStepGetReady from "./vendor-step-get-ready";

type Step = "basic" | "business" | "verification" | "commission" | "welcome" | "get-ready";

const DEFAULT_HOURS = [0, 1, 2, 3].map((day) => ({
  day,
  open: "08:00",
  close: "20:00",
  isClosed: false,
})).concat([4, 5].map((day) => ({ day, open: "08:00", close: "22:00", isClosed: false }))).concat([
  { day: 6, open: "10:00", close: "18:00", isClosed: false },
]);

const VendorSignup = () => {
  const [step, setStep] = useState<Step>("basic");
  const [basic, setBasic] = useState<BasicDetailsData | null>(null);
  const [business, setBusiness] = useState<BusinessInfoData | null>(null);
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const setSession = useAuthStore((s) => s.setSession);

  const registerMutation = useMutation({
    mutationFn: () => {
      if (!basic || !business || !verification?.logo) throw new Error("Missing data");
      return registerVendor({
        email: basic.email,
        password: basic.password,
        phone: business.phone,
        firstName: basic.firstName,
        lastName: basic.lastName,
        businessName: business.businessName,
        category: business.category,
        businessSize: verification.businessSize,
        isBusinessRegistered: business.isBusinessRegistered,
        logo: verification.logo,
        businessRegistrationCertificate: verification.registrationCertificate ?? undefined,
        bankAccount: {
          accountNumber: verification.accountNumber,
          bankName: verification.bankName,
          accountHolderName: verification.accountHolderName,
        },
        businessInfo: {
          legalName: business.legalName || business.businessName,
          contactEmail: business.contactEmail,
          contactPhone: business.phone,
          taxId: "",
        },
        address: {
          addressLine1: business.addressLine1,
          city: business.city,
          state: business.state || business.city,
          country: business.country,
          postalCode: business.postalCode || "000000",
        },
        operatingHours: DEFAULT_HOURS,
      });
    },
    onSuccess: (res) => {
      toastApiSuccessMessage(res.message);
      setStep("welcome");
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const card = "bg-white rounded-2xl p-6 sm:p-8 w-full shadow-lg";

  return (
    <VendorAuthBg>
      <div className={card}>
        {step === "basic" && (
          <VendorStepBasic
            defaultValues={basic ?? undefined}
            onNext={(data) => { setBasic(data); setStep("business"); }}
          />
        )}
        {step === "business" && (
          <VendorStepBusiness
            defaultValues={business ?? undefined}
            onNext={(data) => { setBusiness(data); setStep("verification"); }}
            onBack={() => setStep("basic")}
          />
        )}
        {step === "verification" && (
          <VendorStepVerification
            onNext={(data) => { setVerification(data); setStep("commission"); }}
            onBack={() => setStep("business")}
          />
        )}
        {step === "commission" && (
          <VendorStepCommission
            isPending={registerMutation.isPending}
            onSubmit={() => registerMutation.mutate()}
            onBack={() => setStep("verification")}
          />
        )}
        {step === "welcome" && basic && (
          <VendorStepWelcome
            firstName={basic.firstName}
            onNext={() => setStep("get-ready")}
          />
        )}
        {step === "get-ready" && <VendorStepGetReady />}
      </div>
    </VendorAuthBg>
  );
};

export default VendorSignup;
