"use client";

import type { ProjectMedia, ProjectRecord } from "@/data/projects";
import { TriangleCover } from "@/components/ui/TriangleCover";
import { SplitReveal } from "@/components/ui/SplitReveal";

export interface CaseGalleryProps {
  project: ProjectRecord;
}

function MediaSpecPlate({
  item,
  project,
  itemIndex,
}: {
  item: ProjectMedia;
  project: ProjectRecord;
  itemIndex: number;
}) {
  return (
    <div className="relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden border border-[var(--surface-border)] bg-[#101010]/90 p-6 backdrop-blur-md md:p-8">
      {/* Subtle geometric calibration grid */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 250"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      >
        <defs>
          <pattern
            id={`grid-${project.id}-${itemIndex}`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect
          width="400"
          height="250"
          fill={`url(#grid-${project.id}-${itemIndex})`}
        />
        <line
          x1="0"
          y1="250"
          x2="400"
          y2="0"
          stroke={project.accent}
          strokeOpacity="0.35"
          strokeWidth="0.8"
          strokeDasharray="4 4"
        />
      </svg>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: project.accent }}
        >
          SPEC PLATE · {project.index}.{String(itemIndex + 1).padStart(2, "0")}
        </span>
        <span className="border border-[var(--surface-border)] bg-[#0A0A0A]/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--surface-subtle)]">
          {item.type}
        </span>
      </div>

      <div className="relative z-10 my-auto py-4">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--surface-fg)] md:text-sm">
          {item.placeholderNote ?? "Hardware Documentation Pending"}
        </p>
        <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-[var(--surface-muted)]">
          {item.caption}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-[var(--surface-border)] pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--surface-muted)]">
        <span>{project.shortTitle}</span>
        <span>{project.motionType}</span>
      </div>
    </div>
  );
}

export function CaseGallery({ project }: CaseGalleryProps) {
  if (project.media.length === 0) return null;

  return (
    <section
      aria-label="Engineering media and documentation"
      className="mx-auto w-full max-w-6xl border-t border-[var(--surface-border)] px-6 py-12 md:px-10 md:py-16"
    >
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: project.accent }}
          >
            10 · HARDWARE & MEDIA
          </span>
          <SplitReveal
            as="h2"
            type="lines"
            mode="scroll"
            className="mt-3 text-2xl font-light tracking-[-0.02em] text-[var(--surface-fg)] md:text-3xl"
          >
            Visual Documentation
          </SplitReveal>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--surface-muted)]">
          {project.media.length}{" "}
          {project.media.length === 1 ? "ARTIFACT" : "ARTIFACTS"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {project.media.map((item, idx) => {
          const hasRealImage = Boolean(!item.isPlaceholder && item.url);
          return (
            <figure
              key={`${project.id}-media-${idx}`}
              className="overflow-hidden border border-[var(--surface-border)] bg-[#0A0A0A]/80"
            >
              {hasRealImage && item.url ? (
                <TriangleCover
                  variant="reveal"
                  imageSrc={item.url}
                  imageAlt={item.caption}
                  className="aspect-[16/10] w-full bg-[#121212]"
                />
              ) : (
                <MediaSpecPlate item={item} project={project} itemIndex={idx} />
              )}

              <figcaption className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--surface-border)] px-5 py-4">
                <span className="text-sm font-light text-[var(--surface-subtle)]">
                  {item.caption}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--surface-muted)]">
                  FIG {project.index}.{idx + 1} · {item.type}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
