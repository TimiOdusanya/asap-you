const TOKEN_KEY = "asapu_access_token";

export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    window.localStorage.setItem(TOKEN_KEY, token);
  },
  remove(): void {
    window.localStorage.removeItem(TOKEN_KEY);
  },
};
