"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ScrollStore } from "@/context/ExperienceProvider";
import { MouseLightState } from "@/hooks/useMouseLight";
import {
  STAR_DISPERSION_VERTEX_SHADER,
  STAR_DISPERSION_FRAGMENT_SHADER,
} from "@/components/canvas/shaders/starDispersion";

interface CenterpieceProps {
  hasEntered: boolean;
  motionEnabled: boolean;
  isMobileGPU: boolean;
  scrollStoreRef: React.MutableRefObject<ScrollStore>;
  mouseRef: React.MutableRefObject<MouseLightState>;
}

// Deterministic, pure pseudo-random generator for React 19 compiler purity compliance
function createPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function Centerpiece({
  hasEntered,
  motionEnabled,
  isMobileGPU,
  scrollStoreRef,
  mouseRef,
}: CenterpieceProps) {
  const rootRef = useRef<THREE.Group>(null);
  const solidGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const coreBasePosRef = useRef<Float32Array | null>(null);
  const coreWireRef = useRef<THREE.Mesh>(null);
  const orbit1Ref = useRef<THREE.Group>(null);
  const orbit2Ref = useRef<THREE.Group>(null);
  const orbit3Ref = useRef<THREE.Group>(null);
  const orbit4Ref = useRef<THREE.Group>(null);
  const fibersGroupRef = useRef<THREE.Group>(null);
  const pulsesGroupRef = useRef<THREE.Group>(null);
  const pearlsGroupRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const starPointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const currentDisperseRef = useRef(0);

  // Create curves for fiber-optic tendon cables
  const { curves, fiberGeos, pulseGeo, pulseMat } = useMemo(() => {
    const rawCurves: THREE.CatmullRomCurve3[] = [];
    const fGeos: THREE.TubeGeometry[] = [];
    const cableCount = 8;

    for (let i = 0; i < cableCount; i++) {
      const angle = (i / cableCount) * Math.PI * 2;
      const nextAngle = angle + 0.68;
      const rMid = 1.28;
      const rEnd = 1.88;
      const zArc = (i % 2 === 0 ? 1 : -1) * 0.46;

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 0.68, Math.sin(angle) * 0.68, 0),
        new THREE.Vector3(
          Math.cos(angle + 0.32) * rMid,
          Math.sin(angle + 0.32) * rMid,
          zArc
        ),
        new THREE.Vector3(
          Math.cos(nextAngle) * rEnd,
          Math.sin(nextAngle) * rEnd,
          -zArc * 0.45
        ),
      ]);
      rawCurves.push(curve);
      fGeos.push(new THREE.TubeGeometry(curve, 36, 0.0085, 8, false));
    }

    const pGeo = new THREE.SphereGeometry(0.038, 16, 16);
    const pMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#7dd3fc"),
      emissiveIntensity: 2.2,
      transmission: 0.95,
      roughness: 0.02,
      ior: 1.62,
      thickness: 1.5,
      transparent: true,
      opacity: 0.95,
    });

    return {
      curves: rawCurves,
      fiberGeos: fGeos,
      pulseGeo: pGeo,
      pulseMat: pMat,
    };
  }, []);

  // Floating illuminated liquid glass pearls / sparkles hovering directly around the liquid glass orb
  const { pearlGeo, pearlMat, pearlData } = useMemo(() => {
    const prng = createPRNG(1337);
    const count = 24;
    const geo = new THREE.SphereGeometry(0.022, 16, 16);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#38bdf8"),
      emissiveIntensity: 2.6,
      transmission: 0.96,
      roughness: 0.02,
      ior: 1.62,
      thickness: 1.4,
      transparent: true,
      opacity: 0.95,
    });

    const data = Array.from({ length: count }, (_, i) => {
      const radius = 1.05 + prng() * 0.45;
      const theta = prng() * Math.PI * 2;
      const phi = Math.acos(prng() * 2 - 1);
      const speed = (prng() * 0.4 + 0.2) * (i % 2 === 0 ? 1 : -1);
      const bobSpeed = prng() * 1.5 + 1.0;
      const bobAmp = prng() * 0.08 + 0.03;
      const phase = prng() * Math.PI * 2;
      return { radius, theta, phi, speed, bobSpeed, bobAmp, phase };
    });

    return { pearlGeo: geo, pearlMat: mat, pearlData: data };
  }, []);

  const {
    coreGeo,
    coreWireGeo,
    orbitGeo1,
    orbitGeo2,
    orbitGeo3,
    orbitGeo4,
    satGeo,
    haloGeo,
    coreMat,
    coreWireMat,
    orbitMat1,
    orbitMat2,
    orbitMat3,
    orbitMat4,
    satMat,
    satAccentMat,
    haloMat,
    accentHaloMat,
    fiberMat,
  } = useMemo(() => {
    // Morphing high-resolution sphere for organic liquid glass core
    const cGeo = new THREE.SphereGeometry(0.85, 64, 64);
    // Inner glowing tech nucleus refracted by the outer liquid glass orb
    const cwGeo = new THREE.IcosahedronGeometry(0.42, 1);

    const oGeo1 = new THREE.TorusGeometry(1.34, 0.012, 16, 140);
    const oGeo2 = new THREE.TorusGeometry(1.72, 0.01, 16, 140);
    const oGeo3 = new THREE.TorusGeometry(2.12, 0.0085, 16, 140);
    const oGeo4 = new THREE.TorusGeometry(1.5, 0.007, 16, 140);

    const sGeo = new THREE.SphereGeometry(0.058, 16, 16);
    const hGeo = new THREE.SphereGeometry(0.12, 16, 16);

    // Optical Liquid Glass Material with Chromatic Dispersion & Caustic Transmission
    const cMat = isMobileGPU
      ? new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#f0f9ff"),
          roughness: 0.05,
          metalness: 0.04,
          transmission: 0.92,
          thickness: 2.2,
          ior: 1.55,
          transparent: true,
          opacity: 1,
        })
      : new THREE.MeshPhysicalMaterial({
          color: new THREE.Color("#f0f9ff"),
          roughness: 0.02,
          metalness: 0.03,
          transmission: 0.97,
          thickness: 2.8,
          ior: 1.62,
          dispersion: 0.16,
          clearcoat: 1.0,
          clearcoatRoughness: 0.01,
          attenuationColor: new THREE.Color("#7dd3fc"),
          attenuationDistance: 1.8,
          reflectivity: 0.96,
          specularIntensity: 1.25,
          transparent: true,
          opacity: 1,
        });

    const cwMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#38bdf8"),
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    // Optical Liquid Glass Orbital Rings
    const oMat1 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#9bc1ff"),
      transmission: 0.88,
      roughness: 0.05,
      thickness: 1.1,
      ior: 1.52,
      transparent: true,
      opacity: 0.88,
    });
    const oMat2 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#38bdf8"),
      transmission: 0.88,
      roughness: 0.05,
      thickness: 1.1,
      ior: 1.52,
      transparent: true,
      opacity: 0.88,
    });
    const oMat3 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#34d399"),
      transmission: 0.88,
      roughness: 0.05,
      thickness: 1.1,
      ior: 1.52,
      transparent: true,
      opacity: 0.88,
    });
    const oMat4 = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#c084fc"),
      transmission: 0.88,
      roughness: 0.05,
      thickness: 1.1,
      ior: 1.52,
      transparent: true,
      opacity: 0.88,
    });

    // Illuminated Liquid Glass Satellite Pearls
    const stMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#9bc1ff"),
      emissiveIntensity: 1.8,
      transmission: 0.94,
      roughness: 0.02,
      ior: 1.65,
      thickness: 1.6,
      transparent: true,
      opacity: 1,
    });

    const stAccentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#ffffff"),
      emissive: new THREE.Color("#34d399"),
      emissiveIntensity: 2.2,
      transmission: 0.94,
      roughness: 0.02,
      ior: 1.65,
      thickness: 1.6,
      transparent: true,
      opacity: 1,
    });

    const hMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#9bc1ff"),
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const aHMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#34d399"),
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const fbMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#9bc1ff"),
      transparent: true,
      opacity: 0.36,
    });

    return {
      coreGeo: cGeo,
      coreWireGeo: cwGeo,
      orbitGeo1: oGeo1,
      orbitGeo2: oGeo2,
      orbitGeo3: oGeo3,
      orbitGeo4: oGeo4,
      satGeo: sGeo,
      haloGeo: hGeo,
      coreMat: cMat,
      coreWireMat: cwMat,
      orbitMat1: oMat1,
      orbitMat2: oMat2,
      orbitMat3: oMat3,
      orbitMat4: oMat4,
      satMat: stMat,
      satAccentMat: stAccentMat,
      haloMat: hMat,
      accentHaloMat: aHMat,
      fiberMat: fbMat,
    };
  }, [isMobileGPU]);

  // 1,920 structural star points sampled from the 3D model for background stellar dispersion
  const { starGeo, starMat } = useMemo(() => {
    const rand = createPRNG(42);
    const starCount = 1920;
    const origins = new Float32Array(starCount * 3);
    const targets = new Float32Array(starCount * 3);
    const burstVels = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const scales = new Float32Array(starCount);
    const phases = new Float32Array(starCount);
    const speeds = new Float32Array(starCount);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#a5d8ff"),
      new THREE.Color("#38bdf8"),
      new THREE.Color("#34d399"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#fef08a"),
    ];

    let cursor = 0;

    // Viewport-adaptive bounds for bounded constellation targets
    // Frustum width and height at z=0 with fov=44, dist=5.8
    const boundX = Math.max(viewport.width * 0.54, 4.6);
    const boundY = Math.max(viewport.height * 0.54, 2.6);

    const tempV = new THREE.Vector3();

    // Helper to assign target coordinates, burst velocity, color, scale, phase
    const assignStarAttributes = (
      idxCursor: number,
      originVec: THREE.Vector3,
      paletteOffset: number
    ) => {
      const idx = idxCursor * 3;
      origins[idx] = originVec.x;
      origins[idx + 1] = originVec.y;
      origins[idx + 2] = originVec.z;

      // Bounded target position across the visible UI viewport
      // Disperses across viewport with controlled, elegant spatial containment
      targets[idx] = (rand() - 0.5) * boundX * 1.5;
      targets[idx + 1] = (rand() - 0.5) * boundY * 1.5;
      targets[idx + 2] = (rand() - 0.5) * 1.6 - 0.2; // Z in [-1.0, 0.6]

      // Radial shockwave burst vector + randomized direction (gentle burst impulse)
      const norm = originVec.clone().normalize();
      const randOffset = new THREE.Vector3(
        (rand() - 0.5) * 1.0,
        (rand() - 0.5) * 1.0,
        (rand() - 0.5) * 1.0
      );
      const vel = norm.multiplyScalar(rand() * 1.0 + 0.6).add(randOffset);
      burstVels[idx] = vel.x;
      burstVels[idx + 1] = vel.y;
      burstVels[idx + 2] = vel.z;

      const c = palette[(idxCursor + paletteOffset) % palette.length];
      colors[idx] = c.r;
      colors[idx + 1] = c.g;
      colors[idx + 2] = c.b;

      // Star scale: delicate, crystalline micro-sparkles (0.55 - 0.90), 28% radiant optical stars (0.95 - 1.30)
      const isRadiant = rand() > 0.72;
      scales[idxCursor] = isRadiant ? rand() * 0.35 + 0.95 : rand() * 0.35 + 0.55;

      phases[idxCursor] = rand() * Math.PI * 2;
      speeds[idxCursor] = rand() * 1.3 + 0.7;
    };

    // 1) Sample points from 4 orbital rings (total: 1,220 points)
    const ringRadii = [1.34, 1.72, 2.12, 1.5];
    const ringCounts = [290, 340, 360, 230];
    const ringIncline = [
      new THREE.Euler(0.48, 0.22, 0),
      new THREE.Euler(-0.55, 0.4, 0.3),
      new THREE.Euler(0.25, -0.6, 0.15),
      new THREE.Euler(Math.PI / 2, 0, 0),
    ];

    for (let r = 0; r < 4; r++) {
      const radius = ringRadii[r];
      const count = ringCounts[r];
      const eul = ringIncline[r];

      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        tempV.set(Math.cos(theta) * radius, Math.sin(theta) * radius, 0).applyEuler(eul);
        assignStarAttributes(cursor, tempV, 0);
        cursor++;
      }
    }

    // 2) Sample points from 8 fiber tendon curves (50 pts * 8 = 400 points)
    const ptsPerFiber = 50;
    for (let f = 0; f < curves.length; f++) {
      const curve = curves[f];
      for (let p = 0; p < ptsPerFiber; p++) {
        const t = p / ptsPerFiber;
        curve.getPoint(t, tempV);
        assignStarAttributes(cursor, tempV, 2);
        cursor++;
      }
    }

    // 3) Sample points on the core icosahedron (300 points)
    while (cursor < starCount) {
      const u = rand();
      const v = rand();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.78 * (0.8 + rand() * 0.35);
      const sinPhi = Math.sin(phi);
      tempV.set(r * sinPhi * Math.cos(theta), r * sinPhi * Math.sin(theta), r * Math.cos(phi));
      assignStarAttributes(cursor, tempV, 3);
      cursor++;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(origins, 3));
    geo.setAttribute("aOrigin", new THREE.BufferAttribute(origins, 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    geo.setAttribute("aBurstVel", new THREE.BufferAttribute(burstVels, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uDisperse: { value: 0 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: {
          value:
            typeof window !== "undefined"
              ? Math.min(window.devicePixelRatio, 2)
              : 1,
        },
        uAccent: { value: new THREE.Color("#34d399") },
      },
      vertexShader: STAR_DISPERSION_VERTEX_SHADER,
      fragmentShader: STAR_DISPERSION_FRAGMENT_SHADER,
    });

    return {
      starGeo: geo,
      starMat: mat,
    };
  }, [curves, viewport.height, viewport.width]);

  // Keep references to animated materials inside a mutable ref to satisfy React 19 compiler immutability
  const matsRef = useRef({
    coreMat,
    coreWireMat,
    orbitMat1,
    orbitMat2,
    orbitMat3,
    orbitMat4,
    satMat,
    satAccentMat,
    haloMat,
    accentHaloMat,
    fiberMat,
    pulseMat,
    pearlMat,
  });

  const starRefs = useRef({ starGeo, starMat });

  useEffect(() => {
    starRefs.current = { starGeo, starMat };
  }, [starGeo, starMat]);

  useEffect(() => {
    if (coreGeo) {
      coreBasePosRef.current = new Float32Array(coreGeo.attributes.position.array);
    }
  }, [coreGeo]);

  useEffect(() => {
    matsRef.current = {
      coreMat,
      coreWireMat,
      orbitMat1,
      orbitMat2,
      orbitMat3,
      orbitMat4,
      satMat,
      satAccentMat,
      haloMat,
      accentHaloMat,
      fiberMat,
      pulseMat,
      pearlMat,
    };
  }, [
    coreMat,
    coreWireMat,
    orbitMat1,
    orbitMat2,
    orbitMat3,
    orbitMat4,
    satMat,
    satAccentMat,
    haloMat,
    accentHaloMat,
    fiberMat,
    pulseMat,
    pearlMat,
  ]);

  // Clean disposal of all Three.js geometries and materials on unmount or re-render
  useEffect(() => {
    const currentRoot = rootRef.current;
    return () => {
      coreGeo.dispose();
      coreWireGeo.dispose();
      orbitGeo1.dispose();
      orbitGeo2.dispose();
      orbitGeo3.dispose();
      orbitGeo4.dispose();
      satGeo.dispose();
      haloGeo.dispose();
      pulseGeo.dispose();
      pearlGeo.dispose();
      fiberGeos.forEach((g) => g.dispose());
      starGeo.dispose();

      coreMat.dispose();
      coreWireMat.dispose();
      orbitMat1.dispose();
      orbitMat2.dispose();
      orbitMat3.dispose();
      orbitMat4.dispose();
      satMat.dispose();
      satAccentMat.dispose();
      haloMat.dispose();
      accentHaloMat.dispose();
      fiberMat.dispose();
      pulseMat.dispose();
      pearlMat.dispose();
      starMat.dispose();

      // Recursive scene graph safety traversal
      if (currentRoot) {
        currentRoot.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material?.dispose();
            }
          }
        });
      }
    };
  }, [
    coreGeo,
    coreWireGeo,
    orbitGeo1,
    orbitGeo2,
    orbitGeo3,
    orbitGeo4,
    satGeo,
    haloGeo,
    pulseGeo,
    pearlGeo,
    fiberGeos,
    starGeo,
    coreMat,
    coreWireMat,
    orbitMat1,
    orbitMat2,
    orbitMat3,
    orbitMat4,
    satMat,
    satAccentMat,
    haloMat,
    accentHaloMat,
    fiberMat,
    pulseMat,
    pearlMat,
    starMat,
  ]);

  const targetAccentColor = useRef(new THREE.Color("#9bc1ff"));
  const tempPulseVec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const store = scrollStoreRef.current;
    const dock = store.dialDockProgress; // 0 = Right side of page, 1 = Docked at left half-circle dial hub
    const targetDisperse = store.disperseProgress || 0;
    const damp = 1.0 - Math.exp(-6.8 * delta);
    // Slower, silky smooth cinematic damping specifically for scatter/dispersion
    const dispDamp = 1.0 - Math.exp(-2.8 * delta);
    const mats = matsRef.current;

    // Smoothly track disperse progress with slow exponential damping
    currentDisperseRef.current = THREE.MathUtils.lerp(
      currentDisperseRef.current,
      targetDisperse,
      dispDamp
    );
    const disp = currentDisperseRef.current;

    // 1) Solid structure opacity: smoothly fades down to 0 as dispersion advances past the dial
    const solidAlpha = Math.max(0, 1.0 - disp * 1.85);
    mats.coreMat.opacity = solidAlpha;
    mats.coreWireMat.opacity = 0.28 * solidAlpha;
    mats.orbitMat1.opacity = 0.45 * solidAlpha;
    mats.orbitMat2.opacity = 0.32 * solidAlpha;
    mats.orbitMat3.opacity = 0.24 * solidAlpha;
    mats.orbitMat4.opacity = 0.2 * solidAlpha;
    mats.fiberMat.opacity = 0.36 * solidAlpha;
    mats.satMat.opacity = solidAlpha;
    mats.satAccentMat.opacity = solidAlpha;
    mats.haloMat.opacity = 0.42 * solidAlpha;
    mats.accentHaloMat.opacity = 0.48 * solidAlpha;
    mats.pulseMat.opacity = 0.9 * solidAlpha;
    mats.pearlMat.opacity = 0.95 * solidAlpha;

    if (coreLightRef.current) {
      coreLightRef.current.intensity = 2.8 * solidAlpha;
    }

    if (solidGroupRef.current) {
      solidGroupRef.current.visible = solidAlpha > 0.005;
    }

    // Liquid glass fluid surface undulation (morphing ripples across optical glass sphere)
    if (coreMeshRef.current && solidAlpha > 0.02) {
      const geo = coreMeshRef.current.geometry;
      const posAttr = geo.attributes.position;
      const arr = posAttr.array as Float32Array;
      const base = coreBasePosRef.current;
      if (base) {
        const time = state.clock.elapsedTime;
        for (let i = 0; i < base.length; i += 3) {
          const bx = base[i];
          const by = base[i + 1];
          const bz = base[i + 2];
          // Multi-frequency spherical fluid wave harmonics
          const wave =
            Math.sin(bx * 3.2 + time * 1.5) * Math.cos(by * 3.2 + time * 1.2) * 0.075 +
            Math.sin(bz * 4.2 + time * 1.8) * 0.045 +
            Math.cos((bx + by + bz) * 2.5 + time) * 0.035;
          const scale = 1.0 + wave;
          arr[i] = bx * scale;
          arr[i + 1] = by * scale;
          arr[i + 2] = bz * scale;
        }
        posAttr.needsUpdate = true;
        geo.computeVertexNormals();
      }
    }

    // 2) Dispersed Celestial Starfield GPU Uniforms (runs 100% on GPU, zero CPU buffer writes)
    const { starMat: sMat } = starRefs.current;
    sMat.uniforms.uDisperse.value = disp;
    sMat.uniforms.uTime.value = state.clock.elapsedTime;
    sMat.uniforms.uMouse.value.set(mouseRef.current.nx, mouseRef.current.ny);

    // Responsive position calculation based on viewport width
    const isWide = viewport.width > 5.0;
    const heroX = isWide ? Math.min(viewport.width * 0.25, 2.15) : 0;
    const heroY = 0;
    const heroZ = -0.35;

    // Dial hub position aligns with left-edge half-circle rotary dial (center of 380px dial ring)
    const dockX = isWide ? -viewport.width * 0.385 : 0;
    const dockY = 0;
    const dockZ = 0.0;

    const baseTargetX = THREE.MathUtils.lerp(heroX, dockX, dock);
    const baseTargetY = THREE.MathUtils.lerp(heroY, dockY, dock);
    const baseTargetZ = THREE.MathUtils.lerp(heroZ, dockZ, dock);

    // When dispersing into background stars, smoothly recenter group translation to (0, 0, 0)
    // so the constellation spans the entire viewport symmetrically
    const targetX = THREE.MathUtils.lerp(baseTargetX, 0, disp);
    const targetY = THREE.MathUtils.lerp(baseTargetY, 0, disp);
    const targetZ = THREE.MathUtils.lerp(baseTargetZ, 0, disp);

    if (rootRef.current) {
      // Smooth docking translation
      rootRef.current.position.x = THREE.MathUtils.lerp(
        rootRef.current.position.x,
        targetX,
        damp
      );
      rootRef.current.position.y = THREE.MathUtils.lerp(
        rootRef.current.position.y,
        targetY,
        damp
      );
      rootRef.current.position.z = THREE.MathUtils.lerp(
        rootRef.current.position.z,
        targetZ,
        damp
      );

      // Smooth docking scale
      const heroScale = hasEntered
        ? isWide
          ? 0.95
          : 0.68
        : 0.45 + store.gateProgress * 0.5;
      const dockScale = isWide ? 0.78 : 0.62;
      const baseScale = THREE.MathUtils.lerp(heroScale, dockScale, dock);
      const targetScale = THREE.MathUtils.lerp(baseScale, 1.0, disp);

      rootRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rootRef.current.scale.x, targetScale, damp)
      );

      if (motionEnabled) {
        // When docked into the rotary dial, the Z-rotation locks and indexes with each project notch (20 deg each)
        const notchAngleRad = 20 * (Math.PI / 180);
        const dialRotZ = -store.activeDialIndex * notchAngleRad;

        // Smoothly blend between free celestial rotation and docked dial lock, then relax when dispersed
        const activeRotZ = THREE.MathUtils.lerp(dialRotZ * dock, 0, disp);
        rootRef.current.rotation.z = THREE.MathUtils.lerp(
          rootRef.current.rotation.z,
          activeRotZ,
          damp
        );

        // Attenuate mouse tilt when docked so dial lock stays stable; gentle parallax when dispersed
        const tiltFactor = THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(1.0, 0.22, dock),
          0.35,
          disp
        );
        rootRef.current.rotation.x = THREE.MathUtils.lerp(
          rootRef.current.rotation.x,
          mouseRef.current.ny * 0.18 * tiltFactor,
          damp * 0.8
        );
        rootRef.current.rotation.y = THREE.MathUtils.lerp(
          rootRef.current.rotation.y,
          mouseRef.current.nx * 0.22 * tiltFactor +
            state.clock.elapsedTime * 0.14 * (1 - dock * 0.7) * (1 - disp * 0.75),
          damp * 0.8
        );
      }
    }

    // Dynamic accent color harmony
    if (store.activeAccent) {
      targetAccentColor.current.set(store.activeAccent);
      mats.coreWireMat.color.lerp(targetAccentColor.current, damp);
      mats.fiberMat.color.lerp(targetAccentColor.current, damp);
      mats.orbitMat2.color.lerp(targetAccentColor.current, damp);
      mats.accentHaloMat.color.lerp(targetAccentColor.current, damp);
      mats.satAccentMat.emissive.lerp(targetAccentColor.current, damp);
      mats.pearlMat.emissive.lerp(targetAccentColor.current, damp);
      sMat.uniforms.uAccent.value.lerp(targetAccentColor.current, damp);

      if (coreLightRef.current) {
        coreLightRef.current.color.lerp(targetAccentColor.current, damp);
      }
    }

    // Point-Line-Plane narrative morphing influence
    const morph = store.narrativeMorph || 0;
    // In Stage 1 ("Line"), tendon cables and orbital lines brighten
    mats.fiberMat.opacity =
      THREE.MathUtils.lerp(0.34, 0.65, Math.sin(morph * Math.PI)) * solidAlpha;
    mats.orbitMat1.opacity =
      THREE.MathUtils.lerp(0.42, 0.68, Math.sin(morph * Math.PI)) * solidAlpha;

    // Internal celestial motion
    if (motionEnabled) {
      if (coreWireRef.current) coreWireRef.current.rotation.y -= delta * 0.22;
      if (orbit1Ref.current) orbit1Ref.current.rotation.z += delta * 0.42;
      if (orbit2Ref.current) orbit2Ref.current.rotation.z -= delta * 0.28;
      if (orbit3Ref.current) orbit3Ref.current.rotation.z += delta * 0.2;
      if (orbit4Ref.current) orbit4Ref.current.rotation.z -= delta * 0.15;
      if (fibersGroupRef.current) {
        fibersGroupRef.current.rotation.z -= delta * 0.12;
      }

      // Animate tendon data signal pulses along the CatmullRom curves
      if (pulsesGroupRef.current) {
        const pulseChildren = pulsesGroupRef.current.children;
        const time = state.clock.elapsedTime * 0.55;
        for (let i = 0; i < curves.length; i++) {
          const pulseMesh = pulseChildren[i];
          if (pulseMesh) {
            const curve = curves[i];
            const t = (time + i / curves.length) % 1;
            curve.getPoint(t, tempPulseVec.current);
            pulseMesh.position.copy(tempPulseVec.current);
          }
        }
      }

      // Animate floating illuminated liquid glass pearls around central core
      if (pearlsGroupRef.current) {
        const pearlChildren = pearlsGroupRef.current.children;
        const time = state.clock.elapsedTime;
        for (let i = 0; i < pearlData.length; i++) {
          const mesh = pearlChildren[i];
          if (mesh) {
            const p = pearlData[i];
            const currentTheta = p.theta + time * p.speed;
            const currentR = p.radius + Math.sin(time * p.bobSpeed + p.phase) * p.bobAmp;
            const x = currentR * Math.sin(p.phi) * Math.cos(currentTheta);
            const y = currentR * Math.sin(p.phi) * Math.sin(currentTheta);
            const z = currentR * Math.cos(p.phi);
            mesh.position.set(x, y, z);
          }
        }
      }
    }
  });

  return (
    <group ref={rootRef} position={[1.4, 0, -0.35]}>
      {/* Solid Mechanical Celestial Structure */}
      <group ref={solidGroupRef}>
        {/* Central Core & Emissive Pulse Light */}
        <mesh ref={coreMeshRef} geometry={coreGeo} material={coreMat} />
        <mesh ref={coreWireRef} geometry={coreWireGeo} material={coreWireMat} />
        <pointLight
          ref={coreLightRef}
          distance={4.2}
          intensity={3.5}
          color="#38bdf8"
        />

        {/* Curved Fiber-Optic Tendon Cables */}
        <group ref={fibersGroupRef}>
          {fiberGeos.map((fGeo, idx) => (
            <mesh key={idx} geometry={fGeo} material={fiberMat} />
          ))}
        </group>

        {/* Tendon Neural Signal Pulse Nodes */}
        <group ref={pulsesGroupRef}>
          {curves.map((_, idx) => (
            <mesh key={idx} geometry={pulseGeo} material={pulseMat} />
          ))}
        </group>

        {/* Solar System Orbital Ring 1 + Glowing Satellite Nodes */}
        <group ref={orbit1Ref} rotation={[0.48, 0.22, 0]}>
          <mesh geometry={orbitGeo1} material={orbitMat1} />
          {/* Satellite Node A */}
          <group position={[1.34, 0, 0]}>
            <mesh geometry={satGeo} material={satMat} />
            <mesh geometry={haloGeo} material={haloMat} />
          </group>
          {/* Satellite Node B */}
          <group position={[-1.34, 0, 0]}>
            <mesh geometry={satGeo} material={satAccentMat} />
            <mesh geometry={haloGeo} material={accentHaloMat} />
          </group>
        </group>

        {/* Solar System Orbital Ring 2 + Glowing Satellite Nodes */}
        <group ref={orbit2Ref} rotation={[-0.55, 0.4, 0.3]}>
          <mesh geometry={orbitGeo2} material={orbitMat2} />
          {/* Satellite Node C */}
          <group position={[0, 1.72, 0]}>
            <mesh geometry={satGeo} material={satMat} />
            <mesh geometry={haloGeo} material={haloMat} />
          </group>
          {/* Satellite Node D */}
          <group position={[0, -1.72, 0]}>
            <mesh geometry={satGeo} material={satAccentMat} />
            <mesh geometry={haloGeo} material={accentHaloMat} />
          </group>
        </group>

        {/* Solar System Orbital Ring 3 + Glowing Satellite Node */}
        <group ref={orbit3Ref} rotation={[0.25, -0.6, 0.15]}>
          <mesh geometry={orbitGeo3} material={orbitMat3} />
          {/* Satellite Node E */}
          <group position={[2.12, 0, 0]}>
            <mesh geometry={satGeo} material={satAccentMat} />
            <mesh geometry={haloGeo} material={accentHaloMat} />
          </group>
        </group>

        {/* Floating Illuminated Liquid Glass Sparkles / Pearls */}
        <group ref={pearlsGroupRef}>
          {pearlData.map((_, idx) => (
            <mesh key={idx} geometry={pearlGeo} material={pearlMat} />
          ))}
        </group>

        {/* Telemetry Ring 4 (Equatorial plane alignment) */}
        <group ref={orbit4Ref} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={orbitGeo4} material={orbitMat4} />
        </group>
      </group>

      {/* Dispersed Star Field: small twinkling stars expanding when crossing dial */}
      <points ref={starPointsRef} geometry={starGeo} material={starMat} />
    </group>
  );
}
