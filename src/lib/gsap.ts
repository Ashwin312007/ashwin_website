"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { CustomEase } from "gsap/CustomEase";

let registered = false;

export const EASE_NAMES = {
  cinematicOut: "ashwin.cinematicOut",
  cinematicInOut: "ashwin.cinematicInOut",
  mechanicalSnap: "ashwin.mechanicalSnap",
} as const;

export function ensureGsapRegistered(): void {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    Observer,
    Flip,
    ScrollToPlugin,
    CustomEase
  );

  CustomEase.create(EASE_NAMES.cinematicOut, "M0,0 C0.16,1 0.3,1 1,1");
  CustomEase.create(EASE_NAMES.cinematicInOut, "M0,0 C0.76,0 0.24,1 1,1");
  CustomEase.create(EASE_NAMES.mechanicalSnap, "M0,0 C0.22,1 0.36,1 1,1");

  registered = true;
}

ensureGsapRegistered();

export {
  gsap,
  ScrollTrigger,
  SplitText,
  Observer,
  Flip,
  ScrollToPlugin,
  CustomEase,
};
