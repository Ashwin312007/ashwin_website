"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { damp, lerp, smoothstep, clamp } from "@/lib/math";
import { useAppStore, type CameraKey, type Tier } from "@/store/useAppStore";
import {
  createTriangleDitherMaterial,
  type TriangleDitherMaterialBundle,
} from "../materials/triangleDither";
import { CORE_DEFAULT_PARAMS } from "../shaders/core";
import { makeCoreGeometry } from "./coreGeometry";

interface CorePose {
  x: number;
  y: number;
  z: number;
  scale: number;
  wireMin: number;
  wireMax: number;
  darkFloor: number;
}

interface CoreKeyframe {
  from: CorePose;
  to: CorePose;
}

const CORE_DETAIL_BY_TIER: Record<Tier, number> = {
  high: 40,
  mid: 28,
  low: 18,
};

const CORE_KEYFRAMES: Record<CameraKey, CoreKeyframe> = {
  top: {
    from: { x: 0, y: 0, z: 0, scale: 1, wireMin: 0.15, wireMax: 1.15, darkFloor: 0.045 },
    to: { x: 0, y: 0, z: 0, scale: 1, wireMin: 0.15, wireMax: 1.15, darkFloor: 0.045 },
  },
  dive_in: {
    from: { x: 0, y: 0, z: 0, scale: 1, wireMin: 0.15, wireMax: 1.15, darkFloor: 0.045 },
    to: { x: 0, y: 0, z: 0, scale: 1, wireMin: 0.34, wireMax: 1.4, darkFloor: 0.035 },
  },
  approach: {
    from: { x: 0, y: 0, z: 0, scale: 0, wireMin: 0.15, wireMax: 1.05, darkFloor: 0.045 },
    to: { x: -2.6, y: 0, z: 0, scale: 0.55, wireMin: 0.12, wireMax: 0.95, darkFloor: 0.045 },
  },
  capabilities: {
    from: { x: -2.6, y: 0, z: 0, scale: 0.55, wireMin: 0.12, wireMax: 0.95, darkFloor: 0.045 },
    to: { x: -2.6, y: 0, z: 0, scale: 0.55, wireMin: 0.12, wireMax: 0.95, darkFloor: 0.045 },
  },
  work: {
    from: { x: 2.25, y: 1.15, z: -0.4, scale: 0.35, wireMin: 0.15, wireMax: 1.05, darkFloor: 0.045 },
    to: { x: 2.25, y: 1.15, z: -0.4, scale: 0.35, wireMin: 0.15, wireMax: 1.05, darkFloor: 0.045 },
  },
  experience: {
    from: { x: 2.0, y: 1.05, z: -0.8, scale: 0.25, wireMin: 0.12, wireMax: 1.0, darkFloor: 0.045 },
    to: { x: 1.2, y: 0.6, z: -0.4, scale: 0.45, wireMin: 0.14, wireMax: 1.05, darkFloor: 0.045 },
  },
  research: {
    from: { x: 0, y: 0, z: 0, scale: 0.8, wireMin: 0.16, wireMax: 1.15, darkFloor: 0.045 },
    to: { x: 0, y: 0, z: 0, scale: 0.8, wireMin: 0.16, wireMax: 1.15, darkFloor: 0.045 },
  },
  about: {
    from: { x: 0, y: 0, z: 0, scale: 0, wireMin: 0.15, wireMax: 1.0, darkFloor: 0.045 },
    to: { x: 0, y: 0, z: 0, scale: 0, wireMin: 0.15, wireMax: 1.0, darkFloor: 0.045 },
  },
  prefooter: {
    from: { x: 0, y: 0, z: 0, scale: 0, wireMin: 0.15, wireMax: 1.0, darkFloor: 0.045 },
    to: { x: 0, y: 0, z: 0, scale: 0, wireMin: 0.15, wireMax: 1.0, darkFloor: 0.045 },
  },
  footer: {
    from: { x: 0, y: 0, z: 0, scale: 0, wireMin: 0.15, wireMax: 1.0, darkFloor: 0.045 },
    to: { x: 0, y: 0, z: 0, scale: 0, wireMin: 0.15, wireMax: 1.0, darkFloor: 0.045 },
  },
  case: {
    from: { x: 2.75, y: 0.25, z: -0.8, scale: 0.6, wireMin: 0.18, wireMax: 1.2, darkFloor: 0.05 },
    to: { x: 2.75, y: 0.25, z: -0.8, scale: 0.6, wireMin: 0.18, wireMax: 1.2, darkFloor: 0.05 },
  },
};

function elasticOut(progress: number): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const p = 0.6;
  const s = p / 4;
  return (
    Math.pow(2, -10 * progress) * Math.sin(((progress - s) * (Math.PI * 2)) / p) +
    1
  );
}

export function PeristalticCore() {
  const tier = useAppStore((s) => s.tier);
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const detail = CORE_DETAIL_BY_TIER[tier];

  const geometry = useMemo(() => makeCoreGeometry(detail), [detail]);
  const bundle = useMemo(() => createTriangleDitherMaterial(), []);
  const bundleRef = useRef<TriangleDitherMaterialBundle | null>(null);

  useLayoutEffect(() => {
    bundleRef.current = bundle;
  }, [bundle]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    return () => {
      bundle.material.dispose();
    };
  }, [bundle]);

  const scratchRef = useRef({
    raycaster: new THREE.Raycaster(),
    sphere: new THREE.Sphere(new THREE.Vector3(), 1),
    hitPoint: new THREE.Vector3(),
    worldPos: new THREE.Vector3(),
    ndcPos: new THREE.Vector3(),
    pointerNdc: new THREE.Vector2(),
    dirWorld: new THREE.Vector3(),
    invQuat: new THREE.Quaternion(),
    closestPt: new THREE.Vector3(),
    baseColor: new THREE.Color("#d9d9d9"),
    accentColor: new THREE.Color("#ffffff"),
    tintedColor: new THREE.Color(),
    blackColor: new THREE.Color("#000000"),
    currentScale: 0,
    introElapsed: 0,
    introStarted: false,
    lastScrollY: 0,
    lastPtrX: 0,
    lastPtrY: 0,
  });

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    const activeBundle = bundleRef.current;
    if (!mesh || !activeBundle) return;

    const scratch = scratchRef.current;
    const delta = Math.min(rawDelta, 0.05);
    const store = useAppStore.getState();
    const {
      loaded,
      reducedMotion,
      camera: camState,
      scroll,
      pointer,
      accent,
      wipe,
    } = store;

    const { uniforms, material } = activeBundle;

    // 1. Intro elastic scale animation (0 -> 1 over 1.8s when loaded)
    if (loaded && !scratch.introStarted) {
      scratch.introStarted = true;
      scratch.introElapsed = reducedMotion ? 1.8 : 0;
    }

    let introFactor = 0.001;
    if (scratch.introStarted) {
      if (reducedMotion) {
        introFactor = 1;
      } else {
        scratch.introElapsed = Math.min(1.8, scratch.introElapsed + delta);
        introFactor = Math.max(0.001, elasticOut(scratch.introElapsed / 1.8));
      }
    }

    // 2. Keyframe interpolation for position, scale, and wireframe thickness
    const kf = CORE_KEYFRAMES[camState.key] ?? CORE_KEYFRAMES.top;
    const st = smoothstep(clamp(camState.t, 0, 1));

    const isMobile = size.width < 768;
    // Stacked hero (< lg): headline sits under the core, so shrink + lift it into the free space
    // between the header and the headline (blends back to centre as the hero scrolls away).
    const stackedHero = camState.key === "top" && size.width < 1024;
    const mobileLift = stackedHero ? (isMobile ? 0.96 : 0.75) * (1 - st) : 0;
    const mobileCapShift = camState.key === "capabilities" && isMobile ? 1.55 : 0;
    const mobileWorkShift = camState.key === "work" && isMobile ? -0.9 : 0;
    const mobileCaseShift = camState.key === "case" && isMobile ? -1.1 : 0;

    // Desktop hero: park the core to the right of the headline column and slightly smaller;
    // it eases back to the centred pose as the hero scrolls away (st: 0 -> 1).
    const heroBlend = camState.key === "top" ? 1 - st : 0;
    const heroShiftX = size.width >= 1024 ? 1.15 * heroBlend : 0;
    const heroScale =
      1 - (size.width >= 1024 ? 0.22 : isMobile ? 0.56 : 0.48) * heroBlend;

    const targetX =
      lerp(kf.from.x, kf.to.x, st) +
      heroShiftX +
      mobileCapShift +
      mobileWorkShift +
      mobileCaseShift;
    const targetY = lerp(kf.from.y, kf.to.y, st) + mobileLift;
    const targetZ = lerp(kf.from.z, kf.to.z, st);
    const targetScale = lerp(kf.from.scale, kf.to.scale, st) * heroScale;
    const targetWireMin = lerp(kf.from.wireMin, kf.to.wireMin, st);
    const targetWireMax = lerp(kf.from.wireMax, kf.to.wireMax, st);
    const targetDarkFloor = lerp(kf.from.darkFloor, kf.to.darkFloor, st);

    const lambda = reducedMotion ? 30 : 6;
    mesh.position.x = damp(mesh.position.x, targetX, lambda, delta);
    mesh.position.y = damp(mesh.position.y, targetY, lambda, delta);
    mesh.position.z = damp(mesh.position.z, targetZ, lambda, delta);

    scratch.currentScale = damp(scratch.currentScale, targetScale, lambda, delta);
    const finalScale = CORE_DEFAULT_PARAMS.baseRadius * scratch.currentScale * introFactor;
    mesh.scale.setScalar(Math.max(0.0001, finalScale));

    // Skip draw call when hidden by scale=0 sections or fully covered by silk wipe
    const fullyHiddenByScale = finalScale <= 0.0025;
    const fullyCoveredByWipe = wipe.progress >= 0.999;
    mesh.visible = !fullyHiddenByScale && !fullyCoveredByWipe;

    // 3. Peristaltic time, rotation & velocity jitter
    if (!reducedMotion) {
      uniforms.uTime.value += delta;
      const scrollDelta = scroll.y - scratch.lastScrollY;
      scratch.lastScrollY = scroll.y;
      const heroScrollSpin = camState.key === "top" ? scrollDelta * 0.0012 : 0;
      const orbitBoost = camState.key === "work" ? delta * 0.06 : 0;
      mesh.rotation.y += delta * 0.08 + orbitBoost + scroll.velocity * 0.0004 + heroScrollSpin;
      mesh.rotation.x = damp(
        mesh.rotation.x,
        camState.key === "work" ? Math.sin(uniforms.uTime.value * 0.35) * 0.14 : 0,
        4,
        delta
      );
    }

    // 4. Pointer dent (prefer store.pointer, fallback to R3F state.pointer)
    const storePtrActive =
      pointer.x !== 0 || pointer.y !== 0 || pointer.vx !== 0 || pointer.vy !== 0;
    const px = storePtrActive ? pointer.x : state.pointer.x;
    const py = storePtrActive ? pointer.y : state.pointer.y;
    const pvx = storePtrActive
      ? pointer.vx
      : (px - scratch.lastPtrX) / Math.max(delta, 0.008);
    const pvy = storePtrActive
      ? pointer.vy
      : (py - scratch.lastPtrY) / Math.max(delta, 0.008);
    scratch.lastPtrX = px;
    scratch.lastPtrY = py;

    scratch.pointerNdc.set(px, py);
    scratch.worldPos.copy(mesh.position);
    scratch.ndcPos.copy(scratch.worldPos).project(state.camera);

    const screenDist = Math.hypot(
      px - scratch.ndcPos.x,
      py - scratch.ndcPos.y
    );
    const overCoreArea =
      !reducedMotion && mesh.visible && screenDist < 0.72 && camState.key !== "dive_in";

    uniforms.uPointerAmt.value = damp(
      uniforms.uPointerAmt.value,
      overCoreArea ? 1 : 0,
      7,
      delta
    );

    if (overCoreArea) {
      scratch.raycaster.setFromCamera(scratch.pointerNdc, state.camera);
      scratch.sphere.set(scratch.worldPos, Math.max(finalScale, 0.25));
      const hit = scratch.raycaster.ray.intersectSphere(
        scratch.sphere,
        scratch.hitPoint
      );
      if (hit) {
        scratch.dirWorld.subVectors(hit, scratch.worldPos).normalize();
      } else {
        scratch.raycaster.ray.closestPointToPoint(
          scratch.worldPos,
          scratch.closestPt
        );
        scratch.dirWorld
          .subVectors(scratch.closestPt, scratch.worldPos)
          .addScaledVector(state.camera.position, 0.25)
          .normalize();
      }
      scratch.invQuat.copy(mesh.quaternion).invert();
      scratch.dirWorld.applyQuaternion(scratch.invQuat).normalize();
      uniforms.uPointerDir.value.lerp(
        scratch.dirWorld,
        1 - Math.exp(-12 * delta)
      );
      uniforms.uPointerDir.value.normalize();
    }

    // 5. Velocity jitter + wireframe parameters
    const ptrSpeed = Math.hypot(pvx, pvy);
    const targetVel = reducedMotion
      ? 0
      : clamp(ptrSpeed * 0.45 + Math.abs(scroll.velocity) * 0.08, 0, 2.5);
    uniforms.uVel.value = damp(uniforms.uVel.value, targetVel, 8, delta);
    uniforms.uWave.value = reducedMotion ? 0.25 : CORE_DEFAULT_PARAMS.wave;
    uniforms.uNoiseAmp.value = reducedMotion ? 0.02 : CORE_DEFAULT_PARAMS.noiseAmp;
    uniforms.uWireMin.value = damp(uniforms.uWireMin.value, targetWireMin, 6, delta);
    uniforms.uWireMax.value = damp(uniforms.uWireMax.value, targetWireMax, 6, delta);
    uniforms.uDarkFloor.value = damp(uniforms.uDarkFloor.value, targetDarkFloor, 6, delta);

    // 6. Case-study accent tinting (~0.6s transition)
    const colorAlpha = 1 - Math.exp(-5.5 * delta);
    if (camState.key === "case") {
      scratch.accentColor.set(accent || "#ffffff");
      scratch.tintedColor
        .copy(scratch.baseColor)
        .lerp(scratch.accentColor, 0.72);
      material.color.lerp(scratch.tintedColor, colorAlpha);
      material.emissive.lerp(scratch.accentColor, colorAlpha);
      material.emissiveIntensity = damp(material.emissiveIntensity, 0.05, 5.5, delta);
    } else {
      material.color.lerp(scratch.baseColor, colorAlpha);
      material.emissive.lerp(scratch.blackColor, colorAlpha);
      material.emissiveIntensity = damp(material.emissiveIntensity, 0, 5.5, delta);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={bundle.material}
      frustumCulled={false}
    />
  );
}
