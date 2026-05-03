import type { UserRole } from "@/services/auth/auth.types";

export function postLoginPathForRole(role: UserRole): string {
  switch (role) {
    case "vendor":
      return "/vendor/dashboard";
    case "rider":
      return "/rider/dashboard";
    case "customer":
      return "/store";
    case "admin":
      return "/admin/dashboard";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}
