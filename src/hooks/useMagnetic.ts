"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";
import { useIsTouch } from "./useIsTouch";

export interface UseMagneticOptions {
  strength?: number;
  duration?: number;
  disabled?: boolean;
}

export function useMagnetic<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseMagneticOptions = {}
): void {
  const { strength = 0.28, duration = 0.45, disabled = false } = options;
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || reducedMotion || isTouch) {
      if (el) {
        gsap.set(el, { x: 0, y: 0 });
      }
      return;
    }

    const xTo = gsap.quickTo(el, "x", { duration, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration, ease: "power3.out" });

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dx = e.clientX - (rect.left + rect.width * 0.5);
      const dy = e.clientY - (rect.top + rect.height * 0.5);
      xTo(dx * strength);
      yTo(dy * strength);
    };

    const onPointerLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength, duration, disabled, reducedMotion, isTouch]);
}
