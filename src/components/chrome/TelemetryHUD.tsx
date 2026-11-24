"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export function TelemetryHUD() {
  const loaded = useAppStore((s) => s.loaded);
  const hudVisible = useAppStore((s) => s.hudVisible);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!loaded || !hudVisible) return;

    let frames = 0;
    let fps = 60;
    let lastFpsSample = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      frames++;
      if (now - lastFpsSample >= 400) {
        fps = Math.round((frames * 1000) / (now - lastFpsSample));
        frames = 0;
        lastFpsSample = now;
      }

      const state = useAppStore.getState();
      const vel = Math.abs(state.scroll.velocity).toFixed(2);
      const sec = String(state.section.index).padStart(2, "0");
      const y = Math.round(state.scroll.y).toLocaleString("en-US");

      if (textRef.current) {
        textRef.current.textContent = `VEL ${vel} · FPS ${fps} · SEC ${sec}/07 · Y ${y}`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [loaded, hudVisible]);

  if (!loaded || !hudVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-16 left-10 z-40 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--surface-muted)] lg:flex"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      <span ref={textRef} className="tabular-nums">
        VEL 0.00 · FPS 60 · SEC 00/07 · Y 0
      </span>
    </div>
  );
}
