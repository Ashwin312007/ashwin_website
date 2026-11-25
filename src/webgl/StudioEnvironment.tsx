"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function StudioEnvironment() {
  return (
    <>
      <Environment resolution={256} frames={1}>
        {/* Dark studio void ensures chrome reflections stay near-black outside sculpted strips */}
        <color attach="background" args={["#040507"]} />
        <Lightformer
          form="rect"
          intensity={1.35}
          color="#ffffff"
          position={[0, 6, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 2.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.32}
          color="#e5e7eb"
          position={[-0.8, 3.0, 5.5]}
          rotation={[0.45, -0.15, 0]}
          scale={[4.2, 1.3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.05}
          color="#dbeafe"
          position={[-6, 1.2, 1.5]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[4.5, 5, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.85}
          color="#f5f5f5"
          position={[6, 1.5, 0.5]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[4, 4.5, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.45}
          color="#e5e7eb"
          position={[0, -5, -1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[6, 6, 1]}
        />
      </Environment>

      <directionalLight position={[3, 4, 2]} intensity={0.45} color="#ffffff" />
    </>
  );
}
