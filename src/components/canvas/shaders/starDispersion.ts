export const STAR_DISPERSION_VERTEX_SHADER = /* glsl */ `
  precision highp float;

  attribute vec3 aOrigin;
  attribute vec3 aTarget;
  attribute vec3 aBurstVel;
  attribute vec3 aColor;
  attribute float aScale;
  attribute float aPhase;
  attribute float aSpeed;

  uniform float uDisperse;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  uniform vec3 uAccent;

  varying vec3 vColor;
  varying float vScale;
  varying float vPhase;
  varying float vAlpha;
  varying float vProximity;

  void main() {
    vColor = aColor;
    vScale = aScale;
    vPhase = aPhase;

    // 1) S-Curve interpolation between original model coordinate and bounded UI constellation target
    float t = smoothstep(0.0, 1.0, uDisperse);
    vec3 basePos = mix(aOrigin, aTarget, t);

    // 2) Kinetic shockwave burst: outward explosive impulse that peaks at t=0.5 and decays to 0 at t=1.0
    float burst = sin(uDisperse * 3.14159265);
    vec3 burstOffset = aBurstVel * (burst * 1.05);

    // 3) Fluid harmonic cosmic drift: keeps the stars alive, gently floating and undulating in background
    float speed = 0.16 + aSpeed * 0.12;
    vec3 drift = vec3(
      sin(uTime * speed + aPhase) * 0.14,
      cos(uTime * (speed * 1.12) + aPhase * 1.3) * 0.11,
      sin(uTime * (speed * 0.88) + aPhase * 0.7) * 0.09
    ) * uDisperse;

    // 4) Interactive mouse repulsion: cursor gently deflects nearby stardust
    vec2 mouseWorld = uMouse * vec2(4.2, 2.4);
    float distToMouse = distance(basePos.xy, mouseWorld);
    float repelFactor = smoothstep(1.8, 0.0, distToMouse) * uDisperse;
    vProximity = repelFactor;
    vec2 repelDir = normalize(basePos.xy - mouseWorld + vec2(0.0001));
    vec3 mouseOffset = vec3(repelDir * repelFactor * 0.35, 0.0);

    vec3 worldPos = basePos + burstOffset + drift + mouseOffset;
    vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);

    // Depth attenuation and high-visibility twinkle
    float depthFactor = 1.0 / max(-mvPosition.z, 0.1);
    float twinkle = 0.85 + 0.22 * sin(uTime * (1.4 + aSpeed * 1.8) + aPhase);

    // Refined, delicate crystalline liquid glass stardust point size (reduced from oversized blobs)
    float targetSize = (aScale * 7.2 + vProximity * 3.5) * uPixelRatio * depthFactor * twinkle;
    gl_PointSize = clamp(targetSize, 1.5, 22.0);

    // Opacity: quickly ramps up as mechanical model dissolves, stays fully luminous across UI
    vAlpha = smoothstep(0.01, 0.16, uDisperse) * twinkle;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const STAR_DISPERSION_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3 uAccent;

  varying vec3 vColor;
  varying float vScale;
  varying float vPhase;
  varying float vAlpha;
  varying float vProximity;

  void main() {
    // Coordinate within point: (0.0, 0.0) at center, radius 0.5 at boundary
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord) * 2.0; // 0.0 at center, 1.0 at circumference
    if (dist > 1.0) {
      discard;
    }

    // 1) Optical Liquid Glass Caustic Droplet Profile
    // Intense core specular hotspot (refracted light focus)
    float coreSpecular = exp(-dist * dist * 10.0) * 1.6;
    // Internal liquid glass refraction caustic ring
    float causticRing = smoothstep(0.36, 0.56, dist) * smoothstep(0.80, 0.56, dist) * 1.1;
    // Outer refractive glass rim / fresnel edge
    float glassRim = smoothstep(0.72, 0.96, dist) * 0.75;
    // Soft illuminated optical bloom halo
    float outerHalo = (1.0 - smoothstep(0.0, 1.0, dist)) * 0.55;

    float totalAlpha = coreSpecular + causticRing + glassRim + outerHalo;

    // 2) Astronomical Cross Diffraction Spikes for major illuminated radiant stars
    if (vScale > 1.2) {
      float spikeStrength = smoothstep(1.2, 2.0, vScale) * 1.35;
      float spikeX = exp(-abs(coord.y) * 32.0) * smoothstep(0.5, 0.0, abs(coord.x));
      float spikeY = exp(-abs(coord.x) * 32.0) * smoothstep(0.5, 0.0, abs(coord.y));
      totalAlpha += (spikeX + spikeY) * spikeStrength;
    }

    // 3) Chromatic dispersion across the liquid glass droplet (prismatic edge tinting)
    vec3 glassTint = vColor;
    glassTint.r += coord.x * 0.16;
    glassTint.b -= coord.x * 0.16;
    glassTint = max(glassTint, vec3(0.08));

    vec3 mixedColor = mix(glassTint, uAccent, clamp(0.24 + vProximity * 0.5, 0.0, 1.0));

    // Intense self-illuminating glass glint (pure white/cyan core illumination)
    mixedColor += vec3(0.95, 0.98, 1.0) * exp(-dist * dist * 14.0);
    // Caustic ring illumination matching accent
    mixedColor += uAccent * (causticRing * 0.5);

    gl_FragColor = vec4(mixedColor, clamp(totalAlpha * vAlpha * 1.35, 0.0, 1.0));
  }
`;
