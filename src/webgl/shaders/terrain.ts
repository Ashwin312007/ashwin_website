import { BARY_EDGE_GLSL } from "./core";
import { NOISE_GLSL } from "./noise";

export const TERRAIN_VERTEX_SHADER = /* glsl */ `
attribute vec3 aBary;

uniform float uTime;
uniform float uNoiseAmp;

varying vec3 vBary;
varying vec3 vNormalView;
varying vec3 vLocalPos;

${NOISE_GLSL}

void main() {
  float n = fbm(normal * 2.2 + vec3(uTime * 0.05));
  vec3 displaced = position + normal * n * uNoiseAmp;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  vBary = aBary;
  vNormalView = normalize(normalMatrix * normal);
  vLocalPos = position;
}
`;

export const TERRAIN_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec3 uColorDark;
uniform vec3 uColorLight;
uniform float uOpacity;

varying vec3 vBary;
varying vec3 vNormalView;
varying vec3 vLocalPos;

${BARY_EDGE_GLSL}

void main() {
  float edge = barycentricEdge(vBary, 1.0);
  float rimFactor = 0.25 + 0.75 * smoothstep(-0.2, 1.0, vNormalView.y);
  vec3 col = mix(uColorDark, uColorLight, edge * rimFactor);

  // Fade alpha cleanly toward the base horizon of the hemisphere
  float horizonFade = smoothstep(0.0, 0.95, vLocalPos.y);
  float alpha = edge * horizonFade * uOpacity;
  if (alpha <= 0.004) {
    discard;
  }

  gl_FragColor = vec4(col, alpha);
}
`;
