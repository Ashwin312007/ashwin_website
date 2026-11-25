import { NOISE_GLSL } from "./noise";

/**
 * Shared GLSL barycentric edge detector used by both PeristalticCore and TerrainDome.
 */
export const BARY_EDGE_GLSL = /* glsl */ `
float barycentricEdge(vec3 bary, float width) {
  vec3 fw = fwidth(bary);
  vec3 a = smoothstep(fw * (width - 0.5), fw * (width + 0.5), bary);
  return 1.0 - min(min(a.x, a.y), a.z);
}
`;

export const CORE_DEFAULT_PARAMS = {
  baseRadius: 1.25,
  wave: 1.0,
  noiseAmp: 0.03,
  wireMin: 0.15,
  wireMax: 1.6,
  darkFloor: 0.12,
} as const;

export const CORE_VERTEX_COMMON_GLSL = /* glsl */ `
attribute vec3 aBary;
varying vec3 vBary;
uniform float uTime;
uniform float uWave;
uniform float uNoiseAmp;
uniform float uPointerAmt;
uniform float uVel;
uniform vec3 uPointerDir;

${NOISE_GLSL}

float heightAt(vec3 n) {
  // Three metameric peristaltic rings travelling top-to-bottom (~2.4s period)
  float rings = 0.0;
  for (int i = 0; i < 3; i++) {
    float c = 0.75 - float(i) * 0.75;
    float phase = uTime * 2.6 - float(i) * 2.0943951;
    rings += exp(-pow((n.y - c) / 0.22, 2.0)) * (0.5 + 0.5 * sin(phase));
  }
  float wob = fbm(n * 1.6 + vec3(0.0, uTime * 0.12, 0.0));
  float dent = smoothstep(0.55, 1.0, dot(n, normalize(uPointerDir))) * uPointerAmt;
  float jitter = snoise(n * 9.0 + vec3(uTime * 3.0)) * uVel * 0.02;
  return rings * 0.085 * uWave + wob * uNoiseAmp - dent * 0.16 + jitter;
}

vec3 dispPos(vec3 p) {
  vec3 n = normalize(p);
  return n * (1.0 + heightAt(n));
}
`;

export const CORE_BEGIN_NORMAL_GLSL = /* glsl */ `
vec3 p0 = position;
vec3 nrm0 = normalize(p0);
vec3 upRef = abs(nrm0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
vec3 tng = normalize(cross(nrm0, upRef));
vec3 btg = normalize(cross(nrm0, tng));
float eps = 0.004;
vec3 c0 = dispPos(p0);
vec3 objectNormal = normalize(cross(dispPos(p0 + tng * eps) - c0, dispPos(p0 + btg * eps) - c0));
if (dot(objectNormal, nrm0) < 0.0) {
  objectNormal = -objectNormal;
}
#ifdef USE_TANGENT
  vec3 objectTangent = vec3(tangent.xyz);
#endif
`;

export const CORE_BEGIN_VERTEX_GLSL = /* glsl */ `
vec3 transformed = dispPos(position);
vBary = aBary;
`;

export const CORE_FRAGMENT_COMMON_GLSL = /* glsl */ `
varying vec3 vBary;
uniform float uWireMin;
uniform float uWireMax;
uniform float uDarkFloor;

${BARY_EDGE_GLSL}
`;

export const CORE_DITHER_FRAGMENT_GLSL = /* glsl */ `
float lum = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
float wireW = mix(uWireMin, uWireMax, smoothstep(0.03, 0.85, lum));
float edge = barycentricEdge(vBary, wireW);
vec3 shell = gl_FragColor.rgb * uDarkFloor + vec3(0.06);
vec3 wire = gl_FragColor.rgb * 1.8 + 0.12;
float rim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.0);
gl_FragColor.rgb = mix(shell, wire, edge * smoothstep(0.0, 0.05, lum)) + vec3(0.18) * rim;
#include <dithering_fragment>
`;
