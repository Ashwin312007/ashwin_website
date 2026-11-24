"use client";

import { useEffect, useMemo, useRef } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function disposeGroupResources(root: THREE.Object3D): void {
  const resources = new Set<{ dispose: () => void }>();
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      if (obj.geometry) resources.add(obj.geometry);
      if (Array.isArray(obj.material)) {
        for (const mat of obj.material) {
          if (mat) resources.add(mat);
        }
      } else if (obj.material) {
        resources.add(obj.material);
      }
    }
  });
  for (const res of resources) {
    res.dispose();
  }
}

export function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const anchorRef = useRef<THREE.Group>(null);

  const { roomGroup, pmremTarget } = useMemo(() => {
    const roomEnv = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const target = pmrem.fromScene(roomEnv, 0.04);
    pmrem.dispose();

    const group = new THREE.Group();
    group.name = "RoomEnvironmentGroup";
    group.position.copy(roomEnv.position);
    while (roomEnv.children.length > 0) {
      group.add(roomEnv.children[0]);
    }
    roomEnv.dispose();

    return { roomGroup: group, pmremTarget: target };
  }, [gl]);

  useEffect(() => {
    let node: THREE.Object3D | null = anchorRef.current;
    while (node?.parent) {
      node = node.parent;
    }
    if (node instanceof THREE.Scene && !node.environment) {
      node.environment = pmremTarget.texture;
    }

    return () => {
      disposeGroupResources(roomGroup);
      pmremTarget.dispose();
    };
  }, [roomGroup, pmremTarget]);

  return (
    <>
      <group ref={anchorRef} />
      <Environment resolution={256} frames={1}>
        <primitive object={roomGroup} />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffffff"
          position={[0, 6, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#dbeafe"
          position={[-6, 1, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#f5f5f5"
          position={[6, 2, 1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[6, 6, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.9}
          color="#e5e7eb"
          position={[0, -4, -3]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[8, 8, 1]}
        />
      </Environment>

      <directionalLight position={[3, 4, 2]} intensity={1.2} color="#ffffff" />
    </>
  );
}
