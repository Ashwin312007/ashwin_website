"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "@/context/ExperienceProvider";
import { useMouseLight } from "@/hooks/useMouseLight";
import { ParticleField } from "@/components/canvas/ParticleField";
import { Centerpiece } from "@/components/canvas/Centerpiece";
import { CursorLight } from "@/components/canvas/CursorLight";
import { Postfx } from "@/components/canvas/Postfx";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function subscribeMobile(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(max-width: 768px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshotMobile() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function KineticStage() {
  const { hasEntered, motionEnabled, scrollStoreRef } = useExperience();
  const mouseRef = useMouseLight();
  const isMobileGPU = useSyncExternalStore(
    subscribeMobile,
    getSnapshotMobile,
    () => false
  );

  const [declined, setDeclined] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [webglSupported] = useState(() =>
    typeof window !== "undefined" ? checkWebGLSupport() : true
  );
  const [isVisible, setIsVisible] = useState(true);

  // Pause WebGL rendering when page tab is hidden / not visible
  useEffect(() => {
    if (typeof document === "undefined") return;

    const onVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Synchronize overall body scroll progress with the reactive scroll store
  useEffect(() => {
    if (typeof window === "undefined") return;

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        scrollStoreRef.current.scrollProgress = self.progress;
      },
    });

    return () => st.kill();
  }, [scrollStoreRef]);

  // Progressive enhancement: if motion is disabled, WebGL is unsupported, or context was lost,
  // DO NOT mount Canvas — render high-performance static CSS technical background
  if (!motionEnabled || !webglSupported || contextLost) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#08080A]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "64px 64px, 64px 64px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(155, 193, 255, 0.05), transparent 70%)",
          }}
        />
      </div>
    );
  }

  // Adaptive device pixel ratio based on device capability and live performance monitoring
  const dpr: [number, number] = isMobileGPU
    ? [1, 1.25]
    : declined
    ? [1, 1]
    : [1, 1.75];

  const postfxEnabled = !isMobileGPU && !declined;

  // Dynamic particle count: scaled down on mobile and throttled GPUs to guarantee steady 60fps
  const particleCount = isMobileGPU
    ? 1600
    : declined
    ? 2000
    : 4800;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Canvas
        dpr={dpr}
        frameloop={!isVisible ? "never" : motionEnabled ? "always" : "demand"}
        camera={{ position: [0, 0, 5.8], fov: 44 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          depth: true,
          stencil: false,
        }}
        onCreated={({ gl }) => {
          const domElement = gl.domElement;
          const onContextLost = (e: Event) => {
            e.preventDefault();
            console.warn(
              "[WebGL] Context lost. Gracefully falling back to static CSS background."
            );
            setContextLost(true);
          };
          const onContextRestored = () => {
            console.info("[WebGL] Context restored successfully.");
            setContextLost(false);
          };
          domElement.addEventListener("webglcontextlost", onContextLost, false);
          domElement.addEventListener(
            "webglcontextrestored",
            onContextRestored,
            false
          );
        }}
      >
        <color attach="background" args={["#08080A"]} />
        <fog attach="fog" args={["#08080A", 5.5, 16]} />

        {/* Studio Lighting for Optical Liquid Glass Reflections & Specular Caustics */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 8, 5]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-6, -4, -3]} intensity={1.8} color="#7dd3fc" />
        <directionalLight position={[0, -5, 4]} intensity={1.2} color="#34d399" />

        <PerformanceMonitor
          onDecline={() => {
            setDeclined(true);
          }}
        />

        <CursorLight
          motionEnabled={motionEnabled}
          mouseRef={mouseRef}
          scrollStoreRef={scrollStoreRef}
        />
        <ParticleField
          count={particleCount}
          motionEnabled={motionEnabled}
          scrollStoreRef={scrollStoreRef}
          mouseRef={mouseRef}
        />
        <Centerpiece
          hasEntered={hasEntered}
          motionEnabled={motionEnabled}
          isMobileGPU={isMobileGPU}
          scrollStoreRef={scrollStoreRef}
          mouseRef={mouseRef}
        />
        <Postfx enabled={postfxEnabled && motionEnabled} />
      </Canvas>

      {/* Cursor-reactive radial glow over subtle hairline grid */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(540px circle at var(--mx, 50%) var(--my, 40%), rgba(155, 193, 255, 0.09), transparent 70%), linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 72px 72px, 72px 72px",
        }}
      />
    </div>
  );
}
