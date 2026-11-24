"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, damp } from "@/lib/math";
import { useAppStore } from "@/store/useAppStore";
import {
  RIBBON_FRAGMENT_HIGH,
  RIBBON_FRAGMENT_LOW,
  RIBBON_VERTEX_SHADER,
} from "../shaders/ribbons";

export function RibbonField() {
  const tier = useAppStore((s) => s.tier);
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, gl } = useThree();

  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: RIBBON_VERTEX_SHADER,
        fragmentShader:
          tier === "low" ? RIBBON_FRAGMENT_LOW : RIBBON_FRAGMENT_HIGH,
        depthWrite: false,
        depthTest: false,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uIntensity: { value: 0.35 },
          uLight: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uPointer: { value: new THREE.Vector2(0, 0) },
        },
      }),
    [tier]
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

  useFrame((state, rawDelta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const delta = Math.min(rawDelta, 0.05);
    const { loaded, reducedMotion, scroll, pointer, camera, wipe } =
      useAppStore.getState();

    const mesh = meshRef.current;
    if (mesh) {
      mesh.visible = wipe.progress < 0.999;
    }

    const dpr = gl.getPixelRatio();
    mat.uniforms.uRes.value.set(
      Math.max(1, size.width * dpr),
      Math.max(1, size.height * dpr)
    );

    if (!reducedMotion) {
      mat.uniforms.uTime.value += delta;
    }

    const targetScroll = scroll.progress * 2.2 + scroll.y * 0.00018;
    mat.uniforms.uScroll.value = damp(
      mat.uniforms.uScroll.value,
      targetScroll,
      5,
      delta
    );

    const storePtrActive = pointer.x !== 0 || pointer.y !== 0;
    const px = storePtrActive ? pointer.x : state.pointer.x;
    const py = storePtrActive ? pointer.y : state.pointer.y;

    const ptrVec = mat.uniforms.uPointer.value as THREE.Vector2;
    ptrVec.x = damp(ptrVec.x, reducedMotion ? 0 : px, 5, delta);
    ptrVec.y = damp(ptrVec.y, reducedMotion ? 0 : py, 5, delta);

    let targetIntensity = loaded ? 1.0 : 0.35;
    if (camera.key === "work") {
      targetIntensity = 0.5;
    } else if (camera.key === "research") {
      targetIntensity = 1.18;
    } else if (camera.key === "case") {
      targetIntensity = 0.68;
    } else if (camera.key === "capabilities") {
      targetIntensity = 0.85;
    }
    targetIntensity = clamp(targetIntensity, 0, 1.3);

    mat.uniforms.uIntensity.value = damp(
      mat.uniforms.uIntensity.value,
      targetIntensity,
      4,
      delta
    );
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      renderOrder={-1}
      frustumCulled={false}
    />
  );
}
