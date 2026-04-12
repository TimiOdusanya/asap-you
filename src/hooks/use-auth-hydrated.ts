"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const p = useAuthStore.persist;
    if (!p) {
      setHydrated(true);
      return;
    }
    if (p.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = p.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  return hydrated;
}
