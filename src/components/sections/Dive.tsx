"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp } from "@/lib/math";

const STATEMENT_WORDS =
  "From a single sensor reading to a field-validated machine.".split(" ");

export function Dive() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statementRef = useRef<HTMLParagraphElement | null>(null);
  const reducedMotion = useReducedMotion();

  const handleProgress = useCallback((progress: number) => {
    const store = useAppStore.getState();

    // 70-100%: triangle wipe 0 -> 1 from screen center
    const wipeProgress = clamp((progress - 0.7) / 0.3, 0, 1);
    const nextSurface = wipeProgress >= 0.5 ? "light" : "dark";

    if (
      Math.abs(store.wipe.progress - wipeProgress) > 0.001 ||
      store.wipe.origin[0] !== 0.5 ||
      store.wipe.origin[1] !== 0.5 ||
      store.surface !== nextSurface
    ) {
      store.set({
        wipe: { progress: wipeProgress, origin: [0.5, 0.5] },
        surface: nextSurface,
      });
    }
  }, []);

  useSectionTrigger(sectionRef, {
    id: "dive",
    index: 1,
    label: "POINT OF VIEW",
    cameraKey: "dive_in",
    start: "top top",
    end: "bottom bottom",
    onProgress: handleProgress,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const statement = statementRef.current;
    if (!section || !statement) return;

    const ctx = gsap.context(() => {
      const words = statement.querySelectorAll<HTMLElement>("[data-dive-word]");

      if (reducedMotion) {
        gsap.set(words, { opacity: 1, filter: "none" });
        gsap.set(statement, { opacity: 1 });
      } else {
        gsap.set(words, { opacity: 0.08, filter: "blur(8px)" });

        // 30-55% word-by-word scrubbed blur/opacity reveal
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const total = words.length;
            const windowProgress = clamp((p - 0.3) / 0.25, 0, 1);

            for (let i = 0; i < total; i++) {
              const wordStart = (i / total) * 0.75;
              const local = clamp((windowProgress - wordStart) / 0.25, 0, 1);
              const opacity = 0.08 + local * 0.92;
              const blur = (1 - local) * 8;
              words[i].style.opacity = opacity.toFixed(3);
              words[i].style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "none";
            }

            // Fade sentence gently before wipe crosses 50% surface switch
            const fadeOut = 1 - clamp((p - 0.64) / 0.14, 0, 1);
            statement.style.opacity = fadeOut.toFixed(3);
          },
        });
      }

      // Bidirectional boundary safeguards when scrolling out of either end
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onLeaveBack: () => {
          useAppStore.getState().set({
            wipe: { progress: 0, origin: [0.5, 0.5] },
            surface: "dark",
          });
        },
        onLeave: () => {
          useAppStore.getState().set({
            wipe: { progress: 1, origin: [0.5, 0.5] },
            surface: "light",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="dive"
      ref={sectionRef}
      aria-label="Point of view"
      className="relative h-[380vh] w-full"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6 md:px-12">
        <p
          ref={statementRef}
          className="max-w-[26ch] text-center text-[clamp(1.75rem,3.8vw,4rem)] font-light leading-[1.14] tracking-[-0.02em] text-[var(--surface-fg)]"
        >
          {STATEMENT_WORDS.map((word, idx) => (
            <span
              key={`${idx}-${word}`}
              data-dive-word
              className="inline-block will-change-[opacity,filter]"
            >
              {word}
              {idx < STATEMENT_WORDS.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
