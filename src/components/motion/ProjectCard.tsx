"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  ShieldAlert,
  User,
  Sparkles,
  CameraOff,
} from "lucide-react";
import { ProjectRecord } from "@/data/projects";

export interface ProjectCardProps {
  project: ProjectRecord;
  onSelect: (project: ProjectRecord) => void;
  isFeatured?: boolean;
  priority?: boolean;
}

export function ProjectCard({
  project,
  onSelect,
  isFeatured = false,
  priority = false,
}: ProjectCardProps) {
  const primaryMedia = project.media?.[0];
  const hasRealImage =
    Boolean(primaryMedia?.url) && !primaryMedia?.isPlaceholder;

  const primaryMetric = project.metrics?.[0];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`View technical case study for ${project.title}`}
      onClick={() => onSelect(project)}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bc1ff] cursor-pointer liquid-glass-card ${
        isFeatured
          ? "border-[#9bc1ff]/30 shadow-[0_0_35px_-10px_rgba(155,193,255,0.18)]"
          : "border-white/12 hover:border-white/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.7)]"
      }`}
      style={{
        ["--project-accent" as string]: project.accent,
      }}
    >
      {/* Top ambient color glow on hover */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{ backgroundColor: project.accent }}
        aria-hidden="true"
      />

      <div>
        {/* CARD MEDIA / BLUEPRINT HEADER */}
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-[#06080c]">
          {hasRealImage && primaryMedia?.url ? (
            <>
              <Image
                src={primaryMedia.url}
                alt={primaryMedia.caption || `${project.title} physical prototype`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080c] via-transparent to-black/30" />
            </>
          ) : (
            /* TECHNICAL BLUEPRINT WIREFRAME (NO AI / NO STOCK) */
            <div className="relative flex h-full w-full flex-col justify-between p-4 font-mono select-none">
              {/* Technical CAD Grid Pattern */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(155,193,255,0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(155,193,255,0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />

              {/* Wireframe Crosshairs & Compass Geometry */}
              <svg
                className="absolute inset-0 h-full w-full opacity-20 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="10%"
                  y1="50%"
                  x2="90%"
                  y2="50%"
                  stroke="#9bc1ff"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1="50%"
                  y1="10%"
                  x2="50%"
                  y2="90%"
                  stroke="#9bc1ff"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="24%"
                  fill="none"
                  stroke="#9bc1ff"
                  strokeWidth="1"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="36%"
                  fill="none"
                  stroke="#9bc1ff"
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
              </svg>

              {/* Blueprint Top Info Bar */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-white/50">
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: project.accent }}
                  />
                  <span>CAD_SPEC // {project.motionType.toUpperCase()}</span>
                </span>
                <span className="text-[#9bc1ff]/80">REV 2.6</span>
              </div>

              {/* Centered Explicit Ashwin Photograph Notice */}
              <div className="relative z-10 mx-auto my-auto max-w-[92%] rounded-md border border-white/15 bg-[#0a0f1d]/90 p-2.5 text-center shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-300">
                  <CameraOff className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>HARDWARE CAPTURE NOTICE</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-white/80 leading-snug">
                  {primaryMedia?.placeholderNote ||
                    "[TODO: Hardware Photograph / Testing Video from Ashwin]"}
                </p>
              </div>

              {/* Blueprint Bottom Coordinate Readout */}
              <div className="relative z-10 flex items-center justify-between text-[9px] text-white/40">
                <span>COORD [X: 13.08, Y: 80.27]</span>
                <span>STATUS: BENCH VALIDATED</span>
              </div>
            </div>
          )}

          {/* Top Overlaid Badges */}
          <div className="absolute left-3 top-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="rounded border border-white/20 bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white backdrop-blur-md">
                {project.index}
              </span>
              <span className="rounded border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[10px] text-white/70 backdrop-blur-md">
                {project.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {project.patentStatus && (
                <span className="flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-200 backdrop-blur-md">
                  <ShieldAlert className="h-3 w-3 text-amber-300" />
                  <span>Patent Pending</span>
                </span>
              )}
              {isFeatured && (
                <span className="flex items-center gap-1 rounded border border-[#9bc1ff]/40 bg-[#9bc1ff]/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#9bc1ff] backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  <span>Featured</span>
                </span>
              )}
            </div>
          </div>

          {/* Bottom Year Tag Overlaid */}
          <div className="absolute bottom-2.5 right-3 z-20">
            <span className="rounded border border-white/15 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/70 backdrop-blur-md">
              {project.year}
            </span>
          </div>
        </div>

        {/* CARD CONTENT */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-lg font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-[#9bc1ff]">
              {project.title}
            </h3>
            {/* Personal Role */}
            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-[#9caec5]">
              <User className="h-3.5 w-3.5 shrink-0 text-[#9bc1ff] mt-0.5" />
              <span className="line-clamp-1 font-mono text-[11px] text-[#9caec5]/90">
                {project.personalRole}
              </span>
            </div>
          </div>

          {/* One-Liner Description */}
          <p className="text-xs leading-relaxed text-[#9caec5] line-clamp-3">
            {project.oneLiner}
          </p>

          {/* Key Metric Badge */}
          {primaryMetric && (
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs">
              <span className="text-[11px] text-white/50">{primaryMetric.label}:</span>
              <span
                className="font-semibold tracking-tight"
                style={{ color: project.accent }}
              >
                {primaryMetric.value}
              </span>
            </div>
          )}

          {/* Technical Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-white/60 transition-colors group-hover:border-white/20 group-hover:text-white/80"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 5 && (
              <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[10px] text-white/40">
                +{project.tags.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CARD ACTION FOOTER */}
      <div className="border-t border-white/10 bg-[#06080c]/60 px-5 py-3.5 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-white/45 group-hover:text-white/70 transition-colors">
            Detailed Case Study
          </span>
          <span className="flex items-center gap-1 font-mono text-xs font-medium text-[#9bc1ff] transition-transform duration-300 group-hover:translate-x-0.5">
            <span>View Architecture</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
