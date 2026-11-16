"use client";

import React from "react";
import {
  Compass,
  FlaskConical,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { RESEARCH_INTERESTS, ResearchInterestRecord } from "@/data/research";
import { useExperience } from "@/context/ExperienceProvider";

const ICON_MAP: Record<string, React.ReactNode> = {
  "animal-peristalsis": <Compass className="h-4 w-4 text-[#38bdf8]" />,
  "soft-compliant-mechanisms": <Layers className="h-4 w-4 text-[#a78bfa]" />,
  "confined-space-locomotion": <Activity className="h-4 w-4 text-[#34d399]" />,
  "bio-mechanical-design": <FlaskConical className="h-4 w-4 text-[#f59e0b]" />,
  "embedded-realtime-control": <Cpu className="h-4 w-4 text-[#60a5fa]" />,
  "sensor-fusion-estimation": <Sparkles className="h-4 w-4 text-[#ec4899]" />,
};

export function ResearchInterests() {
  const { scrollTo } = useExperience();

  return (
    <section id="research" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 rounded-2xl border border-white/10 bg-[#080d1a]/80 p-6 backdrop-blur-md mb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
              <FlaskConical className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span>Theoretical & Experimental Inquiries</span>
            </div>
            <h2 className="mt-1 text-3xl font-medium tracking-tight text-white sm:text-5xl">
              Research Thrusts
            </h2>
          </div>
          <span className="font-mono text-xs text-white/45">06 Active Thrusts</span>
        </div>

        {/* Framing / Demarcation Callout */}
        <div className="mb-10 rounded-xl border border-[#38bdf8]/20 bg-[#38bdf8]/5 p-4 sm:p-5 text-xs sm:text-sm text-[#9caec5] leading-relaxed">
          <p className="flex items-start gap-2.5">
            <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span>
              <strong className="text-white font-medium">Research Scope vs. Physical Deployments:</strong>{" "}
              These thrusts represent foundational inquiries in continuum biomechanics, hyperelastic metamaterials, and optimal control theory. They drive formulation, Gazebo/Webots physics simulation, and coupon testing—distinct from the integrated physical machines in{" "}
              <button
                type="button"
                onClick={() => scrollTo("#work")}
                className="inline-flex items-center text-[#9bc1ff] underline underline-offset-2 hover:text-white transition-colors cursor-pointer"
              >
                Selected Work <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </button>
              .
            </span>
          </p>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESEARCH_INTERESTS.map((item: ResearchInterestRecord) => {
            const isTheoretical = item.status === "Theoretical Formulation";

            return (
              <div
                key={item.id}
                className="liquid-glass-frame rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/25 hover:shadow-[0_8px_32px_rgba(56,189,248,0.12)]"
              >
                {/* Header & Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/70">
                      {ICON_MAP[item.id] || <FlaskConical className="h-3.5 w-3.5" />}
                      <span>{item.category}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                        isTheoretical
                          ? "border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#fcd34d]"
                          : "border-[#34d399]/40 bg-[#34d399]/10 text-[#6ee7b7]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isTheoretical
                            ? "bg-[#f59e0b]"
                            : "bg-[#34d399] animate-pulse"
                        }`}
                      />
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-white sm:text-xl tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  {/* Core Hypothesis Block */}
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#9bc1ff] mb-1">
                      Working Hypothesis
                    </div>
                    <p className="text-xs text-[#c6d7eb] leading-relaxed italic">
                      &ldquo;{item.hypothesis}&rdquo;
                    </p>
                  </div>

                  {/* Experimental Methodology */}
                  <div className="mt-4 space-y-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                      Experimental Methodology
                    </div>
                    <p className="text-xs text-[#9caec5] leading-relaxed">
                      {item.methodology}
                    </p>
                  </div>

                  {/* Relevance to Robotics */}
                  <div className="mt-4 space-y-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                      Robotics Impact & Application
                    </div>
                    <p className="text-xs text-[#9caec5] leading-relaxed">
                      {item.relevanceToRobotics}
                    </p>
                  </div>
                </div>

                {/* Footer: Related Projects */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-white/40">Related Track:</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {item.relatedProjects.map((projId) => (
                      <button
                        key={projId}
                        type="button"
                        onClick={() => scrollTo("#work")}
                        className="rounded bg-white/5 px-2 py-0.5 text-[#9bc1ff] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      >
                        #{projId}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}