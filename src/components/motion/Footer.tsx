"use client";

import React from "react";
import {
  ArrowUp,
  Terminal,
  ExternalLink,
  Award,
  Briefcase,
  GraduationCap,
  Globe,
} from "lucide-react";
import { ACHIEVEMENTS, EXPERIENCE } from "@/data/experience";
import { PROFILE } from "@/data/profile";
import { useExperience } from "@/context/ExperienceProvider";

export function Footer() {
  const { scrollTo, setTerminalOpen } = useExperience();

  return (
    <footer id="experience" className="relative z-10 pb-20 pt-16">
      {/* Anchor for backwards compatibility with #about */}
      <span id="about" className="sr-only" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Experience & Milestones 2-column Layout */}
        <div className="grid grid-cols-1 gap-10 border-t border-white/12 pt-16 lg:grid-cols-12 items-start">
          {/* Left Column: Work & Leadership Experience */}
          <div className="lg:col-span-7 liquid-glass-frame rounded-3xl p-6 sm:p-8">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#38bdf8]" />
                <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  Engineering Experience
                </h2>
              </div>
              <span className="font-mono text-xs text-white/40">2024 — Present</span>
            </div>

            <div className="mt-6 divide-y divide-white/10">
              {EXPERIENCE.map((item) => (
                <div
                  key={`${item.period}-${item.role}`}
                  className="py-5 space-y-2 first:pt-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[#9bc1ff] font-medium">
                      {item.period}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-white/60">
                      {item.type}
                    </span>
                  </div>

                  <div className="text-base font-medium text-white">
                    {item.role}{" "}
                    <span className="font-normal text-white/50">
                      · {item.organization}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-white/40">
                    {item.location}
                  </div>

                  <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-[#9caec5] leading-relaxed list-disc list-inside">
                    {item.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Milestones & Education */}
          <div className="space-y-8 lg:col-span-5">
            {/* Milestones Card */}
            <div className="liquid-glass-frame rounded-3xl p-6 sm:p-8">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#facc15]" />
                  <h2 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                    Verified Honors
                  </h2>
                </div>
                <span className="font-mono text-xs text-[#9bc1ff]">07 Awards</span>
              </div>

              <div className="mt-6 divide-y divide-white/10">
                {ACHIEVEMENTS.map((ach) => (
                  <div
                    key={ach.title}
                    className="py-3.5 flex flex-col gap-1 first:pt-0"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-white">
                        {ach.title}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] font-semibold text-[#9bc1ff]">
                        {ach.metric}
                      </span>
                    </div>
                    <div className="text-xs text-white/50 font-mono">
                      {ach.organization} · {ach.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Card */}
            <div className="liquid-glass-frame rounded-2xl p-6">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
                <GraduationCap className="h-4 w-4 text-[#38bdf8]" />
                <span>Academic Record</span>
              </div>

              <div className="mt-3 text-base font-medium text-white">
                {PROFILE.education.degree}
              </div>
              <div className="mt-1 text-sm text-[#9caec5]">
                {PROFILE.education.institution}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="rounded-md bg-[#34d399]/10 border border-[#34d399]/30 px-2.5 py-1 text-[#34d399] font-semibold">
                  CGPA: {PROFILE.education.cgpa}
                </span>
                <span className="text-white/60">
                  {PROFILE.education.period}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 font-mono text-xs text-white/50">
                <Globe className="h-3.5 w-3.5 text-white/40" />
                <span>Languages: {PROFILE.education.languages.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Editorial Footer Sign-off */}
        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-white/50">
            <span>© {new Date().getFullYear()} {PROFILE.name}</span>
            <span>·</span>
            <span>B.Tech Mechatronics & Automation, VIT Chennai</span>
            <span>·</span>
            <span>{PROFILE.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-white/40" />
            </a>

            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>LinkedIn</span>
              <ExternalLink className="h-3 w-3 text-white/40" />
            </a>

            <button
              type="button"
              onClick={() => setTerminalOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs text-white/60 hover:text-[#9bc1ff] transition-colors"
            >
              <Terminal className="h-3.5 w-3.5 text-[#34d399]" />
              <span>terminal (`)</span>
            </button>

            <button
              type="button"
              onClick={() => scrollTo("#hero")}
              aria-label="Scroll to top of page"
              className="inline-flex cursor-pointer items-center gap-1 hover:text-white transition-colors"
            >
              <span>Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}