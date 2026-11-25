import * as THREE from "three";
import {
  CORE_BEGIN_NORMAL_GLSL,
  CORE_BEGIN_VERTEX_GLSL,
  CORE_DEFAULT_PARAMS,
  CORE_DITHER_FRAGMENT_GLSL,
  CORE_FRAGMENT_COMMON_GLSL,
  CORE_VERTEX_COMMON_GLSL,
} from "../shaders/core";

export interface TriangleDitherUniforms {
  uTime: THREE.IUniform<number>;
  uWave: THREE.IUniform<number>;
  uNoiseAmp: THREE.IUniform<number>;
  uPointerDir: THREE.IUniform<THREE.Vector3>;
  uPointerAmt: THREE.IUniform<number>;
  uVel: THREE.IUniform<number>;
  uWireMin: THREE.IUniform<number>;
  uWireMax: THREE.IUniform<number>;
  uDarkFloor: THREE.IUniform<number>;
}

export interface TriangleDitherMaterialBundle {
  material: THREE.MeshPhysicalMaterial;
  uniforms: TriangleDitherUniforms;
}

export function createTriangleDitherMaterial(): TriangleDitherMaterialBundle {
  const uniforms: TriangleDitherUniforms = {
    uTime: { value: 0 },
    uWave: { value: CORE_DEFAULT_PARAMS.wave },
    uNoiseAmp: { value: CORE_DEFAULT_PARAMS.noiseAmp },
    uPointerDir: { value: new THREE.Vector3(0, 0, 1) },
    uPointerAmt: { value: 0 },
    uVel: { value: 0 },
    uWireMin: { value: CORE_DEFAULT_PARAMS.wireMin },
    uWireMax: { value: CORE_DEFAULT_PARAMS.wireMax },
    uDarkFloor: { value: CORE_DEFAULT_PARAMS.darkFloor },
  };

  const material = new THREE.MeshPhysicalMaterial({
    color: "#d9d9d9",
    metalness: 1,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.35,
    iridescenceIOR: 1.3,
    envMapIntensity: 1.4,
    side: THREE.DoubleSide,
  });

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${CORE_VERTEX_COMMON_GLSL}`)
      .replace("#include <beginnormal_vertex>", CORE_BEGIN_NORMAL_GLSL)
      .replace("#include <begin_vertex>", CORE_BEGIN_VERTEX_GLSL);

    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${CORE_FRAGMENT_COMMON_GLSL}`)
      .replace("#include <dithering_fragment>", CORE_DITHER_FRAGMENT_GLSL);
  };

  material.customProgramCacheKey = () => "triangle-dither-v1";

  return { material, uniforms };
}
