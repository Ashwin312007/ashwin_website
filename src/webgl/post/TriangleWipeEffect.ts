"use client";

import {
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";
import { clamp } from "@/lib/math";
import { useAppStore } from "@/store/useAppStore";
import { TRIANGLE_WIPE_FRAG } from "../shaders/triangleWipe";

export class TriangleWipeEffect extends Effect {
  constructor() {
    super("TriangleWipeEffect", TRIANGLE_WIPE_FRAG, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform<unknown>>([
        ["uProgress", new Uniform(0)],
        ["uOrigin", new Uniform(new Vector2(0.5, 0.5))],
        ["uCell", new Uniform(46)],
        ["uTime", new Uniform(0)],
        ["uRes", new Uniform(new Vector2(1, 1))],
      ]),
    });
  }
}

export interface TriangleWipeProps {
  cellSize?: number;
}

export const TriangleWipe = forwardRef<TriangleWipeEffect, TriangleWipeProps>(
  function TriangleWipe({ cellSize = 46 }, ref) {
    const { size, gl } = useThree();
    const effect = useMemo(() => new TriangleWipeEffect(), []);
    const effectRef = useRef<TriangleWipeEffect | null>(null);

    useLayoutEffect(() => {
      effectRef.current = effect;
    }, [effect]);

    useImperativeHandle(ref, () => effect, [effect]);

    useEffect(() => {
      return () => {
        effect.dispose();
      };
    }, [effect]);

    useFrame((_, rawDelta) => {
      const activeEffect = effectRef.current;
      if (!activeEffect) return;

      const delta = Math.min(rawDelta, 0.05);
      const { wipe, reducedMotion } = useAppStore.getState();

      const progress = clamp(wipe.progress, 0, 1);
      const uProgress = activeEffect.uniforms.get("uProgress");
      const uOrigin = activeEffect.uniforms.get("uOrigin");
      const uCell = activeEffect.uniforms.get("uCell");
      const uTime = activeEffect.uniforms.get("uTime");
      const uRes = activeEffect.uniforms.get("uRes");

      const dpr = gl.getPixelRatio();
      const widthPx = Math.max(1, size.width * dpr);
      const heightPx = Math.max(1, size.height * dpr);
      const responsiveScale = clamp(size.width / 1440, 0.65, 1.35);

      if (uProgress) uProgress.value = progress;
      if (uOrigin && uOrigin.value instanceof Vector2) {
        // Store origin is DOM-normalized (y=0 top, y=1 bottom); GLSL UV is y=0 bottom
        uOrigin.value.set(wipe.origin[0], 1 - wipe.origin[1]);
      }
      if (uCell) uCell.value = cellSize * dpr * responsiveScale;
      if (uTime && typeof uTime.value === "number" && !reducedMotion) {
        uTime.value += delta;
      }
      if (uRes && uRes.value instanceof Vector2) {
        uRes.value.set(widthPx, heightPx);
      }

      // Skip effect blend cost completely when wipe progress is 0
      activeEffect.blendMode.opacity.value = progress <= 0.0001 ? 0 : 1;
    });

    return createElement("primitive", { object: effect, dispose: null });
  }
);
