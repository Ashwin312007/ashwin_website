"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, damp } from "@/lib/math";
import { useAppStore, type Tier } from "@/store/useAppStore";
import { STAR_FRAGMENT_SHADER, STAR_VERTEX_SHADER } from "../shaders/stars";

const STAR_COUNTS_BY_TIER: Record<Tier, number> = {
  high: 1200,
  mid: 700,
  low: 350,
};

function createStarGeometry(count: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  // Deterministic LCG PRNG so geometry is reproducible across remounts
  let seed = 133742;
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (nextRand() - 0.5) * 30;
    positions[i * 3 + 1] = (nextRand() - 0.5) * 18;
    positions[i * 3 + 2] = nextRand() * 20 - 14; // [-14, 6] around camera path

    sizes[i] = 1.0 + Math.pow(nextRand(), 1.6) * 3.0;
    seeds[i] = nextRand();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

export function StarField() {
  const tier = useAppStore((s) => s.tier);
  const pointsRef = useRef<THREE.Points>(null);
  const { gl } = useThree();

  const count = STAR_COUNTS_BY_TIER[tier];
  const geometry = useMemo(() => createStarGeometry(count), [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: STAR_VERTEX_SHADER,
        fragmentShader: STAR_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: 1 },
          uVel: { value: 0 },
          uStretch: { value: 0 },
          uOpacity: { value: 0 },
        },
      }),
    []
  );

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useLayoutEffect(() => {
    materialRef.current = material;
  }, [material]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((_, rawDelta) => {
    const points = pointsRef.current;
    const mat = materialRef.current;
    if (!points || !mat) return;

    const delta = Math.min(rawDelta, 0.05);
    const { loaded, reducedMotion, scroll, camera, section, wipe } =
      useAppStore.getState();

    points.visible = wipe.progress < 0.999;

    mat.uniforms.uPixelRatio.value = gl.getPixelRatio();

    if (!reducedMotion) {
      mat.uniforms.uTime.value += delta;
    }

    const absVel = Math.abs(scroll.velocity);
    mat.uniforms.uVel.value = damp(
      mat.uniforms.uVel.value,
      reducedMotion ? 0 : absVel,
      8,
      delta
    );

    const inExperience =
      camera.key === "experience" || section.id === "experience";
    const targetStretch =
      inExperience && !reducedMotion ? clamp(absVel * 0.08, 0, 1.0) : 0;
    mat.uniforms.uStretch.value = damp(
      mat.uniforms.uStretch.value,
      targetStretch,
      8,
      delta
    );

    const targetOpacity = loaded ? (camera.key === "work" ? 0.55 : 1.0) : 0.15;
    mat.uniforms.uOpacity.value = damp(
      mat.uniforms.uOpacity.value,
      targetOpacity,
      4,
      delta
    );

    // Subtle vertical scroll parallax
    points.position.y = damp(
      points.position.y,
      reducedMotion ? 0 : scroll.y * 0.0006,
      6,
      delta
    );
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}
