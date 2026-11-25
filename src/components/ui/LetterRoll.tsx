"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface LetterRollProps {
  text: string;
  className?: string;
  trigger?: "hover" | "change";
  stagger?: number;
  duration?: number;
}

/**
 * Slot-machine letter roll.
 *
 * Accessibility / DOM hygiene:
 *  - The real string is rendered ONCE in an `sr-only` span (screen readers, copy, find-in-page).
 *  - The animated layer is `aria-hidden` + `select-none` and contains NO text nodes: both glyph rows
 *    (visible + rolled-in) are CSS `::before` / `::after` pseudo-elements (content: attr(data-char)),
 *    so textContent / copy-paste / scrapers see the string exactly once.
 *  - Characters are grouped per word (`whitespace-nowrap`) with normal spaces between words,
 *    so long strings (e.g. project titles) wrap instead of overflowing/truncating.
 */
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

  const getTracks = () =>
    rootRef.current?.querySelectorAll<HTMLElement>("[data-lr-track]") ?? null;

  const animateIn = () => {
    const tracks = getTracks();
    if (!tracks || tracks.length === 0 || reducedMotion) return;
    gsap.killTweensOf(tracks);
    gsap.fromTo(
      tracks,
      { yPercent: 0 },
      { yPercent: -50, duration, stagger, ease: "power3.inOut", overwrite: "auto" }
    );
  };

  const animateOut = () => {
    const tracks = getTracks();
    if (!tracks || tracks.length === 0 || reducedMotion) return;
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

    const tracks = getTracks();
    if (!tracks || tracks.length === 0 || reducedMotion) return;

    gsap.killTweensOf(tracks);
    gsap.fromTo(
      tracks,
      { yPercent: 0 },
      { yPercent: -50, duration: 0.48, stagger: 0.014, ease: "power3.inOut" }
    );
  }, [text, trigger, reducedMotion]);

  const words = text.split(" ");

  return (
    <span
      ref={rootRef}
      onPointerEnter={trigger === "hover" ? animateIn : undefined}
      onPointerLeave={trigger === "hover" ? animateOut : undefined}
      className={`inline ${className}`}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="select-none">
        {words.map((word, wi) => (
          <Fragment key={`${wi}-${word}`}>
            {wi > 0 ? " " : null}
            <span className="inline-flex items-baseline whitespace-nowrap">
              {Array.from(word).map((char, ci) => (
                <span
                  key={`${ci}-${char}`}
                  className="relative inline-block h-[1.2em] overflow-hidden align-baseline leading-[1.2]"
                >
                  <span
                    data-lr-track
                    data-char={char}
                    className="flex flex-col will-change-transform before:block before:h-[1.2em] before:leading-[1.2] before:content-[attr(data-char)] after:block after:h-[1.2em] after:leading-[1.2] after:content-[attr(data-char)]"
                  />
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}
