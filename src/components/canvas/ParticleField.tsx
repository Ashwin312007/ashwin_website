"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  PARTICLE_FRAGMENT_SHADER,
  PARTICLE_VERTEX_SHADER,
} from "@/components/canvas/shaders/particles";
import { ScrollStore } from "@/context/ExperienceProvider";
import { MouseLightState } from "@/hooks/useMouseLight";

interface ParticleFieldProps {
  count: number;
  motionEnabled: boolean;
  scrollStoreRef: React.MutableRefObject<ScrollStore>;
  mouseRef: React.MutableRefObject<MouseLightState>;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function ParticleField({
  count,
  motionEnabled,
  scrollStoreRef,
  mouseRef,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const rand = seededRandom(42);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 24;
      positions[i * 3 + 1] = (rand() - 0.5) * 16;
      positions[i * 3 + 2] = (rand() - 0.5) * 12 - 2;
      scales[i] = rand() * 1.35 + 0.35;
      phases[i] = rand() * Math.PI * 2;
      speeds[i] = rand() * 1.5 + 0.5;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uPixelRatio: {
          value:
            typeof window !== "undefined"
              ? Math.min(window.devicePixelRatio, 2)
              : 1,
        },
        uColor: { value: new THREE.Color("#9bc1ff") },
        uAccent: { value: new THREE.Color("#34d399") },
        uAccentMix: { value: 0.3 },
      },
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
    });

    return { geometry: geo, material: mat };
  }, [count]);

  const matRef = useRef(material);
  const targetAccentColor = useRef(new THREE.Color("#34d399"));

  useEffect(() => {
    matRef.current = material;
  }, [material]);

  // Clean disposal on unmount or when count re-allocates geometry/material
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const activeMat = matRef.current;
    const store = scrollStoreRef.current;
    const m = mouseRef.current;

    if (motionEnabled) {
      activeMat.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Exponential frame-rate independent damp factor
    const damp = 1.0 - Math.exp(-7.0 * delta);

    // Mouse parallax
    activeMat.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      activeMat.uniforms.uMouse.value.x,
      m.nx,
      damp
    );
    activeMat.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      activeMat.uniforms.uMouse.value.y,
      m.ny,
      damp
    );

    // Continuous scroll progress response
    activeMat.uniforms.uScroll.value = THREE.MathUtils.lerp(
      activeMat.uniforms.uScroll.value,
      store.scrollProgress,
      damp * 0.75
    );

    // Dynamic accent color harmony with active project
    if (store.activeAccent) {
      targetAccentColor.current.set(store.activeAccent);
      activeMat.uniforms.uAccent.value.lerp(targetAccentColor.current, damp);
    }

    // Blend higher accent intensity when docked in work section
    const targetMix = store.dialDockProgress > 0.1 ? 0.55 : 0.25;
    activeMat.uniforms.uAccentMix.value = THREE.MathUtils.lerp(
      activeMat.uniforms.uAccentMix.value,
      targetMix,
      damp
    );
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
