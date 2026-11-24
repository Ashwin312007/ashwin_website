"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, SplitText } from "@/lib/gsap";

export interface UseSplitOptions {
  type?: "lines" | "words" | "chars" | "lines,words" | "words,chars" | "lines,words,chars";
  mask?: "lines" | "words" | "chars";
  linesClass?: string;
  wordsClass?: string;
  charsClass?: string;
  disabled?: boolean;
  onSplit?: (instance: SplitText) => void;
}

export function useSplit<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseSplitOptions = {}
): RefObject<SplitText | null> {
  const {
    type = "lines",
    mask,
    linesClass,
    wordsClass,
    charsClass,
    disabled = false,
    onSplit,
  } = options;

  const splitRef = useRef<SplitText | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    let cancelled = false;
    let ctx: gsap.Context | null = null;

    const run = async () => {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignore font readiness failure and proceed with layout
        }
      }
      if (cancelled || !ref.current) return;

      ctx = gsap.context(() => {
        const instance = SplitText.create(ref.current!, {
          type,
          ...(mask ? { mask } : {}),
          ...(linesClass ? { linesClass } : {}),
          ...(wordsClass ? { wordsClass } : {}),
          ...(charsClass ? { charsClass } : {}),
        });
        splitRef.current = instance;
        onSplit?.(instance);
      }, el);
    };

    void run();

    return () => {
      cancelled = true;
      splitRef.current?.revert();
      splitRef.current = null;
      ctx?.revert();
    };
  }, [ref, type, mask, linesClass, wordsClass, charsClass, disabled, onSplit]);

  return splitRef;
}
