"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE } from "@/data/profile";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp } from "@/lib/math";
import { TriangleCover } from "@/components/ui/TriangleCover";
import { LetterRoll } from "@/components/ui/LetterRoll";
import { audioEngine } from "@/audio/AudioEngine";

const BIO_WORDS = [
  ...PROFILE.objective.split(" "),
  "|",
  PROFILE.education.degree,
  "at",
  PROFILE.education.institution,
  `(${PROFILE.education.period},`,
  "CGPA",
  `${PROFILE.education.cgpa}).`,
  "Languages:",
  `${PROFILE.education.languages.join(", ")}.`,
];

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const firstNameRef = useRef<HTMLSpanElement | null>(null);
  const lastNameRef = useRef<HTMLSpanElement | null>(null);
  const bioRef = useRef<HTMLParagraphElement | null>(null);
  const reducedMotion = useReducedMotion();

  const handleProgress = useCallback(
    (progress: number) => {
      const mix = reducedMotion ? 1 : clamp(progress / 0.5, 0, 1);
      const fadeIn = clamp(progress / 0.1, 0, 1);
      const fadeOut = 1 - clamp((progress - 0.85) / 0.15, 0, 1);
      const fade = reducedMotion ? 1 : fadeIn * fadeOut;

      useAppStore.getState().set({
        portraitMix: mix,
        portraitFade: fade,
      });
    },
    [reducedMotion]
  );

  useSectionTrigger(sectionRef, {
    id: "about",
    index: 6,
    label: "ABOUT",
    cameraKey: "about",
    start: "top center",
    end: "bottom center",
    onProgress: handleProgress,
  });

  // Register portrait container into global store for WebGL drei <View>
  useEffect(() => {
    const el = portraitRef.current;
    useAppStore.getState().set({ portraitEl: el });
    return () => {
      useAppStore.getState().set({
        portraitEl: null,
        portraitMix: 0,
        portraitFade: 0,
      });
    };
  }, []);

  // Split name opposite xPercent parallax + bio word reveal
  useEffect(() => {
    const section = sectionRef.current;
    const bio = bioRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (!reducedMotion && firstNameRef.current && lastNameRef.current) {
        gsap.to(firstNameRef.current, {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        });
        gsap.to(lastNameRef.current, {
          xPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        });
      }

      if (bio) {
        const words = bio.querySelectorAll<HTMLElement>("[data-about-word]");
        if (reducedMotion) {
          gsap.set(words, { opacity: 1 });
        } else if (words.length > 0) {
          gsap.set(words, { opacity: 0.15 });
          gsap.to(words, {
            opacity: 1,
            stagger: 0.03,
            ease: "none",
            scrollTrigger: {
              trigger: bio,
              start: "top 82%",
              end: "bottom 48%",
              scrub: 1,
            },
          });
        }
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => useAppStore.getState().set({ portraitFade: 0 }),
        onLeaveBack: () =>
          useAppStore.getState().set({ portraitMix: 0, portraitFade: 0 }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-[320vh] w-full px-6 py-28 md:px-10 lg:py-36"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-28">
        <div>
          <span className="font-mono-label mb-10 block text-[var(--surface-muted)]">
            06 · ABOUT
          </span>
        </div>

        {/* Sticky overlapping split-name + portrait stage */}
        <div className="relative flex min-h-[140vh] flex-col justify-center">
          <div className="sticky top-16 flex min-h-[78vh] w-full items-center justify-center overflow-hidden">
            {/* Portrait frame tracked by WebGL View */}
            <div
              ref={portraitRef}
              aria-label="Portrait of Ashwin T E"
              className="relative z-10 h-[74vw] w-[56vw] border border-[var(--surface-border)]/35 bg-transparent sm:h-[52vw] sm:w-[38vw] lg:h-[36vw] lg:w-[26vw]"
            />

            {/* Giant Split Name overlapping portrait */}
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between py-6 md:py-10">
              <span
                ref={firstNameRef}
                className="self-start text-[clamp(3.6rem,15vw,16rem)] font-extralight leading-[0.88] tracking-[-0.04em] text-[var(--surface-fg)] mix-blend-difference will-change-transform"
              >
                Ashwin
              </span>
              <span
                ref={lastNameRef}
                className="self-end text-[clamp(3.6rem,15vw,16rem)] font-extralight leading-[0.88] tracking-[-0.04em] text-[var(--surface-fg)] mix-blend-difference will-change-transform"
              >
                T E
              </span>
            </div>
          </div>
        </div>

        {/* Bio + Education + Languages + CTAs */}
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-12 pt-10 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            <span className="font-mono-label block text-[var(--surface-muted)]">
              Education &amp; Focus
            </span>
            <p className="text-sm font-normal text-[var(--surface-fg)]">
              {PROFILE.education.degree}
            </p>
            <p className="text-xs text-[var(--surface-subtle)]">
              {PROFILE.education.institution}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--surface-muted)]">
              {PROFILE.education.period} · CGPA {PROFILE.education.cgpa}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--surface-muted)]">
              {PROFILE.education.languages.join(" · ")}
            </p>
          </div>

          <div className="space-y-10 lg:col-span-8">
            <p
              ref={bioRef}
              className="text-[clamp(1.1rem,1.7vw,1.65rem)] font-light leading-[1.48] tracking-[-0.015em] text-[var(--surface-fg)]"
            >
              {BIO_WORDS.map((word, idx) => (
                <span key={`${idx}-${word}`} data-about-word className="inline-block">
                  {word}
                  {idx < BIO_WORDS.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={PROFILE.resumePath}
                download="Ashwin_TE_Resume.pdf"
                onPointerEnter={() => audioEngine.playTick()}
                className="inline-flex overflow-hidden rounded-full border border-[var(--surface-border)] bg-[var(--surface-bg)]/40 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-fg)]"
              >
                <TriangleCover className="px-6 py-3">
                  <LetterRoll text="Download résumé" />
                </TriangleCover>
              </a>

              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => audioEngine.playTick()}
                className="inline-flex items-center border-b border-[var(--surface-border)] px-2 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-fg)] transition-colors hover:border-[var(--surface-fg)]"
              >
                <LetterRoll text="GitHub" />
              </a>

              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => audioEngine.playTick()}
                className="inline-flex items-center border-b border-[var(--surface-border)] px-2 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-fg)] transition-colors hover:border-[var(--surface-fg)]"
              >
                <LetterRoll text="LinkedIn" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
