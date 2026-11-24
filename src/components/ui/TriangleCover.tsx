"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  buildTriangleLattice,
  traceScaledTriangle,
  type LatticeTriangle,
} from "@/lib/triangleLattice";
import { clamp, smoothstep } from "@/lib/math";
import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface TriangleCoverProps {
  variant?: "hover" | "reveal";
  cellSize?: number;
  fillColor?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  children?: ReactNode;
  invertChildren?: boolean;
}

export function TriangleCover({
  variant = "hover",
  cellSize,
  fillColor,
  imageSrc,
  imageAlt = "",
  className = "",
  children,
  invertChildren = true,
}: TriangleCoverProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const latticeRef = useRef<LatticeTriangle[]>([]);
  const sizeRef = useRef<{ w: number; h: number; dpr: number }>({
    w: 0,
    h: 0,
    dpr: 1,
  });

  const reducedMotion = useReducedMotion();
  const surface = useAppStore((s) => s.surface);

  const resolvedCell = cellSize ?? (variant === "reveal" ? 22 : 9);
  const resolvedFill =
    fillColor ?? (surface === "light" ? "#0A0A0A" : "#FAFAFA");

  // Hover mode animation state
  const stateRef = useRef<{
    dir: 1 | -1 | 0;
    originX: number;
    originY: number;
    maxDist: number;
    startTime: number;
    currentProgress: number;
    rafId: number;
    revealed: boolean;
  }>({
    dir: 0,
    originX: 0,
    originY: 0,
    maxDist: 1,
    startTime: 0,
    currentProgress: 0,
    rafId: 0,
    revealed: false,
  });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef<boolean>(false);

  // Build / rebuild lattice on resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rebuild = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      sizeRef.current = { w, h, dpr };
      latticeRef.current = buildTriangleLattice(w, h, resolvedCell);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (variant === "reveal" && imgLoadedRef.current && imgRef.current && stateRef.current.revealed) {
        drawRevealFrame(ctx, 1);
      } else if (variant === "hover" && stateRef.current.currentProgress > 0) {
        drawHoverFrame(ctx, stateRef.current.currentProgress);
      }
    };

    const drawHoverFrame = (ctx: CanvasRenderingContext2D, progress: number) => {
      const { w, h, dpr } = sizeRef.current;
      const tris = latticeRef.current;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (progress <= 0.001) {
        ctx.restore();
        return;
      }

      const { originX, originY, maxDist } = stateRef.current;
      ctx.beginPath();
      for (let i = 0; i < tris.length; i++) {
        const tri = tris[i];
        const dist = Math.hypot(tri.cx - originX, tri.cy - originY);
        const delay = (dist / Math.max(1, maxDist)) * 0.52 + tri.seed * 0.14;
        const local = clamp((progress - delay) / 0.34, 0, 1);
        if (local > 0.001) {
          traceScaledTriangle(ctx, tri, smoothstep(local));
        }
      }
      ctx.fillStyle = resolvedFill;
      ctx.fill();
      ctx.restore();
    };

    const drawRevealFrame = (ctx: CanvasRenderingContext2D, progress: number) => {
      const { w, h, dpr } = sizeRef.current;
      const tris = latticeRef.current;
      const img = imgRef.current;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (!img || !imgLoadedRef.current || progress <= 0.001) {
        ctx.restore();
        return;
      }

      const cx = w * 0.5;
      const cy = h * 0.5;
      const maxD = Math.hypot(cx, cy);

      ctx.beginPath();
      for (let i = 0; i < tris.length; i++) {
        const tri = tris[i];
        const dist = Math.hypot(tri.cx - cx, tri.cy - cy);
        const delay = (dist / Math.max(1, maxD)) * 0.45 + tri.seed * 0.25;
        const local = clamp((progress - delay) / 0.3, 0, 1);
        if (local > 0.001) {
          traceScaledTriangle(ctx, tri, smoothstep(local));
        }
      }
      ctx.clip();

      // Object-cover image drawing
      const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
      const boxRatio = w / Math.max(1, h);
      let dw = w;
      let dh = h;
      let dx = 0;
      let dy = 0;
      if (imgRatio > boxRatio) {
        dw = h * imgRatio;
        dx = (w - dw) * 0.5;
      } else {
        dh = w / imgRatio;
        dy = (h - dh) * 0.5;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    const st = stateRef.current;
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(container);

    return () => {
      ro.disconnect();
      if (st.rafId) {
        cancelAnimationFrame(st.rafId);
        st.rafId = 0;
      }
    };
  }, [resolvedCell, resolvedFill, variant]);

  // Hover interaction driver
  useEffect(() => {
    if (variant !== "hover") return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const triggerEl = container?.parentElement;
    if (!container || !canvas || !triggerEl) return;

    const renderTick = (now: number) => {
      const st = stateRef.current;
      const elapsed = (now - st.startTime) / 1000;
      const totalDuration = 0.6;
      const raw = clamp(elapsed / totalDuration, 0, 1);
      const nextProgress = st.dir === 1 ? raw : 1 - raw;
      st.currentProgress = nextProgress;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const { w, h, dpr } = sizeRef.current;
        const tris = latticeRef.current;
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        if (nextProgress > 0.001) {
          ctx.beginPath();
          for (let i = 0; i < tris.length; i++) {
            const tri = tris[i];
            const dist = Math.hypot(tri.cx - st.originX, tri.cy - st.originY);
            const delay = (dist / Math.max(1, st.maxDist)) * 0.52 + tri.seed * 0.14;
            const local = clamp((nextProgress - delay) / 0.34, 0, 1);
            if (local > 0.001) {
              traceScaledTriangle(ctx, tri, smoothstep(local));
            }
          }
          ctx.fillStyle = resolvedFill;
          ctx.fill();
        }
        ctx.restore();
      }

      if (raw < 1) {
        st.rafId = requestAnimationFrame(renderTick);
      } else {
        st.rafId = 0;
        st.currentProgress = st.dir === 1 ? 1 : 0;
      }
    };

    const startAnim = (dir: 1 | -1, clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const ox = clamp(clientX - rect.left, 0, rect.width);
      const oy = clamp(clientY - rect.top, 0, rect.height);
      const maxD = Math.max(
        Math.hypot(ox, oy),
        Math.hypot(rect.width - ox, oy),
        Math.hypot(ox, rect.height - oy),
        Math.hypot(rect.width - ox, rect.height - oy)
      );

      const st = stateRef.current;
      st.originX = ox;
      st.originY = oy;
      st.maxDist = maxD;
      st.dir = dir;

      if (reducedMotion) {
        st.currentProgress = dir === 1 ? 1 : 0;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const { w, h, dpr } = sizeRef.current;
          ctx.save();
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, w, h);
          if (dir === 1) {
            ctx.fillStyle = resolvedFill;
            ctx.fillRect(0, 0, w, h);
          }
          ctx.restore();
        }
        return;
      }

      if (st.rafId) cancelAnimationFrame(st.rafId);
      const elapsedOffset =
        (dir === 1 ? st.currentProgress : 1 - st.currentProgress) * 600;
      st.startTime = performance.now() - elapsedOffset;
      st.rafId = requestAnimationFrame(renderTick);
    };

    const onEnter = (e: PointerEvent) => startAnim(1, e.clientX, e.clientY);
    const onLeave = (e: PointerEvent) => startAnim(-1, e.clientX, e.clientY);

    const stRef = stateRef.current;
    triggerEl.addEventListener("pointerenter", onEnter);
    triggerEl.addEventListener("pointerleave", onLeave);

    return () => {
      triggerEl.removeEventListener("pointerenter", onEnter);
      triggerEl.removeEventListener("pointerleave", onLeave);
      if (stRef.rafId) {
        cancelAnimationFrame(stRef.rafId);
        stRef.rafId = 0;
      }
    };
  }, [variant, resolvedFill, reducedMotion]);

  // Reveal mode: load image and trigger IntersectionObserver triangle mosaic reveal
  useEffect(() => {
    if (variant !== "reveal" || !imageSrc) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const img = new Image();
    img.decoding = "async";
    imgRef.current = img;

    const runReveal = () => {
      if (!imgLoadedRef.current) return;
      stateRef.current.revealed = true;

      const drawAt = (progress: number) => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { w, h, dpr } = sizeRef.current;
        const tris = latticeRef.current;
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        ctx.beginPath();
        const cx = w * 0.5;
        const cy = h * 0.5;
        const maxD = Math.hypot(cx, cy);
        for (let i = 0; i < tris.length; i++) {
          const tri = tris[i];
          const dist = Math.hypot(tri.cx - cx, tri.cy - cy);
          const delay = (dist / Math.max(1, maxD)) * 0.45 + tri.seed * 0.25;
          const local = clamp((progress - delay) / 0.3, 0, 1);
          if (local > 0.001) {
            traceScaledTriangle(ctx, tri, smoothstep(local));
          }
        }
        ctx.clip();

        const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
        const boxRatio = w / Math.max(1, h);
        let dw = w;
        let dh = h;
        let dx = 0;
        let dy = 0;
        if (imgRatio > boxRatio) {
          dw = h * imgRatio;
          dx = (w - dw) * 0.5;
        } else {
          dh = w / imgRatio;
          dy = (h - dh) * 0.5;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      };

      if (reducedMotion) {
        drawAt(1);
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const p = clamp((now - start) / 1100, 0, 1);
        drawAt(p);
        if (p < 1) {
          stateRef.current.rafId = requestAnimationFrame(tick);
        } else {
          stateRef.current.rafId = 0;
        }
      };
      stateRef.current.rafId = requestAnimationFrame(tick);
    };

    let isIntersecting = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          isIntersecting = true;
          runReveal();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(container);

    const stRef = stateRef.current;
    img.onload = () => {
      imgLoadedRef.current = true;
      if (isIntersecting) {
        runReveal();
      }
    };
    img.src = imageSrc;

    return () => {
      observer.disconnect();
      if (stRef.rafId) {
        cancelAnimationFrame(stRef.rafId);
        stRef.rafId = 0;
      }
    };
  }, [variant, imageSrc, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {variant === "reveal" && imageAlt ? (
        <span className="sr-only">{imageAlt}</span>
      ) : null}
      {children ? (
        <span
          className={`relative z-10 inline-flex items-center justify-center ${
            invertChildren ? "mix-blend-difference text-[#FAFAFA]" : ""
          }`}
        >
          {children}
        </span>
      ) : null}
    </div>
  );
}
