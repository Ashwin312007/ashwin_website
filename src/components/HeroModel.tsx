"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export function HeroModel() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    const time = elapsed.current;

    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.2;
      coreRef.current.rotation.y = time * 0.3;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z = time * 0.1;
      ringsRef.current.rotation.x = time * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        {/* Core Geometry */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color="#00ffcc"
            emissive="#0066ff"
            emissiveIntensity={0.5}
            wireframe
            distort={0.3}
            speed={2}
          />
        </mesh>

        {/* Inner solid core */}
        <mesh>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#0a0f14" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Surrounding robotic rings */}
        <group ref={ringsRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.5, 0.02, 16, 100]} />
            <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[3, 0.02, 16, 100]} />
            <meshBasicMaterial color="#0066ff" transparent opacity={0.5} />
          </mesh>
        </group>
        
        {/* Decorative Lines representing sensors/connections */}
        <Line
          points={[[0, 0, 0], [4, 2, -2]]}
          color="#ffffff"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
        <Line
          points={[[0, 0, 0], [-3, -2, 1]]}
          color="#ffffff"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      </Float>
    </group>
  );
}
