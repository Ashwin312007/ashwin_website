"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const { scrollTo, setTerminalOpen } = useExperience();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { num: "01", label: "Work", target: "#work" },
    { num: "02", label: "Research", target: "#research" },
    { num: "03", label: "Capabilities", target: "#capabilities" },
    { num: "04", label: "Experience", target: "#experience" },
    { num: "05", label: "Contact", target: "#contact" },
  ];

  // Close mobile drawer on Escape key and handle focus trapping
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      // Auto focus first interactive item inside drawer
      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const firstFocusable = drawerRef.current.querySelector<HTMLElement>("button, a");
          firstFocusable?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
            aria-label="Ashwin T E - Home"
            className="group flex cursor-pointer items-center gap-2 text-sm font-medium tracking-tight text-white outline-none"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 font-mono text-xs font-semibold text-[#9bc1ff] transition-colors group-hover:border-[#9bc1ff]/60 group-hover:bg-[#9bc1ff]/10">
              {PROFILE.monogram}
            </span>
            <span className="hidden sm:inline font-semibold">{PROFILE.name}</span>
          </button>

          {/* Desktop Primary Navigation Links (5 Items) */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-6 text-xs text-white/70 md:flex"
          >
            {navItems.map((nav) => (
              <button
                key={nav.target}
                type="button"
                onClick={() => handleNavClick(nav.target)}
                className="group cursor-pointer py-1.5 transition-colors hover:text-white"
              >
                <span className="mr-1.5 font-mono text-[10px] text-[#9bc1ff]/70 transition-colors group-hover:text-[#9bc1ff]">
                  {nav.num}
                </span>
                <span>{nav.label}</span>
              </button>
            ))}
          </nav>

          {/* Desktop Right Controls Cluster: Terminal, CV */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => setTerminalOpen((prev) => !prev)}
              title="Toggle CyberTerminal (`)"
              className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70 transition-colors hover:border-[#34d399]/60 hover:text-[#34d399]"
            >
              <Terminal className="h-3 w-3 text-[#34d399]" />
              <span>Terminal</span>
              <span className="text-[10px] text-white/30">`</span>
            </button>

            <a
              href={PROFILE.resumePath}
              download="Ashwin_TE_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 font-mono text-[11px] text-white/80 transition-colors hover:border-[#9bc1ff] hover:text-white"
            >
              <FileText className="h-3 w-3 text-[#9bc1ff]" />
              <span>CV (PDF)</span>
            </a>
          </div>

          {/* Mobile Right Controls: Hamburger Menu Button (>= 44x44px target) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-colors hover:border-white/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9bc1ff]"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-[#9bc1ff]" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-14 z-30 flex max-h-[calc(100vh-3.5rem)] flex-col justify-between overflow-y-auto border-b border-white/15 bg-[#08080A]/95 p-6 backdrop-blur-2xl md:hidden"
          >
            {/* Primary Navigation Anchors (Touch targets >= 44x44px) */}
            <div className="space-y-4 pt-2">
              <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Navigation
              </div>

              <div className="flex flex-col space-y-2.5">
                {navItems.map((nav) => (
                  <button
                    key={nav.target}
                    type="button"
                    onClick={() => handleNavClick(nav.target)}
                    className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-all hover:border-[#9bc1ff]/40 hover:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[#9bc1ff]"
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
              <div className="flex flex-col gap-3">
                <a
                  href={PROFILE.resumePath}
                  download="Ashwin_TE_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[48px] items-center justify-between rounded-xl border border-[#9bc1ff]/30 bg-[#9bc1ff]/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#9bc1ff]/20"
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
                  className="flex min-h-[48px] items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-mono text-white/80 transition-colors hover:border-[#34d399]/50 hover:text-white"
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
              <span className="text-[#34d399] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}