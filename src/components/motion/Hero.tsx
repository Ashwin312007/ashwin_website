"use client";

import React from "react";
import { ArrowDownRight, FileText, ExternalLink } from "lucide-react";
import { PROFILE } from "@/data/profile";
import { useExperience } from "@/context/ExperienceProvider";

export function Hero() {
  const { scrollTo } = useExperience();

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-[85vh] flex-col justify-between pt-20 pb-12 sm:pt-28 sm:pb-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#080d1a]/80 px-4 py-2.5 text-xs text-white/70 font-mono backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_6px_#34d399]" />
            <span>{PROFILE.location}</span>
          </div>
          <span>B.Tech Mechatronics · VIT Chennai</span>
          <span className="text-[#9bc1ff]">{PROFILE.status}</span>
        </div>

        {/* Left-aligned so the 3D Solar-System & Fiber-Cable Rig shines on the Right side */}
        <div className="mt-10 max-w-xl sm:mt-14 lg:max-w-2xl liquid-glass-frame rounded-3xl p-8 sm:p-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-xs text-[#7dd3fc] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span>Robotics & Embedded Hardware</span>
          </div>
          <h1 className="text-4xl font-medium leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.5rem]">
            {PROFILE.name}
          </h1>
          <p className="mt-5 max-w-lg text-lg font-normal leading-relaxed text-[#c6d7eb] sm:text-2xl">
            Building tendon-driven soft robots, ROS 2 navigation stacks, and
            embedded control hardware.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-white/10 bg-[#080d1a]/80 px-6 py-4 backdrop-blur-md">
          <button
            type="button"
            onClick={() => scrollTo("#work")}
            className="group inline-flex cursor-pointer items-center gap-2 text-sm text-white transition-colors hover:text-[#9bc1ff]"
          >
            <span>Scroll to selected work (08)</span>
            <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </button>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-white/40" />
            </a>
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              <span>LinkedIn</span>
              <ExternalLink className="h-3 w-3 text-white/40" />
            </a>
            <a
              href={PROFILE.resumePath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#9bc1ff] transition-colors hover:text-white"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Résumé</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
