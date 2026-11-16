"use client";

import React from "react";
import {
  Bot,
  Activity,
  Boxes,
  Cpu,
  Eye,
  Zap,
  Sparkles,
} from "lucide-react";
import { CAPABILITIES, CapabilityRecord } from "@/data/capabilities";
import { useExperience } from "@/context/ExperienceProvider";

const CAPABILITY_GLYPHS: Record<CapabilityRecord["glyphType"], React.ReactNode> = {
  ros2: <Bot className="h-4 w-4 text-[#38bdf8]" />,
  ekf: <Activity className="h-4 w-4 text-[#a78bfa]" />,
  cad: <Boxes className="h-4 w-4 text-[#34d399]" />,
  embedded: <Cpu className="h-4 w-4 text-[#f59e0b]" />,
  vision: <Eye className="h-4 w-4 text-[#ec4899]" />,
  electronics: <Zap className="h-4 w-4 text-[#eab308]" />,
};

export function Capabilities() {
  const { setHoveredCapability } = useExperience();

  return (
    <section
      id="capabilities"
      onMouseLeave={() => setHoveredCapability(null)}
      className="relative z-10 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 rounded-2xl border border-white/10 bg-[#080d1a]/80 p-6 backdrop-blur-md mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
              <Sparkles className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span>Technical Toolkit & Disciplines</span>
            </div>
            <h2 className="mt-1 text-3xl font-medium tracking-tight text-white sm:text-5xl">
              Capabilities & Stack
            </h2>
          </div>
          <span className="font-mono text-xs text-white/45">01 — 06 Disciplines</span>
        </div>

        {/* 6-Card Responsive Grid (All visible without clicking) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.index}
              onMouseEnter={() => setHoveredCapability(cap)}
              className="liquid-glass-frame rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:border-white/30 hover:shadow-[0_8px_32px_rgba(56,189,248,0.15)] group"
            >
              <div>
                {/* Header: Index & Glyph */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 font-mono text-xs font-semibold text-[#9bc1ff] group-hover:border-[#9bc1ff]/60 group-hover:bg-[#9bc1ff]/10 transition-colors">
                      {cap.index}
                    </span>
                    <span className="font-mono text-xs text-white/40">Domain</span>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    {CAPABILITY_GLYPHS[cap.glyphType]}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="mt-5 text-xl font-medium tracking-tight text-white sm:text-2xl">
                  {cap.title}
                </h3>
                <p className="mt-1 text-xs text-[#9bc1ff] font-mono">
                  {cap.subtitle}
                </p>

                {/* Deep Engineering Description */}
                <p className="mt-4 text-xs sm:text-sm text-[#9caec5] leading-relaxed">
                  {cap.description}
                </p>

                {/* Skill Badges */}
                <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {cap.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/75"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Applied In Projects Footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-start gap-2 text-xs font-mono">
                  <span className="text-white/40 shrink-0">Applied in:</span>
                  <span className="text-[#c6d7eb] leading-snug">
                    {cap.appliedIn.join(" · ")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}