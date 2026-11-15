"use client";

import { useEffect, useRef } from "react";

export interface MouseLightState {
  nx: number; // -1 to 1 normalized device coords
  ny: number; // -1 to 1 normalized device coords
  px: number; // viewport px
  py: number; // viewport px
  isTouch: boolean;
}

// Mouse-following point light and volumetric glow (with smooth idle drift on touch devices)
export function useMouseLight() {
  const stateRef = useRef<MouseLightState>({
    nx: 0,
    ny: 0,
    px: 600,
    py: 400,
    isTouch: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    stateRef.current.isTouch = isTouch;
    stateRef.current.px = window.innerWidth * 0.5;
    stateRef.current.py = window.innerHeight * 0.4;

    let animId = 0;

    // On touch devices, run a gentle periodic orbital drift so lighting stays dynamic
    if (isTouch) {
      const startTime = performance.now();
      const driftLoop = (now: number) => {
        const t = (now - startTime) * 0.0006;
        stateRef.current.nx = Math.sin(t) * 0.4;
        stateRef.current.ny = Math.cos(t * 0.75) * 0.3;
        stateRef.current.px = window.innerWidth * (0.5 + stateRef.current.nx * 0.3);
        stateRef.current.py = window.innerHeight * (0.4 - stateRef.current.ny * 0.3);
        document.documentElement.style.setProperty("--mx", `${stateRef.current.px}px`);
        document.documentElement.style.setProperty("--my", `${stateRef.current.py}px`);
        animId = requestAnimationFrame(driftLoop);
      };
      animId = requestAnimationFrame(driftLoop);
    }

    const onPointerMove = (e: PointerEvent) => {
      // Cancel idle drift if active pointer events arrive
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }

      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      stateRef.current.nx = (e.clientX / w) * 2 - 1;
      stateRef.current.ny = -(e.clientY / h) * 2 + 1;
      stateRef.current.px = e.clientX;
      stateRef.current.py = e.clientY;
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return stateRef;
}
