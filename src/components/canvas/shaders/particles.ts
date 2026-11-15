export const PARTICLE_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  attribute float aScale;
  attribute float aPhase;
  attribute float aSpeed;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vProximity;
  varying float vPhase;

  void main() {
    vPhase = aPhase;
    vec3 pos = position;

    // Harmonious orbital and breathing drift per particle
    float speed = 0.22 + aSpeed * 0.16;
    pos.x += cos(uTime * speed + aPhase) * 0.18;
    pos.y += sin(uTime * (speed * 1.15) + aPhase * 1.3) * 0.22;
    pos.z += sin(uTime * (speed * 0.85) + aPhase * 0.7) * 0.16;

    // Smooth continuous scroll progression drift without pop-in jumps
    pos.y -= uScroll * 3.5;

    // Mouse parallax proportional to particle depth and scale
    pos.x += uMouse.x * (0.32 + aScale * 0.22);
    pos.y += uMouse.y * (0.26 + aScale * 0.18);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Smooth proximity response to mouse cursor
    vec2 viewXY = mvPosition.xy / max(-mvPosition.z * 0.45, 1.0);
    float distToMouse = distance(viewXY * 0.72, uMouse);
    vProximity = smoothstep(1.25, 0.0, distToMouse);

    // Alpha modulated by soft sinus breathing and mouse proximity
    float pulse = 0.5 + 0.5 * sin(uTime * 1.25 + aPhase);
    vAlpha = (0.16 + pulse * 0.14) + vProximity * 0.52;

    // Safe point size: protects against near-plane division by zero and clamps to GPU limits
    float depthFactor = 1.0 / max(-mvPosition.z, 0.1);
    float targetSize = (aScale * 13.5 + vProximity * 12.0) * uPixelRatio * depthFactor;
    gl_PointSize = clamp(targetSize, 1.0, 52.0);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAccentMix;

  varying float vAlpha;
  varying float vProximity;
  varying float vPhase;

  void main() {
    // Distance from center of point (0.0 center, 0.5 circular boundary)
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distSq = dot(coord, coord);
    if (distSq > 0.25) {
      discard;
    }

    float d = sqrt(distSq) * 2.0; // 0.0 at center -> 1.0 at circumference
    // Smooth radial falloff
    float falloff = smoothstep(1.0, 0.06, d);
    // Luminous inner hotspot
    float core = smoothstep(0.42, 0.0, d) * 0.45;

    // Harmonize base celestial blue (#9bc1ff) with active project accent color
    vec3 mixedColor = mix(uColor, uAccent, clamp(uAccentMix + vProximity * 0.35, 0.0, 1.0));

    gl_FragColor = vec4(mixedColor, falloff * (vAlpha + core));
  }
`;
