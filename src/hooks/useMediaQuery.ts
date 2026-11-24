"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return () => {};
      }
      const mq = window.matchMedia(query);
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", callback);
        return () => mq.removeEventListener("change", callback);
      }
      // Legacy Safari fallback via typed MediaQueryList extension
      const legacy = mq as MediaQueryList & {
        addListener?: (cb: () => void) => void;
        removeListener?: (cb: () => void) => void;
      };
      legacy.addListener?.(callback);
      return () => legacy.removeListener?.(callback);
    },
    [query]
  );

  const getSnapshot = useCallback((): boolean => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback((): boolean => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
