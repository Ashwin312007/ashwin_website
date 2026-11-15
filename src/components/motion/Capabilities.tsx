"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { CAPABILITIES } from "@/data/capabilities";
import { useExperience } from "@/context/ExperienceProvider";
import { CursorPreview } from "@/components/motion/CursorPreview";

export function Capabilities() {
  const { setHoveredCapability } = useExperience();
  const [openIndex, setOpenIndex] = useState<string>("01");

  return (
    <section
      id="capabilities"
      onMouseLeave={() => setHoveredCapability(null)}
      className="relative z-10 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 rounded-2xl border border-white/10 bg-[#080d1a]/80 p-6 backdrop-blur-md mb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
              Technical Toolkit & Disciplines
            </span>
            <h2 className="mt-1 text-3xl font-medium tracking-tight text-white sm:text-5xl">
              What I build with
            </h2>
          </div>
          <span className="font-mono text-xs text-white/45">01 — 06</span>
        </div>

        <div className="space-y-4 pt-6">
          {CAPABILITIES.map((cap) => {
            const isOpen = openIndex === cap.index;
            return (
              <div
                key={cap.index}
                onMouseEnter={() => setHoveredCapability(cap)}
                className={`liquid-glass-frame rounded-2xl px-6 sm:px-8 transition-all duration-300 ${
                  isOpen
                    ? "border-[#38bdf8]/40 shadow-[0_8px_32px_rgba(56,189,248,0.18)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  id={`capability-btn-${cap.index}`}
                  aria-expanded={isOpen}
                  aria-controls={`capability-panel-${cap.index}`}
                  onClick={() => setOpenIndex(isOpen ? "" : cap.index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left outline-none"
                >
                  <div className="flex items-baseline gap-6 sm:gap-12">
                    <span
                      className={`font-mono text-2xl tabular-nums transition-colors sm:text-3xl ${
                        isOpen
                          ? "text-[#9bc1ff]"
                          : "text-white/30 group-hover:text-white/60"
                      }`}
                    >
                      {cap.index}
                    </span>
                    <div>
                      <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                        {cap.title}
                      </h3>
                      <p className="mt-1 text-xs text-white/45 sm:text-sm md:hidden">
                        {cap.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="hidden text-sm text-white/45 md:inline">
                      {cap.subtitle}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-white/40 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#9bc1ff]" : "group-hover:text-white"
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`capability-panel-${cap.index}`}
                      role="region"
                      aria-labelledby={`capability-btn-${cap.index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pl-12 pr-4 sm:pl-20 sm:pr-8 space-y-4">
                        <p className="max-w-3xl text-sm leading-relaxed text-[#9caec5]">
                          {cap.description}
                        </p>

                        {/* Skills Pill Badges */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {cap.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-white/12 bg-white/5 px-3 py-1 font-mono text-xs text-white/70"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Applied In Projects row */}
                        <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#9bc1ff]">
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-white/40">Applied in:</span>
                          <span className="text-white/80">{cap.appliedIn.join(" · ")}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <CursorPreview />
    </section>
  );
}
