import { NOISE_GLSL } from "./noise";

export const RIBBON_VERTEX_SHADER = /* glsl */ `
void main() {
  gl_Position = vec4(position.xy, 0.999, 1.0);
}
`;

export function buildRibbonFragmentShader(lowTier: boolean): string {
  const warpExpr = lowTier
    ? `vec2 q = vec2(
        snoise(vec3(p * 0.7, uTime * 0.025)),
        snoise(vec3(p * 0.7 + 5.2, uTime * 0.025))
      );`
    : `vec2 q = vec2(
        fbm(vec3(p * 0.7, uTime * 0.025)),
        fbm(vec3(p * 0.7 + 5.2, uTime * 0.025))
      );`;

  return /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScroll;
uniform float uIntensity;
uniform float uLight;
uniform vec2 uRes;
uniform vec2 uPointer;

${NOISE_GLSL}

void main() {
  vec2 safeRes = max(uRes, vec2(1.0));
  vec2 uv = (gl_FragCoord.xy - 0.5 * safeRes) / safeRes.y;
  vec2 p = uv * 1.25 + uPointer * 0.06;

  // Domain warp for organic diagonal silk ribbons
  ${warpExpr}
  p += q * 0.55;

  float field = p.x * 1.05 + p.y * 0.55 + 0.45 * sin(p.y * 1.4 + uTime * 0.04 + uScroll * 3.0);
  float bands = field * 2.2;
  float f = fract(bands);
  float d = min(f, 1.0 - f);
  float id = floor(bands);

  float vis = smoothstep(-0.2, 0.6, snoise(vec3(id * 1.7, p.y * 0.35, uTime * 0.02)));
  float body = exp(-pow(d / 0.16, 2.0)) * 0.10;
  float rim = exp(-pow((d - 0.16) / 0.035, 2.0));
  float core = exp(-pow(d / 0.02, 2.0)) * 0.08;

  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + d * 5.0 + id * 0.17 + uTime * 0.01));
  float edgeMask = smoothstep(0.25, 0.95, length(uv * vec2(0.8, 1.1)));

  vec3 col = vec3(0.039);
  col += vis * (body + core) * vec3(0.9);
  col += vis * rim * mix(vec3(0.16), irid * 0.35, edgeMask);
  col *= uIntensity;

  // Optional subtle light-surface lift when wipe is inactive
  col = mix(col, vec3(0.93) - col * 0.2, uLight);

  // Subtle film grain + radial vignette
  float g = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.018;
  col *= 1.0 - 0.35 * dot(uv * 0.9, uv * 0.9);

  // Convert perceptual sRGB target values to linear for HalfFloat EffectComposer
  vec3 linearCol = pow(max(col, vec3(0.0)), vec3(2.2));
  gl_FragColor = vec4(linearCol, 1.0);
}
`;
}

export const RIBBON_FRAGMENT_HIGH = buildRibbonFragmentShader(false);
export const RIBBON_FRAGMENT_LOW = buildRibbonFragmentShader(true);
