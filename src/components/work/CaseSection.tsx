"use client";

import type { ReactNode } from "react";
import type { ProjectRecord } from "@/data/projects";
import { SplitReveal } from "@/components/ui/SplitReveal";

export interface CaseSectionProps {
  project: ProjectRecord;
}

interface SectionBlockProps {
  index: string;
  title: string;
  accent: string;
  children: ReactNode;
}

function SectionBlock({ index, title, accent, children }: SectionBlockProps) {
  return (
    <section className="grid grid-cols-1 gap-6 border-t border-[var(--surface-border)] py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <div className="md:col-span-4">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: accent }}
          >
            {index}
          </span>
          <span
            aria-hidden="true"
            className="h-px w-6"
            style={{ backgroundColor: `${accent}66` }}
          />
        </div>
        <SplitReveal
          as="h2"
          type="lines"
          mode="scroll"
          className="mt-3 text-2xl font-light tracking-[-0.02em] text-[var(--surface-fg)] md:text-3xl"
        >
          {title}
        </SplitReveal>
      </div>

      <div className="md:col-span-8">{children}</div>
    </section>
  );
}

function SpecList({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="flex items-start gap-4 border border-[var(--surface-border)] bg-[#0A0A0A]/80 px-5 py-4 backdrop-blur-md"
        >
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <span className="text-sm font-light leading-relaxed text-[var(--surface-subtle)] md:text-base">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CaseSection({ project }: CaseSectionProps) {
  const orderedListSections: {
    index: string;
    title: string;
    items: string[];
  }[] = [
    {
      index: "02",
      title: "System Architecture",
      items: project.systemArchitecture,
    },
    {
      index: "03",
      title: "Mechanical Design",
      items: project.mechanicalDesign,
    },
    {
      index: "04",
      title: "Electronics & Hardware",
      items: project.electronicsHardware,
    },
    {
      index: "05",
      title: "Embedded Software",
      items: project.embeddedSoftware,
    },
    {
      index: "06",
      title: "Control Algorithms",
      items: project.controlAlgorithms,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
      {/* 01 · Summary */}
      <SectionBlock index="01" title="Summary" accent={project.accent}>
        <div className="border border-[var(--surface-border)] bg-[#0A0A0A]/80 p-6 backdrop-blur-md md:p-8">
          <p className="text-base font-light leading-relaxed text-[var(--surface-fg)] md:text-lg">
            {project.summary}
          </p>

          {project.tags.length > 0 ? (
            <ul
              aria-label="Engineering stack and keywords"
              className="mt-6 flex flex-wrap gap-2 border-t border-[var(--surface-border)] pt-6"
            >
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-[var(--surface-border)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--surface-subtle)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </SectionBlock>

      {/* 02–06 · Core Mechatronic Subsystems */}
      {orderedListSections.map((sec) => (
        <SectionBlock
          key={sec.index}
          index={sec.index}
          title={sec.title}
          accent={project.accent}
        >
          <SpecList items={sec.items} accent={project.accent} />
        </SectionBlock>
      ))}

      {/* 07 · Simulation vs Physical (Two-column comparison) */}
      <SectionBlock
        index="07"
        title="Simulation vs Physical"
        accent={project.accent}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col justify-between border border-[var(--surface-border)] bg-[#0A0A0A]/80 p-6 backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--surface-muted)]">
                  07A · Simulation Model
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--surface-muted)]">
                  DIGITAL
                </span>
              </div>
              <p className="mt-5 text-sm font-light leading-relaxed text-[var(--surface-subtle)] md:text-base">
                {project.simulationVsPhysical.simulation}
              </p>
            </div>
          </div>

          <div
            className="flex flex-col justify-between border bg-[#0A0A0A]/85 p-6 backdrop-blur-md"
            style={{ borderColor: `${project.accent}55` }}
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-3">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: project.accent }}
                >
                  07B · Physical Prototype
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: project.accent }}
                >
                  HARDWARE
                </span>
              </div>
              <p className="mt-5 text-sm font-light leading-relaxed text-[var(--surface-fg)] md:text-base">
                {project.simulationVsPhysical.physical}
              </p>
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* 08 · Testing & Validation */}
      <SectionBlock
        index="08"
        title="Testing & Validation"
        accent={project.accent}
      >
        <SpecList items={project.testingValidation} accent={project.accent} />
      </SectionBlock>

      {/* 09 · Challenges */}
      <SectionBlock index="09" title="Challenges" accent={project.accent}>
        <SpecList items={project.challenges} accent={project.accent} />
      </SectionBlock>
    </div>
  );
}
