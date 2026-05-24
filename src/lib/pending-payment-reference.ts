const PENDING_PAYMENT_REF_KEY = "asapu_pending_payment_reference";

export function savePendingPaymentReference(reference: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_PAYMENT_REF_KEY, reference);
}

export function readPendingPaymentReference(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PENDING_PAYMENT_REF_KEY);
}

export function clearPendingPaymentReference() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_PAYMENT_REF_KEY);
}
