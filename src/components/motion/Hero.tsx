"use client";

import React from "react";
import {
  ArrowDown,
  Download,
  ExternalLink,
  Award,
  FileCheck2,
  CalendarCheck,
  Mail,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { PROFILE } from "@/data/profile";
import { useExperience } from "@/context/ExperienceProvider";

export function Hero() {
  const { scrollTo } = useExperience();

  return (
    <section
      id="hero"
      aria-label="Introduction & Engineering Overview"
      className="relative z-10 flex min-h-[90vh] flex-col justify-between pt-20 pb-12 sm:pt-28 sm:pb-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        {/* Top Status & Location Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#080d1a]/80 px-4 py-3 text-xs text-white/70 font-mono backdrop-blur-md">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-[#34d399]" />
            <span>Chennai, India</span>
          </div>

          <div className="flex items-center gap-2 text-white/60">
            <GraduationCap className="h-3.5 w-3.5 text-[#9bc1ff]" />
            <span>B.Tech Mechatronics & Automation, VIT Chennai</span>
          </div>

          <div className="flex items-center gap-2 text-[#34d399]">
            <span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>{PROFILE.status}</span>
          </div>
        </div>

        {/* Hero Narrative Block */}
        <div className="mt-8 max-w-2xl sm:mt-12 lg:max-w-3xl liquid-glass-frame rounded-3xl p-8 sm:p-12">
          {/* Subdiscipline Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-xs text-[#7dd3fc] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
            <span>Bio-Inspired Robotics & Embedded Control</span>
          </div>

          {/* Name */}
          <h1 className="text-4xl font-medium leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.75rem]">
            {PROFILE.name}
          </h1>

          {/* Core Value Statement */}
          <p className="mt-5 text-xl font-normal leading-relaxed text-white sm:text-2xl">
            {PROFILE.headline}
          </p>

          <p className="mt-3 text-sm sm:text-base text-[#9caec5] leading-relaxed max-w-xl">
            Sizing compliant mechanisms, micro-pneumatic devices, dual-EKF state estimation in ROS 2, and deterministic FreeRTOS/STM32 control firmware.
          </p>

          {/* Verified Proof Badges */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10">
            {/* Proof Badge 1 */}
            <div className="flex items-center gap-2.5 rounded-xl border border-[#eab308]/20 bg-[#eab308]/5 p-3">
              <Award className="h-4 w-4 text-[#facc15] shrink-0" />
              <div className="text-left font-mono text-[11px] leading-tight text-white/90">
                <span className="font-semibold text-[#facc15] block">6th Globally</span>
                <span className="text-white/60">NASA HERC 2026 (Best Indian Team)</span>
              </div>
            </div>

            {/* Proof Badge 2 */}
            <div className="flex items-center gap-2.5 rounded-xl border border-[#38bdf8]/20 bg-[#38bdf8]/5 p-3">
              <FileCheck2 className="h-4 w-4 text-[#38bdf8] shrink-0" />
              <div className="text-left font-mono text-[11px] leading-tight text-white/90">
                <span className="font-semibold text-[#38bdf8] block">2 Patents Pending</span>
                <span className="text-white/60">Agri-Sorter & Air-Puff Tonometer</span>
              </div>
            </div>

            {/* Proof Badge 3 */}
            <div className="flex items-center gap-2.5 rounded-xl border border-[#34d399]/20 bg-[#34d399]/5 p-3">
              <CalendarCheck className="h-4 w-4 text-[#34d399] shrink-0" />
              <div className="text-left font-mono text-[11px] leading-tight text-white/90">
                <span className="font-semibold text-[#34d399] block">Summer 2027</span>
                <span className="text-white/60">Seeking Research & Eng Internship</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => scrollTo("#work")}
              className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-xl border border-[#38bdf8]/50 bg-[#38bdf8]/15 px-6 py-3 font-medium text-white transition-all hover:border-[#38bdf8] hover:bg-[#38bdf8]/25 text-sm"
            >
              <span>View Selected Work</span>
              <ArrowDown className="h-4 w-4 text-[#7dd3fc]" />
            </button>

            <a
              href={PROFILE.resumePath}
              download="Ashwin_TE_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs text-white/80 transition-all hover:border-[#9bc1ff] hover:bg-white/10 hover:text-white"
            >
              <Download className="h-4 w-4 text-[#9bc1ff]" />
              <span>Download Résumé (PDF)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Social / Contact Quick Access Bar */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#080d1a]/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono text-xs text-white/50">
            <span>Direct Links:</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-white/70">
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3 text-white/40" />
            </a>

            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <span>LinkedIn</span>
              <ExternalLink className="h-3 w-3 text-white/40" />
            </a>

            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-1.5 text-[#9bc1ff] transition-colors hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>{PROFILE.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}