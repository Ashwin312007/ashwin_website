"use client";

import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Lenis with autoRaf off, driven by gsap.ticker, lenis.on('scroll', ScrollTrigger.update),
// lag smoothing 0, refresh after fonts load.
// Respects motion preference: if motion is disabled, disables smooth scrolling and falls back to native scroll.
export function useLenisGSAP(hasEntered: boolean = true, motionEnabled: boolean = true) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!hasEntered || !motionEnabled) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [hasEntered, motionEnabled]);

  const scrollTo = useCallback(
    (target: string | HTMLElement) => {
      if (motionEnabled && lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -56 });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) {
          const rect = el.getBoundingClientRect();
          const targetY = window.pageYOffset + rect.top - 56;
          window.scrollTo({
            top: targetY,
            behavior: motionEnabled ? "smooth" : "auto",
          });
        }
      } else if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        const targetY = window.pageYOffset + rect.top - 56;
        window.scrollTo({
          top: targetY,
          behavior: motionEnabled ? "smooth" : "auto",
        });
      }
    },
    [motionEnabled]
  );

  const setPaused = useCallback((paused: boolean) => {
    if (!lenisRef.current) return;
    if (paused) lenisRef.current.stop();
    else lenisRef.current.start();
  }, []);

  return { lenisRef, scrollTo, setPaused };
}
