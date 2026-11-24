"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { clamp } from "@/lib/math";
import { useAppStore } from "@/store/useAppStore";
import { useIsTouch } from "@/hooks/useIsTouch";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Cursor() {
  const isTouch = useIsTouch();
  const reducedMotion = useReducedMotion();

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const labelEl = labelRef.current;
    const tipEl = tipRef.current;

    let lastX = window.innerWidth * 0.5;
    let lastY = window.innerHeight * 0.5;
    let lastT = performance.now();
    let visible = false;

    const ringX = !isTouch && ring
      ? gsap.quickTo(ring, "x", {
          duration: reducedMotion ? 0 : 0.45,
          ease: "power3.out",
        })
      : null;
    const ringY = !isTouch && ring
      ? gsap.quickTo(ring, "y", {
          duration: reducedMotion ? 0 : 0.45,
          ease: "power3.out",
        })
      : null;
    const dotX = !isTouch && dot
      ? gsap.quickTo(dot, "x", {
          duration: reducedMotion ? 0 : 0.12,
          ease: "power3.out",
        })
      : null;
    const dotY = !isTouch && dot
      ? gsap.quickTo(dot, "y", {
          duration: reducedMotion ? 0 : 0.12,
          ease: "power3.out",
        })
      : null;
    const tipX = !isTouch && tipEl
      ? gsap.quickTo(tipEl, "x", {
          duration: reducedMotion ? 0 : 0.35,
          ease: "power3.out",
        })
      : null;
    const tipY = !isTouch && tipEl
      ? gsap.quickTo(tipEl, "y", {
          duration: reducedMotion ? 0 : 0.35,
          ease: "power3.out",
        })
      : null;

    const updateCursorTarget = (target: EventTarget | null) => {
      if (isTouch || !ring || !dot || !labelEl || !tipEl) return;
      const el = target instanceof Element ? target : null;

      if (el?.closest("input, textarea, select, [contenteditable='true']")) {
        gsap.to([ring, dot], { opacity: 0, duration: 0.18, overwrite: "auto" });
        tipEl.style.opacity = "0";
        return;
      }

      const cursorNode = el?.closest<HTMLElement>("[data-cursor]");
      const tipNode = el?.closest<HTMLElement>("[data-cursor-tip]");
      const interactiveNode = el?.closest<HTMLElement>("a, button, [role='button']");

      const cursorType = cursorNode?.getAttribute("data-cursor") ?? "";
      const tipText = tipNode?.getAttribute("data-cursor-tip") ?? "";

      if (cursorType) {
        labelEl.textContent = cursorType.toUpperCase();
        labelEl.style.opacity = "1";
        gsap.to(ring, {
          scale: 84 / 36,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.28,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(dot, { opacity: 0, duration: 0.18, overwrite: "auto" });
      } else if (interactiveNode) {
        labelEl.textContent = "";
        labelEl.style.opacity = "0";
        gsap.to(ring, {
          scale: 56 / 36,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.25,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(dot, { opacity: 1, duration: 0.18, overwrite: "auto" });
      } else {
        labelEl.textContent = "";
        labelEl.style.opacity = "0";
        gsap.to(ring, {
          scale: 1,
          opacity: 1,
          duration: reducedMotion ? 0 : 0.25,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(dot, { opacity: 1, duration: 0.18, overwrite: "auto" });
      }

      if (tipText) {
        tipEl.textContent = tipText;
        tipEl.style.opacity = "1";
      } else {
        tipEl.style.opacity = "0";
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      const now = performance.now();
      const dt = Math.max(8, now - lastT) / 1000;

      const ndcX = clamp((e.clientX / w) * 2 - 1, -1, 1);
      const ndcY = clamp(-((e.clientY / h) * 2 - 1), -1, 1);
      const vx = clamp((e.clientX - lastX) / (w * dt), -8, 8);
      const vy = clamp((e.clientY - lastY) / (h * dt), -8, 8);

      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      useAppStore.getState().set({
        pointer: { x: ndcX, y: ndcY, vx, vy },
      });

      if (isTouch || e.pointerType === "touch") return;

      if (!visible && wrap) {
        visible = true;
        wrap.style.opacity = "1";
      }

      ringX?.(e.clientX);
      ringY?.(e.clientY);
      dotX?.(e.clientX);
      dotY?.(e.clientY);
      tipX?.(e.clientX);
      tipY?.(e.clientY);

      updateCursorTarget(e.target);
    };

    const onPointerLeave = () => {
      if (wrap) {
        visible = false;
        wrap.style.opacity = "0";
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [isTouch, reducedMotion]);

  if (isTouch) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-60 opacity-0 mix-blend-difference transition-opacity duration-200"
    >
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -mt-[18px] -ml-[18px] flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#FAFAFA] will-change-transform"
      >
        <span
          ref={labelRef}
          className="font-mono text-[6px] font-medium uppercase tracking-[0.14em] text-[#FAFAFA] opacity-0 transition-opacity duration-150"
        />
      </div>

      <div
        ref={dotRef}
        className="fixed top-0 left-0 -mt-[2px] -ml-[2px] h-[4px] w-[4px] rounded-full bg-[#FAFAFA] will-change-transform"
      />

      <span
        ref={tipRef}
        className="fixed top-0 left-0 ml-[34px] -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-[#FAFAFA] opacity-0 transition-opacity duration-150 will-change-transform"
      />
    </div>
  );
}
