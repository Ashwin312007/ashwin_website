"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PresentationControls,
  Float,
  ContactShadows,
  Sparkles,
  Edges,
  PerspectiveCamera
} from "@react-three/drei";
import * as THREE from "three";
import { Sparkles as SparklesIcon } from "lucide-react";

/**
 * Biomimetic Kinetic Core with 3 rotating gimbal rings,
 * pulsating LED biomimicry core, and outer transparent capsule.
 */
function BiomimeticCore() {
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Concentric gimbal rotation on orthogonal axes
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.6;
      outerRingRef.current.rotation.y = Math.sin(t * 0.4) * 0.35;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y -= delta * 0.85;
      midRingRef.current.rotation.z = Math.cos(t * 0.5) * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 1.1;
      innerRingRef.current.rotation.x = Math.sin(t * 0.7) * 0.25;
    }

    // Pulsating central bio-emerald/cyan LED core
    if (coreRef.current) {
      const pulse = Math.sin(t * 3.2);
      const scale = 1 + pulse * 0.08;
      coreRef.current.scale.set(scale, scale, scale);

      // Color transition between bio-emerald (#34d399) and cyber-cyan (#38bdf8)
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.2 + pulse * 0.6;
      }
    }

    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 3.2) * 1.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Protective Translucent Shell with Blueprint Edges */}
      <mesh>
        <capsuleGeometry args={[1.45, 0.45, 16, 32]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.32}
          roughness={0.12}
          metalness={0.1}
          transmission={0.85}
          ior={1.4}
          thickness={0.8}
          color="#c8e8ff"
          wireframe={false}
        />
        <Edges
          threshold={25}
          color="#38bdf8"
          scale={1.002}
          renderOrder={1}
        />
      </mesh>

      {/* Gimbal Ring 1 (Outer - Titanium with Edge Accents) */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[1.25, 0.038, 16, 64]} />
          <meshStandardMaterial
            metalness={0.92}
            roughness={0.2}
            color="#94a3b8"
            envMapIntensity={1.2}
          />
          <Edges color="#60a5fa" threshold={15} />
        </mesh>
        {/* Optical tracker nodes */}
        <mesh position={[1.25, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
        </mesh>
        <mesh position={[-1.25, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Gimbal Ring 2 (Middle - Dark Aerospace Alloy) */}
      <group ref={midRingRef}>
        <mesh>
          <torusGeometry args={[1.0, 0.035, 16, 64]} />
          <meshStandardMaterial
            metalness={0.95}
            roughness={0.25}
            color="#64748b"
          />
          <Edges color="#34d399" threshold={15} />
        </mesh>
        {/* Bio-feedback nodes */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0, -1.0, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={2} />
        </mesh>
      </group>

      {/* Gimbal Ring 3 (Inner - Precision High-Torque Ring) */}
      <group ref={innerRingRef}>
        <mesh>
          <torusGeometry args={[0.74, 0.032, 16, 64]} />
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.15}
            color="#cbd5e1"
          />
          <Edges color="#38bdf8" threshold={15} />
        </mesh>
      </group>

      {/* Central Pulsating Biomimetic LED Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.42, 2]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#34d399"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.4}
        />
        <Edges color="#a7f3d0" threshold={10} />
      </mesh>

      {/* Internal point illumination syncing with pulse */}
      <pointLight ref={lightRef} color="#34d399" distance={4} decay={2} intensity={2.8} />
      <pointLight color="#38bdf8" distance={3.5} decay={2} intensity={2.0} position={[0, 0.5, 0]} />
    </group>
  );
}

export function Hero3DScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="hero-3d-card" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "var(--subtle)" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "2px solid rgba(56, 189, 248, 0.2)",
              borderTopColor: "#38bdf8",
              animation: "spin 1s linear infinite"
            }}
          />
          <span style={{ fontSize: 12, fontFamily: "var(--font-jetbrains-mono), monospace" }}>
            Initializing WebGL Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-3d-card" aria-label="Interactive 3D Biomimetic Core Model">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={45} />

        {/* Cinematic Spatial Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={1.6} color="#f0fdf4" />
        <directionalLight position={[-4, -3, -3]} intensity={1.2} color="#0284c7" />
        <pointLight position={[0, 3, 2]} intensity={1.0} color="#38bdf8" />

        <PresentationControls
          global
          cursor={true}
          snap={true}
          speed={1.5}
          damping={0.15}
          rotation={[0, 0.35, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
        >
          <Float speed={2.0} rotationIntensity={0.6} floatIntensity={1.0}>
            <BiomimeticCore />
          </Float>
        </PresentationControls>

        {/* Ambient Grounding Shadow */}
        <ContactShadows
          position={[0, -2.0, 0]}
          opacity={0.65}
          scale={5.5}
          blur={2.4}
          far={3.5}
          color="#0369a1"
        />

        {/* Ambient Floating Micro-Particles */}
        <Sparkles
          count={26}
          scale={3.6}
          size={2.4}
          speed={0.45}
          color="#38bdf8"
          opacity={0.7}
        />
      </Canvas>

      {/* Spatial Glass Interaction Badge */}
      <div className="hero-3d-badge">
        <SparklesIcon size={12} className="highlight-emerald" aria-hidden="true" />
        <span>Interactive 3D Core · Drag to rotate</span>
      </div>
    </div>
  );
}
