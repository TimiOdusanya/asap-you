import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/services/auth/auth.types";
import { tokenStorage } from "@/lib/token-storage";
import { disconnectSocket } from "@/hooks/use-socket";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => {
        tokenStorage.set(token);
        set({ token, user });
      },
      clearSession: () => {
        disconnectSocket();
        tokenStorage.remove();
        set({ token: null, user: null });
      },
    }),
    {
      name: "asapu-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) tokenStorage.set(state.token);
        else tokenStorage.remove();
      },
    }
  )
);
