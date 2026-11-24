/**
 * Canonical geometric "A" monogram path shared between DOM SVG (<Emblem />),
 * WebGL extruded chrome monogram (SVGLoader), and PortraitHalftone Canvas2D fallback.
 */

export const EMBLEM_VIEWBOX = "0 0 100 100";

/**
 * Outer chevron-triangle silhouette with bottom inner notch (clockwise in Y-down)
 * plus inner upper triangular aperture (counter-clockwise in Y-down) so both
 * SVG evenodd fill and Three.js SVGLoader hole extraction render identically.
 */
export const EMBLEM_SVG_PATH =
  "M50 8 L90 90 L68 90 L60 72 L40 72 L32 90 L10 90 Z M50 31 L39 57 L61 57 Z";

export interface DrawEmblemOptions {
  fill?: string;
  background?: string;
  paddingRatio?: number;
}

/**
 * Draws the canonical emblem onto a Canvas2D context for PortraitHalftone fallback.
 */
export function drawEmblemToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: DrawEmblemOptions = {}
): void {
  const {
    fill = "#FAFAFA",
    background = "#0A0A0A",
    paddingRatio = 0.16,
  } = options;

  ctx.save();
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const usable = Math.min(width, height) * (1 - paddingRatio * 2);
  const scale = usable / 100;
  const offsetX = (width - 100 * scale) * 0.5;
  const offsetY = (height - 100 * scale) * 0.5;

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  const path = new Path2D(EMBLEM_SVG_PATH);
  ctx.fillStyle = fill;
  ctx.fill(path, "evenodd");
  ctx.restore();
}
