"use client";

import { useEffect, useRef } from "react";
import {
  buildTriangleLattice,
  traceScaledTriangle,
  type LatticeTriangle,
} from "@/lib/triangleLattice";
import { clamp, smoothstep } from "@/lib/math";
import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Curtain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const latticeRef = useRef<LatticeTriangle[]>([]);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({
    w: 0,
    h: 0,
    dpr: 1,
  });

  const phase = useAppStore((s) => s.transition.phase);
  const origin = useAppStore((s) => s.transition.origin);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rebuild = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cell = w < 640 ? 34 : 46;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      sizeRef.current = { w, h, dpr };
      latticeRef.current = buildTriangleLattice(w, h, cell);
    };

    rebuild();
    window.addEventListener("resize", rebuild);
    return () => window.removeEventListener("resize", rebuild);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (phase === "idle") {
      const { w, h, dpr } = sizeRef.current;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.restore();
      return;
    }

    const duration = phase === "out" ? 650 : 750;
    const start = performance.now();
    let rafId = 0;

    const drawFrame = (now: number) => {
      const raw = clamp((now - start) / duration, 0, 1);
      const progress = phase === "out" ? raw : 1 - raw;

      const { w, h, dpr } = sizeRef.current;
      const tris = latticeRef.current;
      const ox = origin[0] * w;
      const oy = origin[1] * h;
      const maxD = Math.max(
        Math.hypot(ox, oy),
        Math.hypot(w - ox, oy),
        Math.hypot(ox, h - oy),
        Math.hypot(w - ox, h - oy)
      );

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (progress > 0.001) {
        ctx.beginPath();
        for (let i = 0; i < tris.length; i++) {
          const tri = tris[i];
          const dist = Math.hypot(tri.cx - ox, tri.cy - oy);
          const delay = (dist / Math.max(1, maxD)) * 0.52 + tri.seed * 0.16;
          const local = clamp((progress - delay) / 0.32, 0, 1);
          if (local > 0.001) {
            traceScaledTriangle(ctx, tri, smoothstep(local));
          }
        }
        ctx.fillStyle = "#0A0A0A";
        ctx.fill();
      }
      ctx.restore();

      if (raw < 1) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    rafId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafId);
  }, [phase, origin, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-50 bg-[#0A0A0A] transition-opacity duration-200 ${
          phase === "out" ? "opacity-100" : "opacity-0"
        }`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 z-50 h-full w-full ${
        phase === "idle" ? "pointer-events-none" : "pointer-events-auto"
      }`}
    />
  );
}
