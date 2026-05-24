"use client";

import React from "react";
import { RiderDeliveryDetail } from "./rider-delivery-detail";

const RiderActiveDeliveries = () => {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-6 text-xl font-semibold text-content-neutral-primary sm:text-2xl">
        Active Delivery
      </h1>
      <RiderDeliveryDetail />
    </div>
  );
};

export default RiderActiveDeliveries;
