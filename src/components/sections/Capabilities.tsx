"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import { CAPABILITIES } from "@/data/capabilities";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Odometer } from "@/components/ui/Odometer";
import { audioEngine } from "@/audio/AudioEngine";

export function Capabilities() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const flipStateRef = useRef<Flip.FlipState | null>(null);
  const activeIdxRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useSectionTrigger(sectionRef, {
    id: "capabilities",
    index: 2,
    label: "CAPABILITIES",
    cameraKey: "capabilities",
    start: "top center",
    end: "bottom center",
  });

  const activateIndex = useCallback(
    (nextIdx: number) => {
      if (nextIdx === activeIdxRef.current) return;
      activeIdxRef.current = nextIdx;

      if (!reducedMotion && listRef.current) {
        const targets = listRef.current.querySelectorAll<HTMLElement>("[data-cap-row]");
        if (targets.length > 0) {
          flipStateRef.current = Flip.getState(targets);
        }
      }
      setActiveIndex(nextIdx);
    },
    [reducedMotion]
  );

  // Run GSAP Flip transition whenever activeIndex updates
  useEffect(() => {
    const state = flipStateRef.current;
    const list = listRef.current;
    if (!state || !list || reducedMotion) {
      flipStateRef.current = null;
      return;
    }

    const ctx = gsap.context(() => {
      Flip.from(state, {
        duration: 0.45,
        ease: "power3.out",
        nested: true,
        simple: true,
      });
    }, listRef);

    flipStateRef.current = null;
    return () => ctx.revert();
  }, [activeIndex, reducedMotion]);

  // ScrollTrigger active item detection + divider scaleX draws
  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const ctx = gsap.context(() => {
      // Ensure dark surface if user jumps directly past Approach
      ScrollTrigger.create({
        trigger: section,
        start: "top 65%",
        end: "bottom 40%",
        onEnter: () => {
          const st = useAppStore.getState();
          if (st.surface !== "dark" || st.wipe.progress !== 0) {
            st.set({ surface: "dark", wipe: { progress: 0, origin: [0.5, 0.92] } });
          }
        },
        onEnterBack: () => {
          const st = useAppStore.getState();
          if (st.surface !== "dark" || st.wipe.progress !== 0) {
            st.set({ surface: "dark", wipe: { progress: 0, origin: [0.5, 0.92] } });
          }
        },
      });

      const rows = list.querySelectorAll<HTMLElement>("[data-cap-row]");
      rows.forEach((row, idx) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => activateIndex(idx),
          onEnterBack: () => activateIndex(idx),
        });
      });

      const dividers = list.querySelectorAll<HTMLElement>("[data-cap-divider]");
      dividers.forEach((div) => {
        if (reducedMotion) {
          gsap.set(div, { scaleX: 1 });
          return;
        }
        gsap.set(div, { scaleX: 0 });
        gsap.to(div, {
          scaleX: 1,
          duration: 0.85,
          ease: "expo.out",
          scrollTrigger: {
            trigger: div,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activateIndex, reducedMotion]);

  const totalCount = String(CAPABILITIES.length).padStart(2, "0");

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="relative min-h-[240vh] w-full px-6 py-28 md:px-10 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Section header */}
        <div className="mb-16 space-y-4 lg:mb-24">
          <span className="font-mono-label block text-[var(--surface-muted)]">
            02 · CAPABILITIES
          </span>
          <h2 className="text-fluid-section font-light text-[var(--surface-fg)]">
            What I can build.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left sticky counter */}
          <div className="lg:col-span-4">
            <div className="flex items-end justify-between border-b border-[var(--surface-border)] pb-6 lg:sticky lg:top-28 lg:flex-col lg:items-start lg:justify-start lg:border-b-0 lg:pb-0">
              <Odometer
                value={activeIndex + 1}
                pad={2}
                duration={0.6}
                className="text-fluid-giant font-extralight text-[var(--surface-fg)]"
              />

              <div className="flex flex-col items-end gap-3 lg:mt-8 lg:items-start">
                <div className="flex items-center gap-2" aria-hidden="true">
                  {CAPABILITIES.map((cap, i) => {
                    const filled = i <= activeIndex;
                    return (
                      <span
                        key={cap.index}
                        className={`h-[2px] transition-all duration-300 ${
                          filled
                            ? "w-7 bg-[var(--surface-fg)]"
                            : "w-3.5 bg-[var(--surface-border)]"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="font-mono-label text-[var(--surface-muted)]">
                  /{totalCount} ENGINEERING DOMAINS
                </span>
              </div>
            </div>
          </div>

          {/* Right accordion list */}
          <div ref={listRef} className="lg:col-span-8">
            {CAPABILITIES.map((cap, i) => {
              const isActive = i === activeIndex;
              return (
                <div key={cap.index} data-cap-row className="relative">
                  <div
                    data-cap-divider
                    className="h-px w-full origin-left bg-[var(--surface-border)]"
                  />

                  <div
                    className={`py-8 transition-opacity duration-300 md:py-12 ${
                      isActive ? "opacity-100" : "opacity-[0.32] hover:opacity-65"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        audioEngine.playTick();
                        activateIndex(i);
                      }}
                      aria-expanded={isActive}
                      className="flex w-full items-baseline justify-between gap-6 text-left"
                    >
                      <div className="flex items-baseline gap-5 md:gap-8">
                        <span className="font-mono-label shrink-0 text-[var(--surface-muted)]">
                          {cap.index}
                        </span>
                        <h3 className="text-[clamp(1.45rem,2.4vw,2.75rem)] font-light tracking-[-0.02em] text-[var(--surface-fg)]">
                          {cap.title}
                        </h3>
                      </div>

                      <span className="font-mono text-xs text-[var(--surface-muted)]">
                        {isActive ? "—" : "+"}
                      </span>
                    </button>

                    {isActive && (
                      <div className="mt-6 grid grid-cols-1 gap-8 pl-0 md:grid-cols-12 md:pl-12">
                        <div className="space-y-4 md:col-span-7">
                          <p className="text-base font-normal text-[var(--surface-fg)]">
                            {cap.subtitle}
                          </p>
                          <p className="text-sm leading-relaxed text-[var(--surface-subtle)]">
                            {cap.description}
                          </p>
                          <div className="pt-2">
                            <span className="font-mono-label mb-2 block text-[var(--surface-muted)]">
                              Applied in:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {cap.appliedIn.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-[var(--surface-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--surface-fg)]"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-5 md:text-right">
                          <span className="font-mono-label mb-3 block text-[var(--surface-muted)]">
                            Core Stack
                          </span>
                          <ul className="space-y-2 text-xs text-[var(--surface-subtle)] md:text-sm">
                            {cap.skills.map((skill) => (
                              <li key={skill}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="h-px w-full bg-[var(--surface-border)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
