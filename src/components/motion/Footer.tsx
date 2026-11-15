"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Mail,
  ArrowUpRight,
  ArrowUp,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { ACHIEVEMENTS, EXPERIENCE } from "@/data/experience";
import { PROFILE } from "@/data/profile";
import { useExperience } from "@/context/ExperienceProvider";

export function Footer() {
  const { scrollTo, setTerminalOpen } = useExperience();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <footer id="about" className="relative z-10 pb-20 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Experience & Honors 2-column Layout */}
        <div className="grid grid-cols-1 gap-12 border-t border-white/12 pt-16 lg:grid-cols-12">
          {/* Left Column: Work & Leadership Experience */}
          <div className="lg:col-span-7 liquid-glass-frame rounded-3xl p-6 sm:p-8">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                Experience
              </h2>
              <span className="font-mono text-xs text-white/40">2024 — 2026</span>
            </div>

            <div className="mt-8 divide-y divide-white/10">
              {EXPERIENCE.map((item) => (
                <div
                  key={`${item.period}-${item.role}`}
                  className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12"
                >
                  <span className="font-mono text-xs text-white/40 sm:col-span-3">
                    {item.period}
                  </span>
                  <div className="sm:col-span-9">
                    <div className="text-base font-medium text-white">
                      {item.role}{" "}
                      <span className="font-normal text-white/50">
                        · {item.organization}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#9caec5] leading-relaxed">
                      {item.highlights[0]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Milestones & Education */}
          <div className="space-y-8 lg:col-span-5">
            <div className="liquid-glass-frame rounded-3xl p-6 sm:p-8">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  Milestones
                </h2>
                <span className="font-mono text-xs text-[#9bc1ff]">Highlights</span>
              </div>

              <div className="mt-8 divide-y divide-white/10">
                {ACHIEVEMENTS.map((ach) => (
                  <div
                    key={ach.title}
                    className="flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="text-sm text-white">{ach.title}</span>
                    <span className="shrink-0 font-mono text-xs text-[#9bc1ff]">
                      {ach.metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="liquid-glass-frame rounded-2xl p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-white/40">
                Education
              </div>
              <div className="mt-2 text-base font-medium text-white">
                {PROFILE.education.degree}
              </div>
              <div className="mt-1 text-sm text-[#9caec5]">
                {PROFILE.education.institution}
              </div>
              <div className="mt-2 flex items-center gap-4 font-mono text-xs text-white/60">
                <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">
                  CGPA: {PROFILE.education.cgpa}
                </span>
                <span>{PROFILE.education.period}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Résumé Download Section */}
        <div className="mt-20 rounded-3xl liquid-glass-frame p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
            {/* Left: Contact Email & Feedback */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
                <Mail className="h-3.5 w-3.5" />
                <span>Get in touch // Summer 2027 Inquiries</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="group inline-flex cursor-pointer items-center gap-3 text-left text-2xl font-medium tracking-tight text-white transition-colors hover:text-[#9bc1ff] sm:text-3xl lg:text-4xl"
                >
                  <span>{PROFILE.email}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-xs transition-all ${
                      copied
                        ? "border-[#34d399]/40 bg-[#34d399]/20 text-[#34d399]"
                        : "border-white/15 bg-white/5 text-white/45 group-hover:border-[#9bc1ff] group-hover:text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-[#34d399]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              <div aria-live="polite" className="sr-only">
                {copied ? "Email address copied to clipboard" : ""}
              </div>

              <p className="mt-3 text-sm text-[#9caec5] max-w-lg">
                Available for robotics, bio-inspired mechanisms, and embedded controls research internships.
              </p>
            </div>

            {/* Right: Direct Résumé Download Action Card */}
            <div className="md:col-span-5 md:flex md:justify-end">
              <a
                href={PROFILE.resumePath}
                download="Ashwin_TE_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="group flex w-full max-w-sm cursor-pointer items-center justify-between rounded-xl border border-[#9bc1ff]/30 bg-[#9bc1ff]/10 p-4 transition-all hover:border-[#9bc1ff] hover:bg-[#9bc1ff]/15"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#9bc1ff]/20 text-[#9bc1ff] transition-transform group-hover:scale-105">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-[#9bc1ff] transition-colors">
                      Ashwin_TE_Resume.pdf
                    </div>
                    <div className="font-mono text-xs text-white/45">
                      Technical Résumé · 116 KB
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#9bc1ff] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Minimal Editorial Footer Sign-off */}
        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-white/50">
            <span>© {new Date().getFullYear()} {PROFILE.name}</span>
            <span>{PROFILE.location}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/55">
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
              className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs hover:text-[#9bc1ff] transition-colors"
            >
              <Terminal className="h-3.5 w-3.5 text-[#34d399]" />
              <span>terminal (`)</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#hero")}
              aria-label="Scroll back to top"
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
