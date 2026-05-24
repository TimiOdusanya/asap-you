/** Fallbacks aligned with backend Settings model defaults. */
export const DEFAULT_DELIVERY_FEE = 1000;
export const DEFAULT_SERVICE_CHARGE_RATE = 0.015;

export interface StoreCheckoutFees {
  deliveryFee: number;
  serviceChargeRate: number;
}

export interface StoreOrderTotals {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}

export function computeStoreOrderTotals(
  subtotal: number,
  fees?: Partial<StoreCheckoutFees>
): StoreOrderTotals {
  const deliveryFee = fees?.deliveryFee ?? DEFAULT_DELIVERY_FEE;
  const serviceChargeRate = fees?.serviceChargeRate ?? DEFAULT_SERVICE_CHARGE_RATE;
  const serviceFee = Math.round(subtotal * serviceChargeRate);

  return {
    subtotal,
    deliveryFee,
    serviceFee,
    total: subtotal + deliveryFee + serviceFee,
  };
}
