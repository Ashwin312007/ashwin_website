"use client";

import { useAppStore } from "@/store/useAppStore";

export function useScrollVelocity(): number {
  return useAppStore((s) => s.scroll.velocity);
}
