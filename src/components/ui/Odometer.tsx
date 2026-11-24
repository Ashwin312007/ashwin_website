"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface OdometerProps {
  value: string | number;
  pad?: number;
  className?: string;
  duration?: number;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function DigitColumn({
  digit,
  duration,
  reducedMotion,
}: {
  digit: number;
  duration: number;
  reducedMotion: boolean;
}) {
  const stripRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const targetYPercent = -digit * 10;

    if (reducedMotion) {
      gsap.set(strip, { yPercent: targetYPercent });
      return;
    }

    gsap.to(strip, {
      yPercent: targetYPercent,
      duration,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  }, [digit, duration, reducedMotion]);

  return (
    <span
      aria-hidden="true"
      className="relative inline-block h-[1em] overflow-hidden align-baseline leading-[1em]"
    >
      <span
        ref={stripRef}
        className="inline-flex flex-col will-change-transform"
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] leading-[1em] tabular-nums">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Odometer({
  value,
  pad,
  className = "",
  duration = 0.6,
}: OdometerProps) {
  const reducedMotion = useReducedMotion();
  const raw = String(value);
  const formatted = pad ? raw.padStart(pad, "0") : raw;
  const chars = Array.from(formatted);

  return (
    <span
      aria-label={formatted}
      className={`inline-flex items-baseline tabular-nums ${className}`}
    >
      {chars.map((ch, idx) => {
        const code = ch.charCodeAt(0);
        const isDigit = code >= 48 && code <= 57;
        if (!isDigit) {
          return (
            <span key={`sep-${idx}-${ch}`} aria-hidden="true">
              {ch}
            </span>
          );
        }
        return (
          <DigitColumn
            key={`col-${idx}`}
            digit={code - 48}
            duration={duration}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </span>
  );
}
