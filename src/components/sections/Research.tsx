"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { RESEARCH_INTERESTS } from "@/data/research";
import { PROJECTS } from "@/data/projects";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LetterRoll } from "@/components/ui/LetterRoll";
import { audioEngine } from "@/audio/AudioEngine";

const VALID_PROJECT_IDS = new Set(PROJECTS.map((p) => p.id));
const PROJECT_TITLE_MAP = new Map(PROJECTS.map((p) => [p.id, p.shortTitle]));

function ResearchAccordionRow({
  item,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  item: (typeof RESEARCH_INTERESTS)[number];
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      gsap.set(panel, {
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      });
      return;
    }

    if (reducedMotion) {
      gsap.set(panel, {
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.to(panel, {
          height: "auto",
          opacity: 1,
          duration: 0.48,
          ease: "expo.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: 0.36,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      }
    }, panelRef);

    return () => ctx.revert();
  }, [isOpen, reducedMotion]);

  const validProjects = item.relatedProjects.filter((id) =>
    VALID_PROJECT_IDS.has(id)
  );

  return (
    <div className="border-b border-[var(--surface-border)]">
      <button
        type="button"
        onClick={() => {
          audioEngine.playTick();
          onToggle();
        }}
        aria-expanded={isOpen}
        className="flex w-full flex-col gap-3 py-7 text-left transition-opacity hover:opacity-85 md:flex-row md:items-center md:justify-between md:py-9"
      >
        <div className="space-y-1.5">
          <span className="font-mono-label block text-[var(--surface-muted)]">
            {item.category}
          </span>
          <h3 className="text-[clamp(1.25rem,2.3vw,2.4rem)] font-light tracking-[-0.02em] text-[var(--surface-fg)]">
            {item.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 self-start md:self-center">
          <span className="rounded-full border border-[var(--surface-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--surface-subtle)]">
            {item.status}
          </span>
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center border border-[var(--surface-border)] font-mono text-xs text-[var(--surface-fg)]"
          >
            {isOpen ? "−" : "+"}
          </span>
        </div>
      </button>

      <div
        ref={panelRef}
        aria-hidden={!isOpen}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="grid grid-cols-1 gap-6 pb-9 pt-1 md:grid-cols-3 md:gap-8">
          <div className="space-y-2">
            <span className="font-mono-label block text-[var(--surface-muted)]">
              Hypothesis
            </span>
            <p className="text-sm leading-relaxed text-[var(--surface-subtle)]">
              {item.hypothesis}
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono-label block text-[var(--surface-muted)]">
              Methodology
            </span>
            <p className="text-sm leading-relaxed text-[var(--surface-subtle)]">
              {item.methodology}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="font-mono-label block text-[var(--surface-muted)]">
                Relevance to Robotics
              </span>
              <p className="text-sm leading-relaxed text-[var(--surface-subtle)]">
                {item.relevanceToRobotics}
              </p>
            </div>

            {validProjects.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="font-mono-label block text-[var(--surface-muted)]">
                  Related Systems
                </span>
                <div className="flex flex-wrap gap-2">
                  {validProjects.map((id) => (
                    <TransitionLink
                      key={id}
                      href={`/work/${id}`}
                      cursor="view"
                      tabIndex={isOpen ? 0 : -1}
                      className="inline-flex items-center gap-1.5 border border-[var(--surface-border)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--surface-fg)] transition-colors hover:border-[var(--surface-fg)]"
                    >
                      <LetterRoll text={PROJECT_TITLE_MAP.get(id) ?? id} />
                      <span aria-hidden="true">-&gt;</span>
                    </TransitionLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Research() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const [openId, setOpenId] = useState<string | null>(
    RESEARCH_INTERESTS[0]?.id ?? null
  );
  const reducedMotion = useReducedMotion();

  useSectionTrigger(sectionRef, {
    id: "research",
    index: 5,
    label: "RESEARCH",
    cameraKey: "research",
    start: "top center",
    end: "bottom center",
  });

  // Velocity-driven bidirectional marquee
  useEffect(() => {
    const track = marqueeTrackRef.current;
    if (!track || reducedMotion) return;

    let xPercent = 0;
    const ctx = gsap.context(() => {
      const tick = (_time: number, deltaMs: number) => {
        const dt = Math.min(0.05, (deltaMs || 16.6) / 1000);
        const { direction, velocity } = useAppStore.getState().scroll;
        const speed = 3.2 + Math.min(18, Math.abs(velocity) * 0.45);
        xPercent -= direction * speed * dt;

        if (xPercent <= -50) xPercent += 50;
        if (xPercent > 0) xPercent -= 50;

        track.style.transform = `translate3d(${xPercent.toFixed(4)}%, 0, 0)`;
      };

      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="research"
      ref={sectionRef}
      className="relative min-h-[170vh] w-full overflow-x-clip py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10">
        <span className="font-mono-label mb-8 block text-[var(--surface-muted)]">
          05 · RESEARCH
        </span>
      </div>

      {/* Full-width velocity marquee */}
      <div
        aria-hidden="true"
        className="my-10 w-full overflow-hidden border-y border-[var(--surface-border)] py-6"
      >
        <div
          ref={marqueeTrackRef}
          className="flex w-max items-center whitespace-nowrap will-change-transform"
        >
          {[0, 1].map((dupIdx) => (
            <div key={dupIdx} className="flex items-center">
              {RESEARCH_INTERESTS.map((r) => (
                <span
                  key={`${dupIdx}-${r.id}`}
                  className="inline-flex items-center gap-8 px-6 text-[clamp(2.6rem,8vw,8rem)] font-extralight leading-none tracking-[-0.03em] text-transparent"
                  style={{ WebkitTextStroke: "1px var(--surface-fg)" }}
                >
                  <span>{r.title}</span>
                  <span className="text-[0.55em] not-italic text-[var(--surface-fg)]">
                    ◢
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Accordion rows */}
      <div className="mx-auto mt-16 w-full max-w-[1440px] border-t border-[var(--surface-border)] px-6 md:px-10 lg:mt-24">
        {RESEARCH_INTERESTS.map((item) => (
          <ResearchAccordionRow
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            reducedMotion={reducedMotion}
            onToggle={() =>
              setOpenId((prev) => (prev === item.id ? null : item.id))
            }
          />
        ))}
      </div>
    </section>
  );
}
