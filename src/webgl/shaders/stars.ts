export const STAR_VERTEX_SHADER = /* glsl */ `
attribute float aSize;
attribute float aSeed;

uniform float uTime;
uniform float uPixelRatio;
uniform float uVel;
uniform float uStretch;
uniform float uOpacity;

varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float safeZ = max(-mvPosition.z, 0.25);
  float stretchScale = 1.0 + uStretch * 2.2;
  float velScale = 1.0 + min(uVel, 120.0) * 0.004;
  gl_PointSize = clamp(aSize * uPixelRatio * (8.0 / safeZ) * velScale * stretchScale, 0.5, 42.0);

  float twinkle = 0.35 + 0.65 * abs(sin(uTime * (0.6 + aSeed * 1.4) + aSeed * 40.0));
  vAlpha = twinkle * uOpacity;
}
`;

export const STAR_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform float uStretch;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  // Compress vertical axis of point sprite to stretch points into horizontal velocity streaks
  c.y *= 1.0 + uStretch * 4.0;
  float d = length(c);
  float mask = smoothstep(0.5, 0.08, d);
  if (mask <= 0.002) {
    discard;
  }
  gl_FragColor = vec4(vec3(0.96), mask * vAlpha);
}
`;
