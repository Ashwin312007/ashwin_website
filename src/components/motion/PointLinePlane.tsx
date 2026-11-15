"use client";

import React, { useState } from "react";
import { useExperience } from "@/context/ExperienceProvider";
import { PROFILE } from "@/data/profile";

export function PointLinePlane() {
  const { scrollStoreRef } = useExperience();
  const [activeStage, setActiveStage] = useState(0);

  const selectStage = (idx: number) => {
    setActiveStage(idx);
    scrollStoreRef.current.narrativeMorph = idx * 0.5;
  };

  return (
    <section className="relative z-10 border-t border-white/10 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-6 flex items-baseline justify-between rounded-xl border border-white/10 bg-[#080d1a]/80 px-4 py-2.5 backdrop-blur-md">
          <div className="font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
            Design Philosophy // Point · Line · Plane
          </div>
          <span className="font-mono text-xs text-white/40">
            Phase 0{activeStage + 1} / 03
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PROFILE.narrativeSteps.map((s, idx) => {
            const active = idx === activeStage;
            return (
              <button
                key={s.index}
                type="button"
                onMouseEnter={() => {
                  setActiveStage(idx);
                  scrollStoreRef.current.narrativeMorph = idx * 0.5;
                }}
                onClick={() => selectStage(idx)}
                className={`liquid-glass-frame rounded-2xl p-6 text-left transition-all duration-300 outline-none ${
                  active
                    ? "border-[#38bdf8]/60 shadow-[0_8px_32px_rgba(56,189,248,0.22)] opacity-100"
                    : "border-white/10 opacity-75 hover:opacity-100 hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs text-[#9bc1ff]">
                  <span>{s.index} · {s.stage}</span>
                  <span className="text-[10px] text-white/40">{s.subtitle}</span>
                </div>
                <h2 className="mt-2.5 text-lg font-medium tracking-tight text-white sm:text-xl">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#9caec5]">
                  {s.body}
                </p>
                <div className="mt-4 font-mono text-xs text-[#34d399]/90 border-t border-white/5 pt-3">
                  {s.metric}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
