import { NOISE_GLSL } from "./noise";

/**
 * Postprocessing Effect fragment shader for the equilateral triangle-lattice wipe
 * transitioning between dark 3D world and light silk surface.
 */
export const TRIANGLE_WIPE_FRAG = /* glsl */ `
uniform float uProgress;
uniform float uCell;
uniform float uTime;
uniform vec2 uOrigin;
uniform vec2 uRes;

${NOISE_GLSL}

const float WIPE_INV_SQRT3 = 0.57735026919;

float wipeHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 wipeSilk(vec2 uv) {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = uv * vec2(aspect, 1.0) * 1.4;
  float v = sin(p.x * 2.0 + p.y * 1.2 + 1.8 * snoise(vec3(p * 0.6, uTime * 0.03)));
  v = 0.5 + 0.5 * v;
  v = smoothstep(0.1, 0.95, v);
  // Linear RGB corresponding to perceptual #E9E9E9 -> #FAFAFA silk folds
  return mix(vec3(0.82), vec3(0.96), v);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (uProgress <= 0.0001) {
    outputColor = inputColor;
    return;
  }

  vec2 safeRes = max(uRes, vec2(1.0));
  float safeCell = max(uCell, 2.0);
  float aspect = safeRes.x / safeRes.y;

  vec2 px = uv * safeRes / safeCell;
  vec2 s = vec2(px.x - px.y * WIPE_INV_SQRT3, px.y * 2.0 * WIPE_INV_SQRT3);
  vec2 i = floor(s);
  vec2 f = fract(s);

  bool up = f.x > f.y;
  vec3 b = up
    ? vec3(1.0 - f.x, f.y, f.x - f.y)
    : vec3(1.0 - f.y, f.x, f.y - f.x);

  vec2 cS = i + (up ? vec2(2.0 / 3.0, 1.0 / 3.0) : vec2(1.0 / 3.0, 2.0 / 3.0));
  vec2 cPx = vec2(cS.x + (cS.y / (2.0 * WIPE_INV_SQRT3)) * WIPE_INV_SQRT3, cS.y / (2.0 * WIPE_INV_SQRT3)) * safeCell;
  vec2 cUv = cPx / safeRes;

  vec2 farCorner = max(uOrigin, 1.0 - uOrigin) * vec2(aspect, 1.0);
  float maxDist = max(length(farCorner), 0.5);
  float dist = length((cUv - uOrigin) * vec2(aspect, 1.0)) / maxDist;

  float t = dist * 0.82 + wipeHash(i + (up ? 0.5 : 0.0)) * 0.18;
  float prog = uProgress * 1.08;
  float state = smoothstep(t, t + 0.06, prog);

  float minB = min(min(b.x, b.y), b.z);
  float fill = step((1.0 - state) * 0.3334, minB);
  float front = smoothstep(t - 0.05, t, prog) * (1.0 - state);
  float outline = front * (1.0 - smoothstep(0.0, 0.04, minB));

  vec3 light = wipeSilk(uv);
  vec3 col = mix(inputColor.rgb, light, fill);
  col = mix(col, vec3(1.0), outline * 0.9);
  outputColor = vec4(col, inputColor.a);
}
`;
