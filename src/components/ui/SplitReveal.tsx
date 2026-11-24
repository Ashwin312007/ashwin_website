"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface SplitRevealProps {
  children: ReactNode;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span";
  type?: "lines" | "words";
  mode?: "mount" | "scroll";
  stagger?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function SplitReveal({
  children,
  as: Tag = "div",
  type = "lines",
  mode = "scroll",
  stagger = 0.08,
  duration = 1.15,
  delay = 0,
  className = "",
}: SplitRevealProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion) return;

    let cancelled = false;
    let split: SplitText | null = null;
    let ctx: gsap.Context | null = null;

    const init = async () => {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Proceed even if fonts check rejects
        }
      }
      if (cancelled || !rootRef.current) return;

      ctx = gsap.context(() => {
        split = SplitText.create(rootRef.current!, {
          type,
          mask: type,
        });
        const targets = type === "lines" ? split.lines : split.words;
        if (targets.length === 0) return;

        gsap.from(targets, {
          yPercent: 110,
          opacity: type === "words" ? 0 : 1,
          duration,
          stagger,
          delay,
          ease: "expo.out",
          ...(mode === "scroll"
            ? {
                scrollTrigger: {
                  trigger: rootRef.current!,
                  start: "top 86%",
                  once: true,
                },
              }
            : {}),
        });
      }, el);
    };

    void init();

    return () => {
      cancelled = true;
      split?.revert();
      ctx?.revert();
    };
  }, [type, mode, stagger, duration, delay, reducedMotion]);

  return (
    <Tag
      ref={rootRef as React.RefObject<never>}
      className={className}
    >
      {children}
    </Tag>
  );
}
