"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MouseLightState } from "@/hooks/useMouseLight";
import { ScrollStore } from "@/context/ExperienceProvider";

interface CursorLightProps {
  motionEnabled: boolean;
  mouseRef: React.MutableRefObject<MouseLightState>;
  scrollStoreRef?: React.MutableRefObject<ScrollStore>;
}

export function CursorLight({
  motionEnabled,
  mouseRef,
  scrollStoreRef,
}: CursorLightProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const targetColor = useRef(new THREE.Color("#9bc1ff"));
  const targetDirColor = useRef(new THREE.Color("#34d399"));

  useFrame((state, delta) => {
    if (!lightRef.current) return;
    const m = mouseRef.current;
    const damp = motionEnabled ? 1.0 - Math.exp(-9.0 * delta) : 1;

    const targetX = m.isTouch
      ? Math.sin(state.clock.elapsedTime * 0.6) * 2.8
      : m.nx * 4.6;
    const targetY = m.isTouch
      ? Math.cos(state.clock.elapsedTime * 0.45) * 2.0
      : m.ny * 3.2;

    lightRef.current.position.x = THREE.MathUtils.lerp(
      lightRef.current.position.x,
      targetX,
      damp
    );
    lightRef.current.position.y = THREE.MathUtils.lerp(
      lightRef.current.position.y,
      targetY,
      damp
    );

    // Harmonize cursor point light color with active project accent
    if (scrollStoreRef?.current?.activeAccent) {
      targetColor.current.set(scrollStoreRef.current.activeAccent);
      lightRef.current.color.lerp(targetColor.current, damp * 0.6);

      if (dirLightRef.current) {
        dirLightRef.current.color.lerp(targetDirColor.current, damp * 0.5);
      }
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 0, 3.5]}
        intensity={22}
        distance={16}
        color="#9bc1ff"
      />
      <ambientLight intensity={0.32} color="#8ab4f8" />
      <directionalLight
        ref={dirLightRef}
        position={[-4, 5, 3]}
        intensity={1.2}
        color="#34d399"
      />
    </>
  );
}
