import axios from "axios";
import { toast } from "sonner";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function messageFromPayload(data: Record<string, unknown>): string | null {
  const msg = data.message;
  return typeof msg === "string" ? msg : null;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (isRecord(data)) {
      const m = messageFromPayload(data);
      if (m) return m;
    }
    if (typeof error.message === "string" && error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export function toastApiError(error: unknown): void {
  toast.error(getApiErrorMessage(error));
}

export function toastApiSuccessMessage(message: string): void {
  toast.success(message);
}
