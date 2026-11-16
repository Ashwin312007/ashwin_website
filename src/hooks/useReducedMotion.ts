"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.addEventListener) {
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
  } else if ("addListener" in mq) {
    // Safari < 14 backward compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mq as any).addListener(callback);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => (mq as any).removeListener(callback);
  }
  return () => {};
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
