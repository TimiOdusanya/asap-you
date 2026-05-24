export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://asapu-backend.onrender.com";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
