"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  
  void main() {
    vColor = color;
    vec3 pos = position;
    
    // Subtle wave motion to simulate scanning
    pos.y += sin(pos.x * 2.0 + uTime) * 0.1;
    pos.x += cos(pos.z * 2.0 + uTime) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (30.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Circle shape for points
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if (ll > 0.5) discard;
    
    // Glow effect
    float alpha = (0.5 - ll) * 2.0;
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

// Simple seedable pseudo-random number generator to satisfy React's purity requirements
function createRandom(seed: number) {
  let m_w = 123456789;
  let m_z = 987654321;
  const mask = 0xffffffff;

  m_w = (m_w + seed) & mask;
  m_z = (m_z + seed) & mask;

  return function() {
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    let result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
  };
}

export function PointCloud() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const count = 15000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorA = new THREE.Color("#00ffcc");
    const colorB = new THREE.Color("#0066ff");
    
    const random = createRandom(42); // Deterministic random
    
    for (let i = 0; i < count; i++) {
      const radius = 4 + random() * 2;
      const theta = random() * Math.PI * 2;
      const y = (random() - 0.5) * 10;
      
      let x, z;
      if (random() > 0.3) {
        x = Math.cos(theta) * radius;
        z = Math.sin(theta) * radius;
      } else {
        x = (random() - 0.5) * 10;
        z = (random() - 0.5) * 10;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      const mixedColor = colorA.clone().lerp(colorB, random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
      
      sizes[i] = random() * 2.0;
    }
    
    return { positions, colors, sizes };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    const time = elapsed.current;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = time;
    }
  });

  return (
    <group position={[0, -5, -20]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
