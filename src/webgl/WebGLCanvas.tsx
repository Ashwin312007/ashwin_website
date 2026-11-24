"use client";

import { useCallback, useEffect, useRef } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAppStore, type Tier } from "@/store/useAppStore";
import { Scene } from "./Scene";

const TIER_DOWN: Record<Tier, Tier> = {
  high: "mid",
  mid: "low",
  low: "low",
};

const TIER_UP: Record<Tier, Tier> = {
  low: "mid",
  mid: "high",
  high: "high",
};

function FrameScheduler() {
  const { setFrameloop, invalidate } = useThree();
  const modeRef = useRef<"always" | "throttled" | "hidden">("always");

  useEffect(() => {
    let rafId = 0;
    let tick = 0;

    const loopThrottled = () => {
      if (modeRef.current !== "throttled") return;
      tick += 1;
      if (tick % 4 === 0) {
        invalidate();
      }
      rafId = window.requestAnimationFrame(loopThrottled);
    };

    const syncMode = () => {
      const hidden = typeof document !== "undefined" && document.hidden;
      const wipeFull = useAppStore.getState().wipe.progress >= 0.999;

      const nextMode: "always" | "throttled" | "hidden" = hidden
        ? "hidden"
        : wipeFull
          ? "throttled"
          : "always";

      if (nextMode === modeRef.current) return;
      modeRef.current = nextMode;
      window.cancelAnimationFrame(rafId);

      if (nextMode === "hidden") {
        setFrameloop("never");
      } else if (nextMode === "throttled") {
        setFrameloop("demand");
        invalidate();
        tick = 0;
        rafId = window.requestAnimationFrame(loopThrottled);
      } else {
        setFrameloop("always");
      }
    };

    syncMode();

    const unsubscribe = useAppStore.subscribe((state, prev) => {
      if ((state.wipe.progress >= 0.999) !== (prev.wipe.progress >= 0.999)) {
        syncMode();
      }
    });

    document.addEventListener("visibilitychange", syncMode);
    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", syncMode);
      window.cancelAnimationFrame(rafId);
    };
  }, [setFrameloop, invalidate]);

  return null;
}

export interface WebGLCanvasProps {
  hasPortrait?: boolean;
}

export function WebGLCanvas({ hasPortrait = false }: WebGLCanvasProps) {
  const tier = useAppStore((s) => s.tier);
  const cleanupContextRef = useRef<(() => void) | null>(null);

  const dpr: [number, number] =
    tier === "high" ? [1, 2] : tier === "mid" ? [1, 1.5] : [1, 1];

  useEffect(() => {
    return () => {
      cleanupContextRef.current?.();
      cleanupContextRef.current = null;
    };
  }, []);

  const handleCreated = useCallback(
    ({ gl }: { gl: THREE.WebGLRenderer }) => {
      gl.toneMapping = THREE.AgXToneMapping;
      gl.outputColorSpace = THREE.SRGBColorSpace;

      const canvas = gl.domElement;
      const onContextLost = (e: Event) => {
        e.preventDefault();
        useAppStore.getState().set({
          webgl: false,
          webglReady: true,
          webglProgress: 1,
        });
      };

      canvas.addEventListener("webglcontextlost", onContextLost, false);
      cleanupContextRef.current = () => {
        canvas.removeEventListener("webglcontextlost", onContextLost, false);
      };
    },
    []
  );

  const handleDecline = useCallback(() => {
    const cur = useAppStore.getState().tier;
    const next = TIER_DOWN[cur];
    if (next !== cur) {
      useAppStore.getState().set({ tier: next });
    }
  }, []);

  const handleIncline = useCallback(() => {
    const cur = useAppStore.getState().tier;
    const next = TIER_UP[cur];
    if (next !== cur) {
      useAppStore.getState().set({ tier: next });
    }
  }, []);

  return (
    <Canvas
      className="h-full w-full"
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 35, near: 0.05, far: 100 }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
      }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      onCreated={handleCreated}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={handleDecline}
        onIncline={handleIncline}
      />
      <FrameScheduler />
      <Scene hasPortrait={hasPortrait} />
    </Canvas>
  );
}

export default WebGLCanvas;
