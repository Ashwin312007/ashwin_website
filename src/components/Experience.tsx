"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

import { HeroModel } from "./HeroModel";
import { PointCloud } from "./PointCloud";
import { CameraRig } from "./CameraRig";

export function Experience() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <HeroModel />
        <PointCloud />
        <CameraRig />
        
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.5} 
          />
          <Noise 
            premultiply 
            blendFunction={BlendFunction.ADD} 
            opacity={0.15} 
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.002, 0.002)}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
