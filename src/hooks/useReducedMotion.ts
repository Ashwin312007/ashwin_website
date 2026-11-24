"use client";

import { useMediaQuery } from "./useMediaQuery";
import { useAppStore } from "@/store/useAppStore";

export function useOSReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useReducedMotion(): boolean {
  const osReduced = useOSReducedMotion();
  const storeReduced = useAppStore((s) => s.reducedMotion);
  return osReduced || storeReduced;
}
