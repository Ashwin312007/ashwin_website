"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface LetterRollProps {
  text: string;
  className?: string;
  trigger?: "hover" | "change";
  stagger?: number;
  duration?: number;
}

export function LetterRoll({
  text,
  className = "",
  trigger = "hover",
  stagger = 0.018,
  duration = 0.5,
}: LetterRollProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const prevTextRef = useRef<string>(text);
  const reducedMotion = useReducedMotion();

  const animateIn = () => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const tracks = root.querySelectorAll<HTMLElement>("[data-lr-track]");
    if (tracks.length === 0) return;

    gsap.killTweensOf(tracks);
    gsap.fromTo(
      tracks,
      { yPercent: 0 },
      {
        yPercent: -50,
        duration,
        stagger,
        ease: "power3.inOut",
        overwrite: "auto",
      }
    );
  };

  const animateOut = () => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const tracks = root.querySelectorAll<HTMLElement>("[data-lr-track]");
    if (tracks.length === 0) return;

    gsap.killTweensOf(tracks);
    gsap.to(tracks, {
      yPercent: 0,
      duration: duration * 0.85,
      stagger,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

  useEffect(() => {
    if (trigger !== "change") return;
    if (prevTextRef.current === text) return;
    prevTextRef.current = text;

    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const tracks = root.querySelectorAll<HTMLElement>("[data-lr-track]");
    if (tracks.length === 0) return;

    gsap.killTweensOf(tracks);
    gsap.fromTo(
      tracks,
      { yPercent: 0 },
      {
        yPercent: -50,
        duration: 0.48,
        stagger: 0.014,
        ease: "power3.inOut",
      }
    );
  }, [text, trigger, reducedMotion]);

  const chars = Array.from(text);

  return (
    <span
      ref={rootRef}
      aria-label={text}
      onPointerEnter={trigger === "hover" ? animateIn : undefined}
      onPointerLeave={trigger === "hover" ? animateOut : undefined}
      className={`inline-flex items-baseline whitespace-pre ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-baseline">
        {chars.map((char, idx) => {
          const display = char === " " ? "\u00A0" : char;
          return (
            <span
              key={`${idx}-${char}`}
              className="relative inline-block h-[1.08em] overflow-hidden align-baseline leading-[1.08]"
            >
              <span
                data-lr-track
                className="inline-flex flex-col will-change-transform"
              >
                <span className="block h-[1.08em] leading-[1.08]">{display}</span>
                <span className="block h-[1.08em] leading-[1.08]">{display}</span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
