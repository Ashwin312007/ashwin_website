"use client";

import React, { useState, useMemo } from "react";
import { PROJECTS, ProjectRecord } from "@/data/projects";
import { ProjectCard } from "@/components/motion/ProjectCard";
import { WorkModal } from "@/components/motion/WorkModal";
import { Layers } from "lucide-react";

type CategoryFilter =
  | "all"
  | "biomimicry"
  | "robotics"
  | "embedded-control"
  | "vision-medical";

interface FilterOption {
  id: CategoryFilter;
  label: string;
}

const CATEGORIES: FilterOption[] = [
  { id: "all", label: "All" },
  { id: "biomimicry", label: "Biomimicry" },
  { id: "robotics", label: "Robotics & Autonomy" },
  { id: "embedded-control", label: "Embedded & Control" },
  { id: "vision-medical", label: "Medical & Vision" },
];

export function ProjectShowcase() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(
    null
  );

  // Compute category project counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: PROJECTS.length,
      biomimicry: 0,
      robotics: 0,
      "embedded-control": 0,
      "vision-medical": 0,
    };
    PROJECTS.forEach((p) => {
      if (counts[p.categoryGroup] !== undefined) {
        counts[p.categoryGroup]++;
      }
    });
    return counts;
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.categoryGroup === activeCategory);
  }, [activeCategory]);

  return (
    <section
      id="work"
      aria-labelledby="showcase-heading"
      className="relative z-20 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8 sm:pb-12">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-[#9bc1ff]">
              <span className="flex h-2 w-2 rounded-full bg-[#9bc1ff] animate-pulse" />
              <span>{"// 01 · SYSTEM SHOWCASE"}</span>
            </div>

            <h2
              id="showcase-heading"
              className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              Selected Engineering Projects
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-[#9caec5]">
              Mechatronic systems, biomimetic crawlers, autonomous mobile robots,
              and precision medical devices engineered from first principles with
              rigorous CAD/FEA, state estimation, and physical validation.
            </p>
          </div>

          {/* Project Counter Badge */}
          <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-white/80 self-start md:self-auto backdrop-blur-sm">
            <Layers className="h-4 w-4 text-[#9bc1ff]" />
            <span>
              {filteredProjects.length === PROJECTS.length
                ? `${PROJECTS.length} Projects Total`
                : `${filteredProjects.length} of ${PROJECTS.length} Projects`}
            </span>
          </div>
        </div>

        {/* CATEGORY FILTER BAR */}
        <div className="my-8 sm:my-10">
          <div
            role="tablist"
            aria-label="Filter projects by engineering discipline"
            className="flex flex-wrap items-center gap-2 sm:gap-2.5"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;

              return (
                <button
                  key={cat.id}
                  role="tab"
                  id={`filter-tab-${cat.id}`}
                  aria-selected={isActive}
                  aria-controls="project-grid"
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bc1ff] ${
                    isActive
                      ? "border-[#9bc1ff]/60 bg-[#9bc1ff]/15 text-white font-medium shadow-[0_0_15px_-3px_rgba(155,193,255,0.3)]"
                      : "border-white/12 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] transition-colors ${
                      isActive
                        ? "bg-[#9bc1ff] text-black font-semibold"
                        : "bg-white/10 text-white/50 group-hover:text-white"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RESPONSIVE PROJECTS GRID */}
        <div
          id="project-grid"
          role="region"
          aria-live="polite"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {filteredProjects.map((project, index) => {
            // In "all" category, give featured projects visual prominence:
            // bio-pipe-robot spans 2 columns on desktop (row 1: 2 + 1 = 3 cols)
            // archerfish-ejection spans 1 column on desktop (complements row 1)
            // Both span 2 columns on tablet
            const isFeatured = project.featured;
            const isFirstFeaturedInAll =
              activeCategory === "all" && project.id === "bio-pipe-robot";
            const isSecondFeaturedInAll =
              activeCategory === "all" && project.id === "archerfish-ejection";

            let gridSpanClass = "col-span-1";
            if (isFirstFeaturedInAll) {
              gridSpanClass = "col-span-1 md:col-span-2 lg:col-span-2";
            } else if (isSecondFeaturedInAll) {
              gridSpanClass = "col-span-1 md:col-span-2 lg:col-span-1";
            }

            return (
              <div key={project.id} className={gridSpanClass}>
                <ProjectCard
                  project={project}
                  onSelect={setSelectedProject}
                  isFeatured={isFeatured}
                  priority={index < 2}
                />
              </div>
            );
          })}
        </div>

        {/* BOTTOM METRIC SUMMARY BANNER */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
            <div>
              <div className="text-2xl sm:text-3xl font-light text-[#9bc1ff]">08</div>
              <div className="mt-1 text-[11px] text-white/45 uppercase">Full Mechatronic Systems</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-light text-amber-300">02</div>
              <div className="mt-1 text-[11px] text-white/45 uppercase">Patents Disclosed (IPR)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-light text-[#34d399]">6th</div>
              <div className="mt-1 text-[11px] text-white/45 uppercase">Global Rank (NASA HERC)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-light text-white">100%</div>
              <div className="mt-1 text-[11px] text-white/45 uppercase">Bench & Field Validated</div>
            </div>
          </div>
        </div>
      </div>

      {/* EVIDENCE-FIRST CASE STUDY MODAL */}
      <WorkModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
