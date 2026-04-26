"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RiderAuthBg from "./rider-auth-bg";
import RiderStepBasic, { type RiderBasicData } from "./rider-step-basic";
import RiderStepProfile, { type RiderProfileData } from "./rider-step-profile";
import RiderStepSuccess from "./rider-step-success";
import { registerRider } from "@/services/rider/rider.api";
import { getApiErrorMessage } from "@/lib/toast-api";

type Step = 1 | 2 | 3;

const RiderSignup = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [basicData, setBasicData] = useState<RiderBasicData | null>(null);

  const registerMutation = useMutation({
    mutationFn: (profile: RiderProfileData) => {
      if (!basicData) throw new Error("Missing basic data");
      return registerRider({
        ...basicData,
        vehicleType: profile.vehicleType,
        license: profile.license!,
        photo: profile.photo!,
        bankAccount: {
          accountNumber: profile.accountNumber,
          bankName: profile.bankName,
          bankCode: profile.bankCode || "000",
          accountHolderName: profile.accountHolderName,
        },
      });
    },
    onSuccess: () => {
      setStep(3);
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err));
    },
  });

  const handleBasicNext = (data: RiderBasicData) => {
    setBasicData(data);
    setStep(2);
  };

  const handleProfileNext = (data: RiderProfileData) => {
    registerMutation.mutate(data);
  };

  return (
    <RiderAuthBg>
      {step === 1 && (
        <RiderStepBasic defaultValues={basicData ?? {}} onNext={handleBasicNext} />
      )}
      {step === 2 && (
        <RiderStepProfile
          onNext={handleProfileNext}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <RiderStepSuccess onContinue={() => router.push("/rider/dashboard")} />
      )}
    </RiderAuthBg>
  );
};

export default RiderSignup;
