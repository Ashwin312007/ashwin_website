"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ACHIEVEMENTS, EXPERIENCE } from "@/data/experience";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSmoothScroll } from "@/providers/SmoothScroll";
import { clamp } from "@/lib/math";
import { Odometer } from "@/components/ui/Odometer";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LetterRoll } from "@/components/ui/LetterRoll";

const TOTAL_COLUMNS = EXPERIENCE.length + ACHIEVEMENTS.length;

export function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const activeColRef = useRef<number>(1);

  const [activeCol, setActiveCol] = useState(1);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  useSectionTrigger(sectionRef, {
    id: "experience",
    index: 4,
    label: "EXPERIENCE",
    cameraKey: "experience",
    start: "top center",
    end: "bottom center",
  });

  useEffect(() => {
    const pinWrap = pinWrapRef.current;
    const track = trackRef.current;
    if (!pinWrap || !track || !isDesktop || reducedMotion) return;

    const ctx = gsap.context(() => {
      const skewTargets = track.querySelectorAll<HTMLElement>("[data-exp-skew]");
      const skewSetter = gsap.quickTo(skewTargets, "skewX", {
        duration: 0.35,
        ease: "power3.out",
      });

      const getScrollDist = () =>
        Math.max(1, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -getScrollDist(),
        ease: "none",
        scrollTrigger: {
          trigger: pinWrap,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
          end: () => `+=${getScrollDist()}`,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress.toFixed(
                4
              )})`;
            }

            const idx = clamp(
              Math.floor(self.progress * TOTAL_COLUMNS) + 1,
              1,
              TOTAL_COLUMNS
            );
            if (idx !== activeColRef.current) {
              activeColRef.current = idx;
              setActiveCol(idx);
            }

            const vel = useAppStore.getState().scroll.velocity;
            const skew = clamp(-vel * 0.18, -6, 6);
            skewSetter(skew);
          },
          onScrubComplete: () => {
            skewSetter(0);
          },
          onLeave: () => {
            skewSetter(0);
          },
          onLeaveBack: () => {
            skewSetter(0);
          },
        },
      });
    }, sectionRef);

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, [isDesktop, reducedMotion]);

  const totalPadded = String(TOTAL_COLUMNS).padStart(2, "0");

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full overflow-x-clip"
    >
      <div
        ref={pinWrapRef}
        className="flex w-full flex-col justify-between pt-24 pb-16 lg:h-screen lg:overflow-hidden lg:pt-24 lg:pb-20"
      >
        {/* Top bar: Heading + Counter */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 md:px-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="font-mono-label block text-[var(--surface-muted)]">
              04 · EXPERIENCE
            </span>
            <h2 className="text-[clamp(2rem,3.8vw,4.2rem)] font-light leading-[1.04] tracking-[-0.02em] text-[var(--surface-fg)]">
              Experience &amp; recognition
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--surface-muted)]">
              Internships, leadership, teaching and awards.
            </p>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <div className="flex items-baseline gap-2 font-mono text-sm text-[var(--surface-fg)]">
              <Odometer value={activeCol} pad={2} duration={0.45} />
              <span className="text-[var(--surface-muted)]">/ {totalPadded}</span>
            </div>
            <div className="relative h-px w-[220px] overflow-hidden bg-[var(--surface-border)]">
              <span
                ref={progressBarRef}
                className="absolute inset-0 origin-left bg-[var(--surface-fg)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>

        {/* Horizontal track on desktop, vertical stack on mobile */}
        <div
          ref={trackRef}
          className="mt-10 flex flex-col border-t border-[var(--surface-border)] lg:mt-8 lg:flex-1 lg:flex-row lg:items-stretch lg:border-b"
        >
          {/* Experience columns */}
          {EXPERIENCE.map((exp, idx) => (
            <article
              key={`${exp.organization}-${exp.period}`}
              className="flex flex-col justify-between gap-6 border-b border-[var(--surface-border)] px-6 py-8 md:px-10 lg:w-[34vw] lg:shrink-0 lg:border-r lg:border-b-0 lg:py-10"
            >
              <div data-exp-skew className="space-y-4 will-change-transform">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono-label text-[var(--surface-muted)]">
                    {String(idx + 1).padStart(2, "0")} · {exp.period}
                  </span>
                  <span className="rounded-full border border-[var(--surface-border)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--surface-fg)]">
                    {exp.type}
                  </span>
                </div>

                <h3 className="text-[clamp(1.35rem,2.2vw,2.35rem)] font-light leading-[1.12] tracking-[-0.02em] text-[var(--surface-fg)]">
                  {exp.role}
                </h3>

                <div className="space-y-1">
                  <p className="text-sm font-normal text-[var(--surface-fg)]">
                    {exp.organization}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--surface-muted)]">
                    {exp.period} · {exp.location}
                  </p>
                </div>
              </div>

              <ul
                data-exp-skew
                className="space-y-2 text-xs leading-relaxed text-[var(--surface-subtle)] will-change-transform md:text-sm lg:mt-auto lg:text-right"
              >
                {exp.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}

          {/* Achievement columns */}
          {ACHIEVEMENTS.map((ach, idx) => (
            <article
              key={`${ach.title}-${idx}`}
              className="flex flex-col justify-between gap-6 border-b border-[var(--surface-border)] px-6 py-8 md:px-10 lg:w-[34vw] lg:shrink-0 lg:border-r lg:border-b-0 lg:py-10"
            >
              <div data-exp-skew className="space-y-4 will-change-transform">
                <span className="font-mono-label block text-[var(--surface-muted)]">
                  {String(EXPERIENCE.length + idx + 1).padStart(2, "0")} · AWARD
                </span>

                <div className="text-[clamp(2rem,3.3vw,3.8rem)] font-extralight leading-none tracking-[-0.03em] text-[var(--surface-fg)]">
                  {ach.metric}
                </div>

                <h3 className="text-[clamp(1.2rem,1.8vw,1.9rem)] font-light leading-[1.16] tracking-[-0.015em] text-[var(--surface-fg)]">
                  {ach.title}
                </h3>
              </div>

              <div
                data-exp-skew
                className="space-y-2 will-change-transform lg:mt-auto lg:text-right"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--surface-muted)]">
                  {ach.organization}
                </p>
                <p className="text-xs leading-relaxed text-[var(--surface-subtle)] md:text-sm">
                  {ach.detail}
                </p>
              </div>
            </article>
          ))}

          {/* 60vw End Panel */}
          <div className="flex flex-col items-start justify-center gap-8 px-6 py-14 md:px-12 lg:w-[60vw] lg:shrink-0 lg:px-16">
            <span className="font-mono-label text-[var(--surface-muted)]">
              Have a robot that needs building?
            </span>

            <MagneticButton
              href="#contact"
              cursor="talk"
              withTriangleCover
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#contact", { duration: 1.8 });
              }}
              className="rounded-full border-[var(--surface-border)] px-4 py-2 text-[var(--surface-fg)]"
            >
              <span className="px-4 py-2 text-[clamp(2.4rem,5.5vw,5.8rem)] font-light leading-none tracking-[-0.03em]">
                <LetterRoll text="Let's talk." />
              </span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
