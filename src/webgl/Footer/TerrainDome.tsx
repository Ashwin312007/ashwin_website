"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, damp, lerp, smoothstep } from "@/lib/math";
import { useAppStore, type Tier } from "@/store/useAppStore";
import { toNonIndexedBarycentric } from "../Core/coreGeometry";
import { TERRAIN_FRAGMENT_SHADER, TERRAIN_VERTEX_SHADER } from "../shaders/terrain";

const DOME_SEGMENTS_BY_TIER: Record<Tier, readonly [number, number]> = {
  high: [160, 80],
  mid: [110, 56],
  low: [64, 36],
};

export function TerrainDome() {
  const tier = useAppStore((s) => s.tier);
  const meshRef = useRef<THREE.Mesh>(null);

  const [widthSegs, heightSegs] = DOME_SEGMENTS_BY_TIER[tier];

  const geometry = useMemo(() => {
    const base = new THREE.SphereGeometry(
      4,
      widthSegs,
      heightSegs,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    return toNonIndexedBarycentric(base);
  }, [widthSegs, heightSegs]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: TERRAIN_VERTEX_SHADER,
        fragmentShader: TERRAIN_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uNoiseAmp: { value: 0.35 },
          uColorDark: { value: new THREE.Color("#1a1a1a") },
          uColorLight: { value: new THREE.Color("#f5f5f5") },
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

  const progressRef = useRef(0);

  useFrame((_, rawDelta) => {
    const mesh = meshRef.current;
    const mat = materialRef.current;
    if (!mesh || !mat) return;

    const delta = Math.min(rawDelta, 0.05);
    const { footerDomeProgress, camera, reducedMotion, wipe } =
      useAppStore.getState();

    // Support explicit footerDomeProgress or fallback to prefooter/footer camera keys
    let targetProgress = clamp(footerDomeProgress, 0, 1);
    if (targetProgress <= 0.001) {
      if (camera.key === "footer") {
        targetProgress = 1;
      } else if (camera.key === "prefooter") {
        targetProgress = clamp(camera.t * 0.55, 0, 1);
      }
    }

    progressRef.current = damp(
      progressRef.current,
      targetProgress,
      reducedMotion ? 24 : 5,
      delta
    );

    const p = smoothstep(progressRef.current);
    const opacity = smoothstep(0, 0.25, progressRef.current);

    mesh.visible = opacity > 0.004 && wipe.progress < 0.999;
    if (!mesh.visible) return;

    mesh.position.set(0, lerp(-3.0, -1.4, p), -2.0);
    mat.uniforms.uOpacity.value = opacity;

    if (!reducedMotion) {
      mat.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, -3, -2]}
      visible={false}
    />
  );
}
