"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp, damp, lerp, smoothstep } from "@/lib/math";
import { useAppStore, type CameraKey } from "@/store/useAppStore";

interface CameraPose {
  pos: readonly [number, number, number];
  look: readonly [number, number, number];
  fov: number;
  roll: number;
}

interface CameraKeyframe {
  from: CameraPose;
  to: CameraPose;
}

const CAMERA_KEYFRAMES: Record<CameraKey, CameraKeyframe> = {
  top: {
    from: { pos: [0, 0, 6], look: [0, 0, 0], fov: 35, roll: 0 },
    to: { pos: [0, 0, 6], look: [0, 0, 0], fov: 35, roll: 0 },
  },
  dive_in: {
    from: { pos: [0, 0, 6], look: [0, 0, 0], fov: 35, roll: 0 },
    to: { pos: [0, 0, -0.45], look: [0, 0, -3], fov: 55, roll: 0.15 },
  },
  approach: {
    from: { pos: [0, 0, 0.2], look: [0, 0, -3], fov: 55, roll: 0.12 },
    to: { pos: [0, 0, 6.6], look: [0, 0, 0], fov: 38, roll: 0 },
  },
  capabilities: {
    from: { pos: [0, 0, 6.6], look: [0, 0, 0], fov: 38, roll: 0 },
    to: { pos: [0, 0, 7.0], look: [0, 0, 0], fov: 38, roll: 0 },
  },
  work: {
    from: { pos: [0, 0, 7.0], look: [0, 0, 0], fov: 38, roll: 0 },
    to: { pos: [0, 0, 6.8], look: [0, 0, 0], fov: 36, roll: 0 },
  },
  experience: {
    from: { pos: [0, 0, 6.8], look: [0, 0, 0], fov: 36, roll: 0 },
    to: { pos: [0.3, 0, 6.6], look: [0.3, 0, 0], fov: 38, roll: 0 },
  },
  research: {
    from: { pos: [0.3, 0, 6.6], look: [0.3, 0, 0], fov: 38, roll: 0 },
    to: { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 36, roll: 0 },
  },
  about: {
    from: { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 36, roll: 0 },
    to: { pos: [0, 0, 6.4], look: [0, 0, 0], fov: 36, roll: 0 },
  },
  prefooter: {
    from: { pos: [0, 0, 6.4], look: [0, 0, 0], fov: 36, roll: 0 },
    to: { pos: [0, 0.35, 6.2], look: [0, -1.9, -1.0], fov: 38, roll: 0 },
  },
  footer: {
    from: { pos: [0, 0.35, 6.2], look: [0, -1.9, -1.0], fov: 38, roll: 0 },
    to: { pos: [0, 0.4, 6.4], look: [0, -0.35, 0], fov: 38, roll: 0 },
  },
  case: {
    from: { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 36, roll: 0 },
    to: { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 36, roll: 0 },
  },
};

export function CameraRig() {
  const tiltControl = useAppStore((s) => s.tiltControl);
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!tiltControl || typeof window === "undefined") {
      tiltRef.current.x = 0;
      tiltRef.current.y = 0;
      return;
    }

    const onOrientation = (e: DeviceOrientationEvent) => {
      const gamma = typeof e.gamma === "number" ? e.gamma : 0;
      const beta = typeof e.beta === "number" ? e.beta : 45;
      tiltRef.current.x = clamp(gamma / 45, -1, 1);
      tiltRef.current.y = clamp((beta - 45) / 45, -1, 1);
    };

    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, [tiltControl]);

  const scratchRef = useRef({
    targetPos: new THREE.Vector3(0, 0, 6),
    targetLook: new THREE.Vector3(0, 0, 0),
    smoothedLook: new THREE.Vector3(0, 0, 0),
    smoothedFov: 35,
    smoothedRoll: 0,
    parallaxX: 0,
    parallaxY: 0,
  });

  useFrame((state, rawDelta) => {
    const scratch = scratchRef.current;
    const delta = Math.min(rawDelta, 0.05);
    const {
      camera: camState,
      pointer,
      reducedMotion,
      tiltControl: tiltOn,
    } = useAppStore.getState();

    const kf = CAMERA_KEYFRAMES[camState.key] ?? CAMERA_KEYFRAMES.top;
    const st = smoothstep(clamp(camState.t, 0, 1));

    const baseX = lerp(kf.from.pos[0], kf.to.pos[0], st);
    const baseY = lerp(kf.from.pos[1], kf.to.pos[1], st);
    const baseZ = lerp(kf.from.pos[2], kf.to.pos[2], st);

    const lookX = lerp(kf.from.look[0], kf.to.look[0], st);
    const lookY = lerp(kf.from.look[1], kf.to.look[1], st);
    const lookZ = lerp(kf.from.look[2], kf.to.look[2], st);

    const targetFov = lerp(kf.from.fov, kf.to.fov, st);
    const targetRoll = reducedMotion ? 0 : lerp(kf.from.roll, kf.to.roll, st);

    const storePtrActive = pointer.x !== 0 || pointer.y !== 0;
    const px = storePtrActive ? pointer.x : state.pointer.x;
    const py = storePtrActive ? pointer.y : state.pointer.y;

    const tiltX = tiltOn ? tiltRef.current.x : 0;
    const tiltY = tiltOn ? tiltRef.current.y : 0;

    const desiredOffX = reducedMotion ? 0 : px * 0.25 + tiltX * 0.25;
    const desiredOffY = reducedMotion ? 0 : py * 0.15 + tiltY * 0.15;

    const lambda = reducedMotion ? 24 : 4;
    scratch.parallaxX = damp(scratch.parallaxX, desiredOffX, 5, delta);
    scratch.parallaxY = damp(scratch.parallaxY, desiredOffY, 5, delta);

    scratch.targetPos.set(
      baseX + scratch.parallaxX,
      baseY + scratch.parallaxY,
      baseZ
    );
    scratch.targetLook.set(lookX, lookY, lookZ);

    const cam = state.camera;
    cam.position.x = damp(cam.position.x, scratch.targetPos.x, lambda, delta);
    cam.position.y = damp(cam.position.y, scratch.targetPos.y, lambda, delta);
    cam.position.z = damp(cam.position.z, scratch.targetPos.z, lambda, delta);

    scratch.smoothedLook.x = damp(
      scratch.smoothedLook.x,
      scratch.targetLook.x,
      lambda,
      delta
    );
    scratch.smoothedLook.y = damp(
      scratch.smoothedLook.y,
      scratch.targetLook.y,
      lambda,
      delta
    );
    scratch.smoothedLook.z = damp(
      scratch.smoothedLook.z,
      scratch.targetLook.z,
      lambda,
      delta
    );

    cam.lookAt(scratch.smoothedLook);

    scratch.smoothedRoll = damp(scratch.smoothedRoll, targetRoll, lambda, delta);
    if (Math.abs(scratch.smoothedRoll) > 0.0001) {
      cam.rotateZ(scratch.smoothedRoll);
    }

    if (cam instanceof THREE.PerspectiveCamera) {
      scratch.smoothedFov = damp(scratch.smoothedFov, targetFov, lambda, delta);
      const targetAspect = state.size.width / Math.max(state.size.height, 1);
      if (
        Math.abs(cam.aspect - targetAspect) > 0.001 ||
        Math.abs(cam.fov - scratch.smoothedFov) > 0.005
      ) {
        cam.aspect = targetAspect;
        cam.fov = scratch.smoothedFov;
        cam.updateProjectionMatrix();
      }
    }
  });

  return null;
}
