import * as THREE from "three";

/**
 * Converts any BufferGeometry to non-indexed triangles and attaches a `aBary`
 * vec3 attribute ([1,0,0], [0,1,0], [0,0,1] per face) for crisp fwidth wireframes.
 */
export function toNonIndexedBarycentric(
  source: THREE.BufferGeometry
): THREE.BufferGeometry {
  const geometry = source.index ? source.toNonIndexed() : source;
  if (geometry !== source) {
    source.dispose();
  }

  const position = geometry.getAttribute("position");
  const count = position ? position.count : 0;
  const bary = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 3) {
    bary.set([1, 0, 0, 0, 1, 0, 0, 0, 1], i * 3);
  }

  geometry.setAttribute("aBary", new THREE.BufferAttribute(bary, 3));
  return geometry;
}

/**
 * Generates the PeristalticCore non-indexed icosphere geometry with barycentric attributes.
 */
export function makeCoreGeometry(detail: number): THREE.BufferGeometry {
  const base = new THREE.IcosahedronGeometry(1, detail);
  return toNonIndexedBarycentric(base);
}
