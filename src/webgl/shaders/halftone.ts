export const HALFTONE_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const HALFTONE_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform sampler2D uTexture;
uniform float uMix;
uniform float uFade;
uniform float uCell;
uniform float uAspect;
uniform float uTexAspect;
uniform float uHasMouse;
uniform vec2 uMouse;

varying vec2 vUv;

const float HT_INV_SQRT3 = 0.57735026919;

vec2 coverUv(vec2 uv, float frameAspect, float texAspect) {
  vec2 res = uv;
  if (frameAspect > texAspect) {
    float s = texAspect / max(frameAspect, 0.001);
    res.y = (uv.y - 0.5) * s + 0.5;
  } else {
    float s = frameAspect / max(texAspect, 0.001);
    res.x = (uv.x - 0.5) * s + 0.5;
  }
  return clamp(res, 0.0, 1.0);
}

void main() {
  float safeAspect = max(uAspect, 0.01);
  float safeCell = max(uCell, 0.004);

  // Equilateral triangle lattice in aspect-corrected UV space
  vec2 p = vec2(vUv.x * safeAspect, vUv.y) / safeCell;
  vec2 s = vec2(p.x - p.y * HT_INV_SQRT3, p.y * 2.0 * HT_INV_SQRT3);
  vec2 i = floor(s);
  vec2 f = fract(s);

  bool up = f.x > f.y;
  vec3 b = up
    ? vec3(1.0 - f.x, f.y, f.x - f.y)
    : vec3(1.0 - f.y, f.x, f.y - f.x);

  vec2 cS = i + (up ? vec2(2.0 / 3.0, 1.0 / 3.0) : vec2(1.0 / 3.0, 2.0 / 3.0));
  vec2 cP = vec2(cS.x + (cS.y / (2.0 * HT_INV_SQRT3)) * HT_INV_SQRT3, cS.y / (2.0 * HT_INV_SQRT3)) * safeCell;
  vec2 cUv = clamp(vec2(cP.x / safeAspect, cP.y), 0.0, 1.0);

  vec3 cellSample = texture2D(uTexture, coverUv(cUv, safeAspect, uTexAspect)).rgb;
  vec3 photoSample = texture2D(uTexture, coverUv(vUv, safeAspect, uTexAspect)).rgb;

  float L = dot(cellSample, vec3(0.2126, 0.7152, 0.0722));
  float Lphoto = dot(photoSample, vec3(0.2126, 0.7152, 0.0722));

  float minBary = min(min(b.x, b.y), b.z);
  float threshold = (1.0 - clamp(L, 0.0, 1.0)) * 0.3334;
  float aa = max(fwidth(minBary), 0.004);
  float inside = smoothstep(threshold - aa, threshold + aa, minBary);

  // Halftone luminance against obsidian frame background (#0A0A0A)
  float halftoneGray = mix(0.003, mix(0.14, 0.96, L), inside);

  // Local cursor halo re-halftones photo within radius 0.18 in aspect-corrected space
  vec2 dMouse = vec2((vUv.x - uMouse.x) * safeAspect, vUv.y - uMouse.y);
  float h = uHasMouse * smoothstep(0.18, 0.0, length(dMouse));
  float mixLocal = clamp(uMix * (1.0 - h), 0.0, 1.0);

  float gray = mix(halftoneGray, Lphoto, mixLocal);
  gl_FragColor = vec4(vec3(gray) * uFade, uFade);
  #include <colorspace_fragment>
}
`;
