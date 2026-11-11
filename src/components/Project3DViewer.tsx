"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Edges,
  Float,
  Center
} from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Box,
  Eye,
  SlidersHorizontal
} from "lucide-react";

interface Project3DViewerProps {
  model: "peristalsis" | "archerfish";
}

// -------------------------------------------------------------
// Model 1: Earthworm Peristaltic Soft Robot (4 Metameric Bellows)
// -------------------------------------------------------------
function PeristalsisRobotModel({
  wireframe,
  exploded,
  paused
}: {
  wireframe: boolean;
  exploded: boolean;
  paused: boolean;
}) {
  const segmentRefs = useRef<(THREE.Group | null)[]>([]);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!paused) {
      timeRef.current += delta;
    }
    const t = timeRef.current;

    // 4 Metameric Segments along X-axis
    segmentRefs.current.forEach((group, i) => {
      if (!group) return;

      const phase = i * (Math.PI / 2);
      // Sinusoidal radial expansion
      const radialWave = Math.sin(t * 3.5 - phase);
      const radialScale = 1 + 0.32 * radialWave;

      // Axial stroke displacement
      const axialStroke = Math.cos(t * 3.5 - phase) * 0.14;

      // Isochoric volume preservation: when radial expands, length contracts
      const axialScale = 1 / Math.sqrt(radialScale);

      const baseSpacing = exploded ? 1.5 : 0.88;
      const baseX = (i - 1.5) * baseSpacing;

      group.position.x = baseX + axialStroke;
      group.scale.set(axialScale, radialScale, radialScale);
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Transparent Conduit Pipe */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 5.8, 36, 1, true]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={0.16}
          roughness={0.15}
          metalness={0.1}
          transmission={0.85}
          thickness={0.5}
          side={THREE.DoubleSide}
          wireframe={wireframe}
        />
        <Edges threshold={25} color="#38bdf8" opacity={0.28} />
      </mesh>

      {/* 4 Compliant Peristaltic Metameric Bellows */}
      {[0, 1, 2, 3].map((idx) => (
        <group
          key={idx}
          ref={(el) => {
            segmentRefs.current[idx] = el;
          }}
        >
          {/* Main 95A TPU Bellows Shell */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.54, 0.54, 0.72, 32, 6]} />
            <meshStandardMaterial
              color={idx % 2 === 0 ? "#10b981" : "#0284c7"}
              emissive={idx % 2 === 0 ? "#059669" : "#0369a1"}
              emissiveIntensity={0.25}
              metalness={0.2}
              roughness={0.35}
              transparent
              opacity={0.88}
              wireframe={wireframe}
            />
            <Edges threshold={20} color={wireframe ? "#ffffff" : "#a7f3d0"} />
          </mesh>

          {/* Accordion Rib Corrugations */}
          {[-0.2, 0, 0.2].map((xOffset, rIdx) => (
            <mesh key={rIdx} position={[xOffset, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.58, 0.038, 16, 32]} />
              <meshStandardMaterial
                metalness={0.85}
                roughness={0.2}
                color="#cbd5e1"
                wireframe={wireframe}
              />
              <Edges threshold={15} color="#38bdf8" />
            </mesh>
          ))}

          {/* Tendon Capstan Guide Rings at segment boundaries */}
          <mesh position={[-0.36, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.56, 0.045, 16, 32]} />
            <meshStandardMaterial metalness={0.92} roughness={0.15} color="#94a3b8" />
          </mesh>
          <mesh position={[0.36, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.56, 0.045, 16, 32]} />
            <meshStandardMaterial metalness={0.92} roughness={0.15} color="#94a3b8" />
          </mesh>

          {/* Asymmetric Directional Micro-Setae Arrays (Biological Grip Fins) */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, setaIdx) => {
            const rad = 0.58;
            const y = Math.cos(angle) * rad;
            const z = Math.sin(angle) * rad;
            return (
              <mesh
                key={setaIdx}
                position={[0, y, z]}
                rotation={[angle, 0, -0.45]}
              >
                <coneGeometry args={[0.06, 0.22, 4]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#d97706"
                  emissiveIntensity={0.5}
                  metalness={0.7}
                  roughness={0.3}
                  wireframe={wireframe}
                />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Internal Tendon Cables passing through all segments */}
      {[0.32, -0.32].map((yOff, cableIdx) => (
        <mesh key={cableIdx} position={[0, yOff, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, exploded ? 6.2 : 3.8, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// -------------------------------------------------------------
// Model 2: Archerfish Variable-Aperture Nozzle & Kinetic Slug
// -------------------------------------------------------------
function ArcherfishNozzleModel({
  wireframe,
  exploded,
  paused,
  pulseTrigger
}: {
  wireframe: boolean;
  exploded: boolean;
  paused: boolean;
  pulseTrigger: number;
}) {
  const irisGroupRef = useRef<THREE.Group>(null);
  const slugRef = useRef<THREE.Mesh>(null);
  const jetStreamRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const pulseStartTimeRef = useRef<number>(0);
  const isPulsingRef = useRef(false);

  // Trigger pulse on pulseTrigger prop change
  useEffect(() => {
    if (pulseTrigger > 0) {
      isPulsingRef.current = true;
      pulseStartTimeRef.current = performance.now() / 1000;
    }
  }, [pulseTrigger]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Overhead edge-vision targeting LED blink
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.0 + Math.sin(t * 8) * 0.8;
      }
    }

    // Dynamic variable iris aperture modulation
    let apertureScale = 1.0;
    if (isPulsingRef.current) {
      const elapsed = performance.now() / 1000 - pulseStartTimeRef.current;
      const duration = 1.4;

      if (elapsed < duration) {
        // Fast millisecond constriction (<15ms phase) followed by dynamic recovery
        const p = elapsed / duration;
        if (p < 0.25) {
          // Sharp constriction
          apertureScale = 1.0 - (p / 0.25) * 0.65;
        } else {
          // Re-expansion with fluid dampening
          apertureScale = 0.35 + ((p - 0.25) / 0.75) * 0.65;
        }

        // Animate kinetic fluid slug emerging and coalescing
        if (slugRef.current) {
          slugRef.current.visible = true;
          const slugDist = (p * 4.2);
          slugRef.current.position.x = 1.25 + slugDist;

          // As it travels, it coalesces from dispersed stream into concentrated slug
          const coalesce = Math.min(1.0, p * 2.0);
          slugRef.current.scale.set(0.18 + coalesce * 0.12, 0.16, 0.16);
        }

        if (jetStreamRef.current) {
          jetStreamRef.current.visible = true;
          jetStreamRef.current.scale.set(Math.min(1, p * 3), 1, 1);
        }
      } else {
        isPulsingRef.current = false;
        if (slugRef.current) slugRef.current.visible = false;
        if (jetStreamRef.current) jetStreamRef.current.visible = false;
      }
    } else if (!paused) {
      // Gentle cyclic breathing preview when not firing
      apertureScale = 0.85 + Math.sin(t * 2.5) * 0.15;
      if (slugRef.current) slugRef.current.visible = false;
      if (jetStreamRef.current) jetStreamRef.current.visible = false;
    }

    if (irisGroupRef.current) {
      irisGroupRef.current.scale.set(1, apertureScale, apertureScale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Base Flange & Hydraulic Inlet Manifold */}
      <mesh
        position={[exploded ? -1.8 : -1.1, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.78, 0.78, 0.45, 32]} />
        <meshStandardMaterial
          metalness={0.92}
          roughness={0.2}
          color="#334155"
          wireframe={wireframe}
        />
        <Edges threshold={20} color="#64748b" />
      </mesh>

      {/* Voice-Coil Fast-Servo Actuator Housing */}
      <group position={[exploded ? -0.8 : -0.5, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.72, 0.72, 0.65, 32]} />
          <meshStandardMaterial
            metalness={0.88}
            roughness={0.25}
            color="#1e293b"
            wireframe={wireframe}
          />
          <Edges threshold={20} color="#38bdf8" />
        </mesh>
        {/* Electromagnetic coil winding reveal */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.74, 0.04, 16, 32]} />
          <meshStandardMaterial
            metalness={0.7}
            roughness={0.3}
            color="#d97706"
            emissive="#b45309"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>

      {/* Main CNC-Machined Tapered Dark Titanium Nozzle Barrel */}
      <group position={[exploded ? 0.6 : 0.35, 0, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.68, 1.05, 32]} />
          <meshStandardMaterial
            metalness={0.95}
            roughness={0.16}
            color="#0f172a"
            wireframe={wireframe}
          />
          <Edges threshold={25} color="#38bdf8" />
        </mesh>

        {/* Overhead Edge-Vision Camera Module */}
        <group position={[0.0, 0.72, 0]}>
          <mesh>
            <boxGeometry args={[0.48, 0.32, 0.36]} />
            <meshStandardMaterial metalness={0.85} roughness={0.25} color="#1e293b" />
            <Edges color="#38bdf8" threshold={15} />
          </mesh>
          {/* Camera Lens */}
          <mesh position={[0.26, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 16]} />
            <meshStandardMaterial metalness={0.95} roughness={0.1} color="#0284c7" />
          </mesh>
          {/* Amber Visuomotor Targeting LED */}
          <mesh ref={ledRef} position={[0.26, 0.1, 0.1]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      </group>

      {/* Variable-Aperture Multi-Leaf Iris Ring */}
      <group
        ref={irisGroupRef}
        position={[exploded ? 1.45 : 0.9, 0, 0]}
      >
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.36, 0.045, 16, 32]} />
          <meshStandardMaterial metalness={0.95} roughness={0.15} color="#cbd5e1" />
          <Edges threshold={15} color="#34d399" />
        </mesh>

        {/* 6 Overlapping Iris Aperture Blades */}
        {[0, 1, 2, 3, 4, 5].map((bladeIdx) => {
          const angle = (bladeIdx * Math.PI) / 3;
          return (
            <mesh
              key={bladeIdx}
              position={[0, Math.cos(angle) * 0.22, Math.sin(angle) * 0.22]}
              rotation={[angle, 0, 0.25]}
            >
              <boxGeometry args={[0.04, 0.22, 0.12]} />
              <meshStandardMaterial
                metalness={0.96}
                roughness={0.12}
                color="#64748b"
                wireframe={wireframe}
              />
              <Edges color="#34d399" threshold={20} />
            </mesh>
          );
        })}
      </group>

      {/* Pulsed High-Speed Hydrodynamic Stream */}
      <group ref={jetStreamRef} position={[0.95, 0, 0]} visible={false}>
        <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.12, 1.2, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={2.0}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Kinetic Water Droplet Slug Coalescing at Distance */}
      <mesh ref={slugRef} position={[1.4, 0, 0]} visible={false}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={2.5}
          metalness={0.1}
          roughness={0.1}
          transparent
          opacity={0.88}
        />
        <pointLight color="#38bdf8" distance={2.5} intensity={3.0} />
      </mesh>
    </group>
  );
}

// -------------------------------------------------------------
// Camera Reset Helper
// -------------------------------------------------------------
function CameraController({ resetKey }: { resetKey: number }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (resetKey > 0 && controlsRef.current) {
      camera.position.set(3.4, 2.2, 4.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetKey, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={1.8}
      maxDistance={9.0}
    />
  );
}

// -------------------------------------------------------------
// Main Exported Component: Project3DViewer
// -------------------------------------------------------------
export function Project3DViewer({ model }: Project3DViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const handlePulse = () => {
    setPulseCount((prev) => prev + 1);
  };

  const handleResetCamera = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="viewer-3d-container" aria-label="Interactive 3D CAD/Robotics Inspector">
      {/* Spatial Overlay Toolbar */}
      <div className="viewer-3d-toolbar" role="toolbar" aria-label="3D Inspector Controls">
        <button
          className={`viewer-3d-btn ${wireframe ? "active" : ""}`}
          onClick={() => setWireframe(!wireframe)}
          title="Toggle CAD Topology Wireframe"
        >
          <Layers size={13} aria-hidden="true" />
          {wireframe ? "Solid Mesh" : "Wireframe"}
        </button>

        <button
          className={`viewer-3d-btn ${exploded ? "active" : ""}`}
          onClick={() => setExploded(!exploded)}
          title="Toggle Exploded Assembly View"
        >
          <Box size={13} aria-hidden="true" />
          {exploded ? "Assembled" : "Exploded"}
        </button>

        <button
          className={`viewer-3d-btn ${paused ? "active" : ""}`}
          onClick={() => setPaused(!paused)}
          title="Pause or Resume Kinematics Motion"
        >
          {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          {paused ? "Resume" : "Pause"}
        </button>

        {model === "archerfish" && (
          <button
            className="viewer-3d-btn pulse-active"
            onClick={handlePulse}
            title="Fire Hydrodynamic Pressure Transient & Dynamic Iris Pulse"
          >
            <Zap size={13} aria-hidden="true" />
            Fire Pulse
          </button>
        )}

        <button
          className="viewer-3d-btn"
          onClick={handleResetCamera}
          title="Reset Camera Orientation & Zoom"
        >
          <RotateCcw size={13} aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Bottom Status & Navigation Hint */}
      <div className="viewer-3d-hint">
        <span>Orbit: Left-drag · Pan: Right-drag · Zoom: Scroll</span>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="viewer-3d-canvas-wrap">
        <Canvas
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
        >
          <PerspectiveCamera makeDefault position={[3.4, 2.2, 4.2]} fov={45} />
          <CameraController resetKey={resetKey} />

          {/* Cinematic Studio Rig Lighting */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 8, 6]} intensity={1.8} color="#f8fafc" />
          <directionalLight position={[-6, -4, -4]} intensity={1.1} color="#0284c7" />
          <pointLight position={[0, 4, 0]} intensity={1.5} color="#38bdf8" />
          <pointLight position={[0, -2, 2]} intensity={1.0} color="#34d399" />

          {/* Ground Calibration Grid */}
          <Grid
            position={[0, -1.5, 0]}
            args={[10, 10]}
            cellSize={0.25}
            sectionSize={1.0}
            cellColor="#1e293b"
            sectionColor="#38bdf8"
            fadeDistance={7.5}
            fadeStrength={1.5}
          />

          {/* Centered Procedural 3D Model with Subtle Float */}
          <Float
            speed={paused ? 0 : 1.2}
            rotationIntensity={exploded ? 0 : 0.15}
            floatIntensity={exploded ? 0 : 0.25}
          >
            <Center>
              {model === "peristalsis" ? (
                <PeristalsisRobotModel
                  wireframe={wireframe}
                  exploded={exploded}
                  paused={paused}
                />
              ) : (
                <ArcherfishNozzleModel
                  wireframe={wireframe}
                  exploded={exploded}
                  paused={paused}
                  pulseTrigger={pulseCount}
                />
              )}
            </Center>
          </Float>

          {/* Interactive XYZ Orientation Gizmo */}
          <GizmoHelper alignment="top-right" margin={[65, 65]}>
            <GizmoViewport
              axisColors={["#f87171", "#4ade80", "#60a5fa"]}
              labelColor="#edf2fa"
            />
          </GizmoHelper>
        </Canvas>
      </div>
    </div>
  );
}
