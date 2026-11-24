"use client";

import { useEffect } from "react";
import type { ProjectRecord } from "@/data/projects";
import { useAppStore } from "@/store/useAppStore";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LetterRoll } from "@/components/ui/LetterRoll";
import { SplitReveal } from "@/components/ui/SplitReveal";

export interface CaseHeroProps {
  project: ProjectRecord;
}

export function CaseHero({ project }: CaseHeroProps) {
  useEffect(() => {
    const numericIndex = Number.parseInt(project.index, 10);
    useAppStore.getState().set({
      accent: project.accent,
      surface: "dark",
      wipe: { progress: 0, origin: [0.5, 0.5] },
      camera: { key: "case", t: 0 },
      section: {
        id: "case",
        index: Number.isNaN(numericIndex) ? 3 : numericIndex,
        label: project.shortTitle.toUpperCase(),
        progress: 0,
      },
    });
  }, [project.accent, project.index, project.shortTitle]);

  return (
    <header className="relative mx-auto w-full max-w-6xl px-6 pt-28 pb-16 md:px-10 md:pt-36 md:pb-24">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <TransitionLink
          href="/#work"
          cursor="view"
          className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-subtle)] transition-colors hover:text-[var(--surface-fg)]"
        >
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          <LetterRoll text="All Work" trigger="hover" />
        </TransitionLink>

        {project.patentStatus ? (
          <span
            className="inline-flex items-center gap-2 border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{
              borderColor: `${project.accent}66`,
              backgroundColor: `${project.accent}14`,
              color: project.accent,
            }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: project.accent }}
            />
            {project.patentStatus}
          </span>
        ) : null}
      </div>

      {/* Accent-tinted index & category hairline */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span
          className="font-mono text-xs uppercase tracking-[0.16em]"
          style={{ color: project.accent }}
        >
          CASE {project.index}
        </span>
        <span
          aria-hidden="true"
          className="h-px w-10"
          style={{ backgroundColor: `${project.accent}80` }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-muted)]">
          {project.category}
        </span>
      </div>

      <SplitReveal
        as="h1"
        type="lines"
        mode="mount"
        className="max-w-4xl text-[clamp(2.4rem,5vw,5.2rem)] font-light leading-[1.04] tracking-[-0.025em] text-[var(--surface-fg)]"
      >
        {project.title}
      </SplitReveal>

      <SplitReveal
        as="p"
        type="words"
        mode="mount"
        delay={0.18}
        stagger={0.02}
        duration={0.9}
        className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-[var(--surface-subtle)] md:text-xl"
      >
        {project.oneLiner}
      </SplitReveal>

      {/* Metadata strip */}
      <dl
        className="mt-12 grid grid-cols-1 gap-6 border-y py-6 sm:grid-cols-3 md:gap-8"
        style={{ borderColor: "var(--surface-border)" }}
      >
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--surface-muted)]">
            Year
          </dt>
          <dd className="mt-1.5 font-mono text-sm text-[var(--surface-fg)]">
            {project.year}
          </dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--surface-muted)]">
            Role
          </dt>
          <dd className="mt-1.5 text-sm font-light leading-snug text-[var(--surface-fg)]">
            {project.personalRole}
          </dd>
        </div>

        <div>
          <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--surface-muted)]">
            Team
          </dt>
          <dd className="mt-1.5 text-sm font-light leading-snug text-[var(--surface-fg)]">
            {project.teamSize}
          </dd>
        </div>
      </dl>

      {/* Accent hairline */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{
          background: `linear-gradient(90deg, ${project.accent} 0%, transparent 65%)`,
        }}
      />
    </header>
  );
}
