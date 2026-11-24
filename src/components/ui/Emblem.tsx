"use client";

import { EMBLEM_SVG_PATH, EMBLEM_VIEWBOX } from "@/lib/emblemPath";

export interface EmblemProps {
  size?: number;
  color?: string;
  className?: string;
  label?: string;
}

export function Emblem({
  size = 24,
  color = "currentColor",
  className = "",
  label,
}: EmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={EMBLEM_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      <path d={EMBLEM_SVG_PATH} fill={color} fillRule="evenodd" />
    </svg>
  );
}
