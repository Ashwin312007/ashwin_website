"use client";

import { useEffect, useRef } from "react";
import { Observer } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { useSmoothScroll } from "@/providers/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { audioEngine } from "@/audio/AudioEngine";

interface TourStop {
  target: string;
  duration: number;
  dwell: number;
}

const TOUR_STOPS: TourStop[] = [
  { target: "#top", duration: 1.4, dwell: 1600 },
  { target: "#dive", duration: 3.4, dwell: 2400 },
  { target: "#approach", duration: 3.0, dwell: 2600 },
  { target: "#capabilities", duration: 3.0, dwell: 2600 },
  { target: "#work", duration: 3.2, dwell: 2600 },
  { target: "#experience", duration: 3.6, dwell: 2800 },
  { target: "#research", duration: 2.8, dwell: 2400 },
  { target: "#about", duration: 3.0, dwell: 2500 },
  { target: "#contact", duration: 2.8, dwell: 2200 },
];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function TourController() {
  const tourActive = useAppStore((s) => s.tour.active);
  const { scrollTo } = useSmoothScroll();
  const reducedMotion = useReducedMotion();
  const stopBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!tourActive) return;

    let aborted = false;
    let dwellTimer: number | null = null;

    const abortTour = () => {
      if (aborted) return;
      aborted = true;
      if (dwellTimer !== null) window.clearTimeout(dwellTimer);
      useAppStore.getState().set({ tour: { active: false, step: 0 } });
    };

    const observer = Observer.create({
      type: "wheel,touch,pointer",
      onDown: (self) => {
        const target = self.event?.target as Node | null;
        if (stopBtnRef.current && target && stopBtnRef.current.contains(target)) {
          return;
        }
        abortTour();
      },
      onWheel: abortTour,
      onDragStart: abortTour,
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t" || e.key === "Escape") return;
      abortTour();
    };
    window.addEventListener("keydown", onKeyDown);

    const runStep = (index: number) => {
      if (aborted || index >= TOUR_STOPS.length) {
        abortTour();
        return;
      }

      useAppStore.getState().set({ tour: { active: true, step: index } });
      const stop = TOUR_STOPS[index];
      const el = document.querySelector<HTMLElement>(stop.target);

      if (!el) {
        runStep(index + 1);
        return;
      }

      scrollTo(el, {
        duration: reducedMotion ? 0 : stop.duration,
        easing: easeInOutCubic,
        onComplete: () => {
          if (aborted) return;
          dwellTimer = window.setTimeout(() => {
            runStep(index + 1);
          }, reducedMotion ? 800 : stop.dwell);
        },
      });

      // Fallback advance if native scroll / reducedMotion skips Lenis onComplete
      if (reducedMotion) {
        dwellTimer = window.setTimeout(() => {
          runStep(index + 1);
        }, 1100);
      }
    };

    runStep(0);

    return () => {
      aborted = true;
      if (dwellTimer !== null) window.clearTimeout(dwellTimer);
      observer.kill();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [tourActive, scrollTo, reducedMotion]);

  if (!tourActive) return null;

  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <button
        ref={stopBtnRef}
        type="button"
        onClick={() => {
          audioEngine.playTick();
          useAppStore.getState().set({ tour: { active: false, step: 0 } });
        }}
        className="flex items-center gap-2 border border-white/30 bg-[#0A0A0A]/85 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#FAFAFA] backdrop-blur-md transition-colors hover:border-[#FAFAFA]"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FAFAFA]" />
        STOP TOUR
      </button>
    </div>
  );
}
