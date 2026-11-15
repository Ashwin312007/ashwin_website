"use client";

import React, { Component, ReactNode, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

interface PostfxProps {
  enabled: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class PostfxErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[Postfx] Postprocessing gracefully disabled due to WebGL runtime error:",
        error
      );
    }
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

function SafeComposer() {
  const gl = useThree((state) => state.gl);

  const isSupported = useMemo(() => {
    try {
      if (!gl || typeof gl.getContext !== "function") {
        return false;
      }
      const ctx = gl.getContext();
      if (!ctx || (typeof ctx.isContextLost === "function" && ctx.isContextLost())) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, [gl]);

  if (!isSupported) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.58}
        luminanceSmoothing={0.82}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.18} darkness={0.72} />
    </EffectComposer>
  );
}

export function Postfx({ enabled }: PostfxProps) {
  if (!enabled) return null;

  return (
    <PostfxErrorBoundary fallback={null}>
      <SafeComposer />
    </PostfxErrorBoundary>
  );
}
