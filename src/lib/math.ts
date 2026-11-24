/**
 * Core mathematical interpolation and shaping helpers used across DOM and WebGL layers.
 */

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function damp(a: number, b: number, lambda: number, dt: number): number {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function map(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  shouldClamp = false
): number {
  if (inMax === inMin) return outMin;
  const normalized = (value - inMin) / (inMax - inMin);
  const t = shouldClamp ? clamp(normalized, 0, 1) : normalized;
  return outMin + t * (outMax - outMin);
}

export function smoothstep(t: number): number;
export function smoothstep(edge0: number, edge1: number, x: number): number;
export function smoothstep(edge0: number, edge1?: number, x?: number): number {
  if (edge1 === undefined || x === undefined) {
    const t = clamp(edge0, 0, 1);
    return t * t * (3 - 2 * t);
  }
  if (edge1 === edge0) return x >= edge1 ? 1 : 0;
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
