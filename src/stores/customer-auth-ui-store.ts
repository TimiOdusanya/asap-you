import { create } from "zustand";

export type CustomerAuthView = "signIn" | "signUp" | "verifyOtp" | "location";

interface CustomerAuthUiState {
  open: boolean;
  view: CustomerAuthView;
  verifyOtpEmail: string | null;
  openSignIn: () => void;
  openSignUp: () => void;
  openVerifyOtp: (email: string) => void;
  openLocation: () => void;
  close: () => void;
}

export const useCustomerAuthUiStore = create<CustomerAuthUiState>((set) => ({
  open: false,
  view: "signIn",
  verifyOtpEmail: null,
  openSignIn: () => set({ open: true, view: "signIn" }),
  openSignUp: () => set({ open: true, view: "signUp" }),
  openVerifyOtp: (email: string) =>
    set({ open: true, view: "verifyOtp", verifyOtpEmail: email }),
  openLocation: () => set({ open: true, view: "location" }),
  close: () => set({ open: false, verifyOtpEmail: null }),
}));
