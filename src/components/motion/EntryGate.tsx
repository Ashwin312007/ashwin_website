"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import { useExperience } from "@/context/ExperienceProvider";
import { PROFILE } from "@/data/profile";

export function EntryGate() {
  const { hasEntered, enterExperience, scrollStoreRef } = useExperience();
  const [counter, setCounter] = useState(0);

  // Smooth countdown counter from 000 to 100
  useEffect(() => {
    if (hasEntered) return;
    let raf = 0;
    const minDuration = 1000;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / minDuration);
      const eased = 1 - Math.pow(1 - t, 3);
      scrollStoreRef.current.gateProgress = eased;
      setCounter(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasEntered, scrollStoreRef]);

  // Keyboard Enter / Escape bypass
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (hasEntered) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        enterExperience();
      }
    },
    [hasEntered, enterExperience]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {!hasEntered && (
        <motion.div
          key="entry-gate"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.99,
            filter: "blur(8px)",
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08080a]/92 px-6 py-8 backdrop-blur-md sm:px-12 sm:py-10"
        >
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-white/50">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
              <span className="font-mono tracking-wider text-white/70">
                {PROFILE.name.toUpperCase()} {"//"} SYS_INIT [V0.3]
              </span>
            </div>
            <button
              type="button"
              onClick={enterExperience}
              className="cursor-pointer font-mono text-xs text-white/50 transition-colors hover:text-white"
            >
              Skip [Esc] →
            </button>
          </div>

          {/* Central Counter & Launch Action */}
          <div className="my-auto flex flex-col items-center text-center">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#9bc1ff]/80">
              Mechatronics &amp; Bio-Inspired Robotics
            </div>

            <div className="relative mt-2 flex items-baseline justify-center">
              <span className="font-mono text-8xl font-light tracking-tighter tabular-nums text-white sm:text-9xl">
                {String(counter).padStart(3, "0")}
              </span>
              <span className="font-mono text-xl text-[#9bc1ff]/60 sm:text-2xl">
                %
              </span>
            </div>

            {/* Micro Progress Track */}
            <div className="mt-4 h-0.5 w-48 overflow-hidden rounded-full bg-white/10 sm:w-64">
              <div
                className="h-full bg-gradient-to-r from-[#9bc1ff] to-[#34d399] transition-all duration-75 ease-out"
                style={{ width: `${counter}%` }}
              />
            </div>

            <p className="mt-6 max-w-md font-mono text-[11px] leading-relaxed text-white/50 sm:text-xs">
              Tendon kinematics &amp; 3D spatial stage initialized.
              Press <span className="text-white/80">[↵ Enter]</span> to explore.
            </p>

            {/* Clean Single Launch Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={enterExperience}
                className="group inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#9bc1ff]/50 bg-[#9bc1ff]/15 px-8 py-3.5 text-xs font-medium text-white shadow-[0_0_24px_rgba(155,193,255,0.2)] transition-all hover:border-[#9bc1ff] hover:bg-[#9bc1ff]/25 hover:shadow-[0_0_30px_rgba(155,193,255,0.35)]"
              >
                <span>ENTER PORTFOLIO</span>
                <span className="inline-flex items-center gap-0.5 rounded border border-[#9bc1ff]/40 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-[#9bc1ff]">
                  <CornerDownLeft className="h-2.5 w-2.5" />
                  ↵
                </span>
                <ArrowRight className="h-4 w-4 text-[#9bc1ff] transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-white/40 sm:flex-row">
            <span className="font-mono">
              VIT CHENNAI {"//"} B.TECH MECHATRONICS
            </span>
            <span className="hidden font-mono sm:inline">
              850nm NIR · DUAL-EKF · STATE-SPACE LQR
            </span>
            <span className="font-mono text-white/60">
              STATUS: NOMINAL [READY]
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
