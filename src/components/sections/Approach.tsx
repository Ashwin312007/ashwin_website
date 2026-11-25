"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE } from "@/data/profile";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const OBJECTIVE_WORDS = PROFILE.objective.split(" ");

function StageDiagram({ stage }: { stage: "POINT" | "LINE" | "PLANE" }) {
  if (stage === "POINT") {
    return (
      <svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        fill="none"
        aria-hidden="true"
        className="text-current"
      >
        <circle
          data-svg-stroke
          cx="38"
          cy="38"
          r="26"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        <circle
          data-svg-stroke
          cx="38"
          cy="38"
          r="14"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.65"
        />
        <circle cx="38" cy="38" r="3.5" fill="currentColor" />
      </svg>
    );
  }

  if (stage === "LINE") {
    return (
      <svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        fill="none"
        aria-hidden="true"
        className="text-current"
      >
        <path
          data-svg-stroke
          d="M8 54 C 24 54, 28 22, 42 22 C 54 22, 54 44, 68 20"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <line
          data-svg-stroke
          x1="8"
          y1="54"
          x2="68"
          y2="20"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.4"
        />
        <circle cx="8" cy="54" r="3" fill="currentColor" />
        <circle cx="68" cy="20" r="3" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      aria-hidden="true"
      className="text-current"
    >
      <polygon
        data-svg-stroke
        points="38,10 68,62 8,62"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <polygon
        data-svg-stroke
        points="23,36 53,36 38,62"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.75"
      />
      <line
        data-svg-stroke
        x1="38"
        y1="10"
        x2="38"
        y2="62"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.45"
      />
    </svg>
  );
}

export function Approach() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const objectiveRef = useRef<HTMLParagraphElement | null>(null);
  const stepsWrapRef = useRef<HTMLDivElement | null>(null);
  const exitZoneRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useSectionTrigger(sectionRef, {
    id: "approach",
    index: 1,
    label: "POINT OF VIEW",
    cameraKey: "approach",
    start: "top center",
    end: "bottom center",
  });

  useEffect(() => {
    const section = sectionRef.current;
    const objective = objectiveRef.current;
    const stepsWrap = stepsWrapRef.current;
    const exitZone = exitZoneRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Ensure light surface while inside main approach body
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 96%",
        onEnter: () => {
          useAppStore.getState().set({
            surface: "light",
            wipe: { progress: 1, origin: [0.5, 0.5] },
          });
        },
        onEnterBack: () => {
          useAppStore.getState().set({
            surface: "light",
            wipe: { progress: 1, origin: [0.5, 0.5] },
          });
        },
      });

      // Right column PROFILE.objective word opacity scrub 65% -> 100% (>=4.5:1 even before reveal)
      if (objective) {
        const words = objective.querySelectorAll<HTMLElement>("[data-approach-word]");
        if (reducedMotion) {
          gsap.set(words, { opacity: 1 });
        } else if (words.length > 0) {
          gsap.set(words, { opacity: 0.65 });
          gsap.to(words, {
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: objective,
              start: "top 88%",
              end: "top 50%",
              scrub: 1,
            },
          });
        }
      }

      // Narrative step rows: clip-path wipe from left + SVG strokeDashoffset
      if (stepsWrap) {
        const rows = stepsWrap.querySelectorAll<HTMLElement>("[data-step-row]");
        rows.forEach((row) => {
          const strokes = row.querySelectorAll<SVGGeometryElement>("[data-svg-stroke]");

          if (reducedMotion) {
            gsap.set(row, { clipPath: "inset(0 0% 0 0)" });
            return;
          }

          gsap.set(row, { clipPath: "inset(0 100% 0 0)" });
          gsap.to(row, {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: row,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
          });

          strokes.forEach((geom) => {
            const length =
              typeof geom.getTotalLength === "function" ? geom.getTotalLength() : 160;
            gsap.set(geom, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            gsap.to(geom, {
              strokeDashoffset: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });
          });
        });
      }

      // Exit: reverse TriangleWipe (progress 1 -> 0, origin [0.5, 0.05]) over exit zone
      if (exitZone) {
        ScrollTrigger.create({
          trigger: exitZone,
          start: "top 42%",
          end: "bottom 72%",
          scrub: true,
          onUpdate: (self) => {
            const p = reducedMotion ? (self.progress > 0.5 ? 1 : 0) : self.progress;
            const wipeProgress = 1 - p;
            const nextSurface = wipeProgress < 0.5 ? "dark" : "light";
            useAppStore.getState().set({
              wipe: { progress: wipeProgress, origin: [0.5, 0.05] },
              surface: nextSurface,
            });
          },
          onLeave: () => {
            useAppStore.getState().set({
              wipe: { progress: 0, origin: [0.5, 0.05] },
              surface: "dark",
            });
          },
          onLeaveBack: () => {
            useAppStore.getState().set({
              wipe: { progress: 1, origin: [0.5, 0.5] },
              surface: "light",
            });
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="relative z-10 w-full text-[var(--surface-fg)]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-20 px-6 pt-28 pb-16 md:px-10 lg:pt-36">
        {/* Two-line heading */}
        <div className="space-y-2">
          <h2 className="text-fluid-section font-light text-[var(--surface-fg)]">
            <span className="block">I start with the physics</span>
            <span className="block text-[var(--surface-muted)] md:pl-[18vw]">
              and finish with the machine.
            </span>
          </h2>
        </div>

        {/* Right column objective paragraph */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="hidden lg:col-span-5 lg:block" />
          <div className="lg:col-span-7">
            <p
              ref={objectiveRef}
              className="max-w-[52ch] text-[clamp(1.1rem,1.65vw,1.6rem)] font-light leading-[1.45] tracking-[-0.01em] text-[var(--surface-fg)]"
            >
              {OBJECTIVE_WORDS.map((word, idx) => (
                <span key={`${idx}-${word}`} data-approach-word className="inline-block">
                  {word}
                  {idx < OBJECTIVE_WORDS.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Narrative Steps: POINT / LINE / PLANE */}
        <div
          ref={stepsWrapRef}
          className="mt-8 border-t border-[var(--surface-border)]"
        >
          {PROFILE.narrativeSteps.map((step) => (
            <div
              key={step.index}
              data-step-row
              className="grid grid-cols-1 items-center gap-6 border-b border-[var(--surface-border)] py-10 md:py-14 lg:grid-cols-12"
            >
              {/* Index + SVG */}
              <div className="flex items-center justify-between gap-4 lg:col-span-2 lg:flex-col lg:items-start">
                <span className="font-mono-label text-[var(--surface-muted)]">
                  {step.index} · {step.subtitle}
                </span>
                <div className="text-[var(--surface-fg)]">
                  <StageDiagram stage={step.stage} />
                </div>
              </div>

              {/* Giant Outline Stage Name */}
              <div className="lg:col-span-4">
                <span
                  className="block font-sans text-[clamp(3.2rem,6vw,6.2rem)] font-extralight leading-none tracking-[-0.03em] text-transparent"
                  style={{
                    WebkitTextStroke: "1px var(--surface-fg)",
                  }}
                >
                  {step.stage}
                </span>
              </div>

              {/* Title, Body, Metric */}
              <div className="space-y-4 lg:col-span-6">
                <h3 className="text-[clamp(1.25rem,1.9vw,1.9rem)] font-light tracking-[-0.015em] text-[var(--surface-fg)]">
                  {step.title}
                </h3>
                <p className="max-w-[58ch] text-sm leading-relaxed text-[var(--surface-subtle)] md:text-base">
                  {step.body}
                </p>
                <div>
                  <span className="inline-flex items-center rounded-full border border-[var(--surface-border)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--surface-fg)]">
                    {step.metric}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last 44vh: reverses triangle wipe back to dark surface */}
      <div ref={exitZoneRef} aria-hidden="true" className="h-[44vh] w-full" />
    </section>
  );
}
