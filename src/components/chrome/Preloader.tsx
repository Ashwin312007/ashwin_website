"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Emblem } from "@/components/ui/Emblem";
import { Odometer } from "@/components/ui/Odometer";

export function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [displayPct, setDisplayPct] = useState(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const emblemWrapRef = useRef<HTMLDivElement | null>(null);
  const whiteEmblemRef = useRef<HTMLDivElement | null>(null);
  const counterWrapRef = useRef<HTMLDivElement | null>(null);

  const reducedMotion = useReducedMotion();
  const webgl = useAppStore((s) => s.webgl);
  const webglReady = useAppStore((s) => s.webglReady);
  const webglProgress = useAppStore((s) => s.webglProgress);

  const stateRef = useRef({
    fontsDone: false,
    minTimerDone: false,
    forceDone: false,
    exiting: false,
    lastTarget: -1,
    proxy: { v: 0 },
  });

  // Track fonts readiness, 1.4s minimum dwell timer, and 3.2s safety timeout
  useEffect(() => {
    let cancelled = false;

    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) stateRef.current.fontsDone = true;
      });
    } else {
      stateRef.current.fontsDone = true;
    }

    const minTimer = window.setTimeout(() => {
      stateRef.current.minTimerDone = true;
    }, reducedMotion ? 150 : 1400);

    const safetyTimer = window.setTimeout(() => {
      stateRef.current.forceDone = true;
    }, reducedMotion ? 300 : 3200);

    return () => {
      cancelled = true;
      window.clearTimeout(minTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [reducedMotion]);

  // Weighted progress loop + exit timeline
  useEffect(() => {
    if (!mounted) return;
    let rafId = 0;

    const triggerExit = () => {
      const st = stateRef.current;
      if (st.exiting) return;
      st.exiting = true;

      const root = rootRef.current;
      if (!root) {
        useAppStore.getState().set({ loaded: true });
        setMounted(false);
        return;
      }

      if (reducedMotion) {
        gsap.to(root, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            useAppStore.getState().set({ loaded: true });
            setMounted(false);
          },
        });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          useAppStore.getState().set({ loaded: true });
          setMounted(false);
        },
      });

      if (counterWrapRef.current) {
        tl.to(
          counterWrapRef.current,
          {
            y: -24,
            opacity: 0,
            duration: 0.45,
            ease: "power3.in",
          },
          0
        );
      }

      if (emblemWrapRef.current) {
        tl.to(
          emblemWrapRef.current,
          {
            scale: 0.6,
            opacity: 0,
            duration: 0.55,
            ease: "power3.inOut",
          },
          0.15
        );
      }

      tl.to(
        root,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.85,
          ease: "expo.inOut",
        },
        0.55
      );
    };

    const update = () => {
      const st = stateRef.current;
      const store = useAppStore.getState();

      const fontPart = st.fontsDone ? 15 : 0;
      const assetPart = !store.webgl ? 35 : store.webglProgress * 35;
      const compilePart = !store.webgl || store.webglReady ? 35 : 0;
      const timerPart = st.minTimerDone ? 15 : 0;

      const target = st.forceDone
        ? 100
        : Math.min(100, fontPart + assetPart + compilePart + timerPart);

      if (target !== st.lastTarget) {
        st.lastTarget = target;
        gsap.to(st.proxy, {
          v: target,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
          onUpdate: () => {
            const val = st.proxy.v;
            if (whiteEmblemRef.current) {
              whiteEmblemRef.current.style.clipPath = `inset(${Math.max(
                0,
                100 - val
              )}% 0 0 0)`;
            }
            const rounded = Math.round(val);
            setDisplayPct((prev) => (prev !== rounded ? rounded : prev));
          },
        });
      }

      if ((target >= 99.5 && st.proxy.v >= 99) || st.forceDone) {
        gsap.killTweensOf(st.proxy);
        if (whiteEmblemRef.current) {
          whiteEmblemRef.current.style.clipPath = "inset(0% 0 0 0)";
        }
        setDisplayPct(100);
        triggerExit();
        return;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [mounted, reducedMotion, webgl, webglReady, webglProgress]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading portfolio experience"
      className="fixed inset-0 z-70 flex flex-col items-center justify-center bg-[#0A0A0A] text-[#FAFAFA]"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <div
        ref={emblemWrapRef}
        className="relative flex h-16 w-16 items-center justify-center"
      >
        <Emblem size={64} color="#3A3A3A" />
        <div
          ref={whiteEmblemRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ clipPath: "inset(100% 0 0 0)" }}
        >
          <Emblem size={64} color="#FAFAFA" />
        </div>
      </div>

      <div
        ref={counterWrapRef}
        className="absolute bottom-10 flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#BDBDBD]"
      >
        <Odometer
          value={displayPct}
          pad={3}
          duration={0.25}
          className="text-sm font-medium text-[#FAFAFA]"
        />
        <span>LOADING</span>
      </div>
    </div>
  );
}
