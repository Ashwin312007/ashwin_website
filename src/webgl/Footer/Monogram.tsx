"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { damp, lerp, smoothstep } from "@/lib/math";
import { EMBLEM_SVG_PATH, EMBLEM_VIEWBOX } from "@/lib/emblemPath";
import { useAppStore } from "@/store/useAppStore";

function createMonogramGeometry(): THREE.BufferGeometry {
  if (typeof DOMParser === "undefined") {
    return new THREE.BoxGeometry(0.1, 0.1, 0.1);
  }

  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${EMBLEM_VIEWBOX}"><path d="${EMBLEM_SVG_PATH}" fill="#ffffff" /></svg>`;
  const loader = new SVGLoader();
  const parsed = loader.parse(svgMarkup);

  const worldShapes: THREE.Shape[] = [];
  const scale = 0.02;

  for (const shapePath of parsed.paths) {
    const shapes = shapePath.toShapes();
    for (const shape of shapes) {
      const outerPts = shape
        .getPoints(1)
        .map((pt) => new THREE.Vector2((pt.x - 50) * scale, (50 - pt.y) * scale));
      if (outerPts.length < 3) continue;

      const worldShape = new THREE.Shape(outerPts);
      for (const hole of shape.holes) {
        const holePts = hole
          .getPoints(1)
          .map((pt) => new THREE.Vector2((pt.x - 50) * scale, (50 - pt.y) * scale));
        if (holePts.length >= 3) {
          worldShape.holes.push(new THREE.Path(holePts));
        }
      }
      worldShapes.push(worldShape);
    }
  }

  const geometry = new THREE.ExtrudeGeometry(worldShapes, {
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.05,
    bevelSegments: 8,
    curveSegments: 24,
  });

  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

export function Monogram() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => createMonogramGeometry(), []);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 1,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        iridescence: 0.6,
        iridescenceIOR: 1.35,
        iridescenceThicknessMinimum: 200,
        iridescenceThicknessMaximum: 600,
        envMapIntensity: 2,
      }),
    []
  );

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

  const animRef = useRef({
    spinY: 0,
    scale: 0,
    tiltX: 0,
    tiltY: 0,
  });

  useFrame((state, rawDelta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!group || !mesh) return;

    const delta = Math.min(rawDelta, 0.05);
    const { camera, pointer, reducedMotion, footerDomeProgress, wipe } =
      useAppStore.getState();

    const inFooter = camera.key === "footer";
    const inPrefooter = camera.key === "prefooter";
    const targetVisibility = inFooter
      ? 1
      : inPrefooter
        ? smoothstep(0.45, 1.0, camera.t)
        : footerDomeProgress > 0.55
          ? smoothstep(0.55, 0.95, footerDomeProgress)
          : 0;

    const anim = animRef.current;
    anim.scale = damp(
      anim.scale,
      targetVisibility * 0.72,
      reducedMotion ? 24 : 5,
      delta
    );

    group.visible = anim.scale > 0.005 && wipe.progress < 0.999;
    if (!group.visible) return;

    group.scale.setScalar(anim.scale);
    group.position.set(0, lerp(0.55, 0.92, targetVisibility), 2.4);

    if (!reducedMotion) {
      anim.spinY += delta * 0.28;
    }

    const storePtrActive = pointer.x !== 0 || pointer.y !== 0;
    const px = storePtrActive ? pointer.x : state.pointer.x;
    const py = storePtrActive ? pointer.y : state.pointer.y;

    const targetTiltX = reducedMotion ? 0 : -py * 0.3;
    const targetTiltY = reducedMotion ? 0 : px * 0.3;

    anim.tiltX = damp(anim.tiltX, targetTiltX, 6, delta);
    anim.tiltY = damp(anim.tiltY, targetTiltY, 6, delta);

    mesh.rotation.x = anim.tiltX;
    mesh.rotation.y = anim.spinY + anim.tiltY;
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
}
