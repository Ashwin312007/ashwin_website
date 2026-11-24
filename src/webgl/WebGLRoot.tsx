"use client";

import { useEffect, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useAppStore, type Tier } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const emptySubscribe = () => () => {};

const WebGLCanvas = dynamic(() => import("./WebGLCanvas"), {
  ssr: false,
});

interface NavigatorDeviceHints extends Navigator {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
}

function detectInitialTier(): Tier {
  if (typeof window === "undefined") return "mid";

  const nav = window.navigator as NavigatorDeviceHints;
  const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 4;
  const saveData = Boolean(nav.connection?.saveData);
  const coarsePointer =
    window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const narrowScreen = window.innerWidth < 768;
  const isMobileUA = /Android|iPhone|iPad|iPod/i.test(nav.userAgent);

  if (saveData || cores <= 4 || coarsePointer || narrowScreen || isMobileUA) {
    return "low";
  }
  if (cores >= 8 && !saveData) {
    return "high";
  }
  return "mid";
}

function isWebGLSupported(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    return gl !== null;
  } catch {
    return false;
  }
}

function CSSGradientFallback({
  light,
  reducedMotion,
}: {
  light: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="absolute inset-0 transition-colors duration-500"
      style={{
        background: light
          ? "radial-gradient(110% 80% at 50% 25%, #FAFAFA 0%, #EDEDED 55%, #E4E4E4 100%)"
          : "radial-gradient(95% 75% at 50% 42%, #191A1F 0%, #0E0E11 48%, #0A0A0A 100%)",
      }}
    >
      {/* Subtle static silk/grain texture */}
      <div
        className="absolute inset-0"
        style={{
          opacity: light ? 0.035 : 0.055,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />
      {!light && (
        <div
          className="absolute inset-0"
          style={{
            background: reducedMotion
              ? "linear-gradient(125deg, rgba(255,255,255,0.03) 0%, transparent 45%, rgba(165,180,252,0.025) 100%)"
              : "linear-gradient(125deg, rgba(255,255,255,0.045) 0%, transparent 45%, rgba(165,180,252,0.04) 100%)",
          }}
        />
      )}
    </div>
  );
}

export interface WebGLRootProps {
  hasPortrait?: boolean;
}

export function WebGLRoot({ hasPortrait = false }: WebGLRootProps) {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const webgl = useAppStore((s) => s.webgl);
  const surface = useAppStore((s) => s.surface);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const supported = isWebGLSupported();
    const initialTier = detectInitialTier();

    if (!supported) {
      useAppStore.getState().set({
        tier: "low",
        webgl: false,
        webglReady: true,
        webglProgress: 1,
      });
    } else {
      useAppStore.getState().set({ tier: initialTier });
    }
  }, []);

  useEffect(() => {
    if (!webgl) {
      useAppStore.getState().set({
        webglReady: true,
        webglProgress: 1,
      });
    }
  }, [webgl]);

  const isLight = surface === "light";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0A0A0A]"
    >
      {hydrated && webgl ? (
        <WebGLCanvas hasPortrait={hasPortrait} />
      ) : (
        <CSSGradientFallback light={isLight} reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

export default WebGLRoot;
