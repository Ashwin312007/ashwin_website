"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/data/projects";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { clamp } from "@/lib/math";
import { WorkCard } from "./WorkCard";

export function Work() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = useReducedMotion();

  const orderedProjects = useMemo(() => {
    const featured = PROJECTS.filter((p) => p.featured);
    const rest = PROJECTS.filter((p) => !p.featured);
    return [...featured, ...rest];
  }, []);

  useSectionTrigger(sectionRef, {
    id: "work",
    index: 3,
    label: "SELECTED WORK",
    cameraKey: "work",
    start: "top center",
    end: "bottom center",
  });

  // Bidirectional scale & brightness depth on covered cards
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stack,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: () => {
          const cards = cardRefs.current;
          const vh = window.innerHeight || 900;

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (!card) continue;

            let depth = 0;
            for (let j = i + 1; j < cards.length; j++) {
              const nextCard = cards[j];
              if (!nextCard) continue;
              const nextTop = nextCard.getBoundingClientRect().top;
              const stickyTop = vh * (0.1 + j * 0.014);
              const startTrigger = vh * 0.88;
              const covered = clamp(
                (startTrigger - nextTop) / Math.max(1, startTrigger - stickyTop),
                0,
                1
              );
              depth += covered;
            }

            const scale = Math.max(0.7, 1 - 0.04 * depth);
            const brightness = 1 - 0.15 * clamp(depth, 0, 1);

            card.style.transform = `scale(${scale.toFixed(4)})`;
            card.style.filter = `brightness(${brightness.toFixed(3)})`;
          }
        },
      });
    }, stackRef);

    return () => ctx.revert();
  }, [reducedMotion, orderedProjects.length]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full px-6 pt-28 pb-16 md:px-10 lg:pt-36"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Section header */}
        <div className="mb-16 space-y-4 lg:mb-20">
          <span className="font-mono-label block text-[var(--surface-muted)]">
            03 · SELECTED WORK
          </span>
          <h2 className="text-fluid-section font-light text-[var(--surface-fg)]">
            <span>Machines, </span>
            <span className="text-[var(--surface-muted)]">put to work.</span>
          </h2>
        </div>

        {/* Stacking cards */}
        <div ref={stackRef} className="relative">
          {orderedProjects.map((project, idx) => (
            <WorkCard
              key={project.id}
              project={project}
              stackIndex={idx}
              isLast={idx === orderedProjects.length - 1}
              cardRef={(el) => {
                cardRefs.current[idx] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
