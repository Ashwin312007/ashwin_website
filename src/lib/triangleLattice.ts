/**
 * Shared equilateral triangle lattice generator and Canvas2D drawing helpers
 * for TriangleCover and Curtain transitions.
 */

export interface LatticeTriangle {
  col: number;
  row: number;
  up: boolean;
  cx: number;
  cy: number;
  vertices: readonly [
    readonly [number, number],
    readonly [number, number],
    readonly [number, number],
  ];
  seed: number;
}

const SQRT3_2 = Math.sqrt(3) / 2;

export function hashLatticeCell(col: number, row: number, up: boolean): number {
  const n = Math.sin(col * 127.1 + row * 311.7 + (up ? 74.7 : 19.3)) * 43758.5453123;
  return n - Math.floor(n);
}

/**
 * Generates an equilateral triangle lattice covering [0, width] x [0, height].
 * Uses skewed rhombus coordinates split along the short diagonal so every
 * triangle is equilateral with side length `cellSize`.
 */
export function buildTriangleLattice(
  width: number,
  height: number,
  cellSize: number
): LatticeTriangle[] {
  if (width <= 0 || height <= 0 || cellSize <= 0) return [];

  const rowH = cellSize * SQRT3_2;
  const maxRow = Math.ceil(height / rowH) + 1;
  const triangles: LatticeTriangle[] = [];

  for (let row = -1; row <= maxRow; row++) {
    const minCol = Math.floor(-row * 0.5) - 1;
    const maxCol = Math.ceil(width / cellSize - row * 0.5) + 1;
    const y0 = row * rowH;
    const y1 = (row + 1) * rowH;

    for (let col = minCol; col <= maxCol; col++) {
      const x00 = col * cellSize + row * 0.5 * cellSize;
      const x10 = x00 + cellSize;
      const x01 = x00 + 0.5 * cellSize;
      const x11 = x01 + cellSize;

      // Upper-left equilateral triangle (P00, P10, P01)
      const cxUp = (x00 + x10 + x01) / 3;
      const cyUp = (y0 + y0 + y1) / 3;
      if (
        cxUp >= -cellSize &&
        cxUp <= width + cellSize &&
        cyUp >= -cellSize &&
        cyUp <= height + cellSize
      ) {
        triangles.push({
          col,
          row,
          up: true,
          cx: cxUp,
          cy: cyUp,
          vertices: [
            [x00, y0],
            [x10, y0],
            [x01, y1],
          ],
          seed: hashLatticeCell(col, row, true),
        });
      }

      // Lower-right equilateral triangle (P11, P01, P10)
      const cxDown = (x11 + x01 + x10) / 3;
      const cyDown = (y1 + y1 + y0) / 3;
      if (
        cxDown >= -cellSize &&
        cxDown <= width + cellSize &&
        cyDown >= -cellSize &&
        cyDown <= height + cellSize
      ) {
        triangles.push({
          col,
          row,
          up: false,
          cx: cxDown,
          cy: cyDown,
          vertices: [
            [x11, y1],
            [x01, y1],
            [x10, y0],
          ],
          seed: hashLatticeCell(col, row, false),
        });
      }
    }
  }

  return triangles;
}

/**
 * Adds a triangle path scaled from its centroid into the active Canvas2D context.
 * Applies a tiny bleed when near full coverage so adjacent triangles have no seams.
 */
export function traceScaledTriangle(
  ctx: CanvasRenderingContext2D,
  tri: LatticeTriangle,
  scale: number
): void {
  if (scale <= 0.001) return;
  const s = scale >= 0.985 ? scale * 1.025 : scale;
  const [v0, v1, v2] = tri.vertices;
  const { cx, cy } = tri;

  ctx.moveTo(cx + (v0[0] - cx) * s, cy + (v0[1] - cy) * s);
  ctx.lineTo(cx + (v1[0] - cx) * s, cy + (v1[1] - cy) * s);
  ctx.lineTo(cx + (v2[0] - cx) * s, cy + (v2[1] - cy) * s);
  ctx.closePath();
}
