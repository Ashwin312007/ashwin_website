"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  FileText,
  Terminal,
  ArrowUpRight,
} from "lucide-react";
import { useExperience } from "@/context/ExperienceProvider";
import { PROFILE } from "@/data/profile";

export function TopHUD() {
  const {
    scrollTo,
    setTerminalOpen,
  } = useExperience();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { num: "01", label: "Work", target: "#work" },
    { num: "02", label: "Capabilities", target: "#capabilities" },
    { num: "03", label: "About", target: "#about" },
  ];

  const handleNavClick = (target: string) => {
    setMobileMenuOpen(false);
    scrollTo(target);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 liquid-glass border-b border-white/15">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Brand Logo / Monogram */}
          <button
            type="button"
            onClick={() => scrollTo("#hero")}
            className="group flex cursor-pointer items-center gap-2 text-sm font-medium tracking-tight text-white outline-none"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/5 font-mono text-xs font-semibold text-[#9bc1ff] transition-colors group-hover:border-[#9bc1ff]/60 group-hover:bg-[#9bc1ff]/10">
              {PROFILE.monogram}
            </span>
            <span className="hidden sm:inline">{PROFILE.name}</span>
          </button>

          {/* Desktop Primary Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 text-xs text-white/60 md:flex"
          >
            {navItems.map((nav) => (
              <button
                key={nav.target}
                type="button"
                onClick={() => handleNavClick(nav.target)}
                className="group cursor-pointer transition-colors hover:text-white"
              >
                <span className="mr-1.5 font-mono text-[10px] text-[#9bc1ff]/70 transition-colors group-hover:text-[#9bc1ff]">
                  {nav.num}
                </span>
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Controls Cluster: Terminal, CV */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => setTerminalOpen((prev) => !prev)}
              title="Toggle CyberTerminal (`)"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/70 transition-colors hover:border-[#34d399]/60 hover:text-[#34d399]"
            >
              <Terminal className="h-3 w-3 text-[#34d399]" />
              <span>Terminal</span>
              <span className="text-[10px] text-white/30">`</span>
            </button>

            <a
              href={PROFILE.resumePath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80 transition-colors hover:border-[#9bc1ff] hover:text-white"
            >
              <FileText className="h-3 w-3 text-[#9bc1ff]" />
              <span>CV</span>
            </a>
          </div>

          {/* Mobile Right Controls: Hamburger Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              className="rounded-full border border-white/20 bg-white/5 p-2 text-white/80 transition-colors hover:border-white/40 hover:text-white focus:outline-none focus:ring-1 focus:ring-[#9bc1ff]"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 text-[#9bc1ff]" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-14 z-30 flex max-h-[calc(100vh-3.5rem)] flex-col justify-between overflow-y-auto border-b border-white/15 bg-[#08080A]/95 p-6 backdrop-blur-2xl md:hidden"
          >
            {/* Primary Navigation Anchors */}
            <div className="space-y-4 pt-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Navigation
              </div>

              <div className="flex flex-col space-y-2">
                {navItems.map((nav) => (
                  <button
                    key={nav.target}
                    type="button"
                    onClick={() => handleNavClick(nav.target)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-all hover:border-[#9bc1ff]/40 hover:bg-white/[0.07]"
                  >
                    <span className="text-base font-medium text-white">
                      {nav.label}
                    </span>
                    <span className="font-mono text-xs text-[#9bc1ff]">
                      {nav.num} →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Controls & Actions */}
            <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <a
                  href={PROFILE.resumePath}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg border border-[#9bc1ff]/30 bg-[#9bc1ff]/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#9bc1ff]/20"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#9bc1ff]" />
                    <span>Download Résumé (PDF)</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/60" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTerminalOpen(true);
                  }}
                  className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-mono text-white/80 transition-colors hover:border-[#34d399]/50 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-[#34d399]" />
                    <span>Open CyberTerminal</span>
                  </span>
                  <span className="text-xs text-white/40">`</span>
                </button>
              </div>
            </div>

            {/* Bottom Status metadata */}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] text-white/40">
              <span>{PROFILE.location}</span>
              <span className="text-[#34d399]">ONLINE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
