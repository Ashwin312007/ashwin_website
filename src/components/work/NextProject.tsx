"use client";

import type { ProjectRecord } from "@/data/projects";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { TriangleCover } from "@/components/ui/TriangleCover";
import { LetterRoll } from "@/components/ui/LetterRoll";

export interface NextProjectProps {
  project: ProjectRecord;
}

export function NextProject({ project }: NextProjectProps) {
  return (
    <section
      aria-label="Next case study"
      className="mx-auto w-full max-w-6xl px-6 pt-8 pb-28 md:px-10 md:pt-12 md:pb-32"
    >
      <TransitionLink
        href={`/work/${project.id}`}
        cursor="view"
        cursorTip="NEXT CASE STUDY"
        className="group relative isolate block w-full overflow-hidden border border-[var(--surface-border)] bg-[#0A0A0A]/90 transition-colors duration-300"
      >
        <TriangleCover
          variant="hover"
          fillColor="#FAFAFA"
          className="!absolute inset-0 h-full w-full"
        />

        <div className="relative z-10 flex flex-col justify-between gap-8 px-6 py-10 mix-blend-difference md:flex-row md:items-end md:px-10 md:py-14">
          <div className="min-w-0">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#FAFAFA]">
              <span>NEXT CASE · {project.index}</span>
              <span aria-hidden="true" className="h-px w-6 bg-current opacity-50" />
              <span className="opacity-75">{project.category}</span>
            </div>

            <h2 className="mt-4 text-[clamp(1.8rem,4vw,3.6rem)] font-light leading-[1.06] tracking-[-0.02em] text-[#FAFAFA]">
              <LetterRoll text={project.title} trigger="hover" />
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-[#FAFAFA]">
            <span>VIEW CASE</span>
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </div>
        </div>
      </TransitionLink>
    </section>
  );
}
