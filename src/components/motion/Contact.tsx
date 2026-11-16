"use client";

import React, { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  Download,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PROFILE } from "@/data/profile";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <section id="contact" className="relative z-10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 rounded-2xl border border-white/10 bg-[#080d1a]/80 p-6 backdrop-blur-md mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
              <Mail className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span>Communication Channels</span>
            </div>
            <h2 className="mt-1 text-3xl font-medium tracking-tight text-white sm:text-5xl">
              Get In Touch
            </h2>
          </div>
          <span className="font-mono text-xs text-[#34d399] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#34d399] animate-pulse" />
            <span>Seeking Summer 2027 Internship</span>
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Direct Inquiries & Interactive Copy Email */}
          <div className="lg:col-span-7 liquid-glass-frame rounded-3xl p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/70">
                <Sparkles className="h-3 w-3 text-[#38bdf8]" />
                <span>Robotics & Embedded Systems Research</span>
              </div>

              <h3 className="mt-5 text-2xl sm:text-3xl font-medium text-white tracking-tight leading-snug">
                Let&apos;s build novel mechanisms and deterministic control systems.
              </h3>

              <p className="mt-3 text-sm text-[#9caec5] leading-relaxed max-w-xl">
                Open to undergraduate research fellowships, robotics engineering internships, and embedded control roles for Summer 2027. Available for worldwide relocation and remote collaboration.
              </p>

              {/* Copy Email Button & Direct Mailto */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-2">
                  Direct Email Dispatch
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy Ashwin's email address"
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white transition-all hover:border-[#9bc1ff] hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4 text-[#9bc1ff]" />
                    <span className="text-base sm:text-lg font-medium text-white group-hover:text-[#9bc1ff] transition-colors">
                      {PROFILE.email}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] transition-all ${
                        copied
                          ? "border-[#34d399]/40 bg-[#34d399]/20 text-[#34d399]"
                          : "border-white/15 bg-white/5 text-white/50 group-hover:text-white"
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

                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs text-white/70 transition-colors hover:border-[#38bdf8] hover:text-white"
                  >
                    <span>Send Mail</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#38bdf8]" />
                  </a>
                </div>

                <div aria-live="polite" className="sr-only">
                  {copied ? "Email address copied to clipboard" : ""}
                </div>
              </div>
            </div>

            {/* Availability & Location Metadata */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#38bdf8] shrink-0" />
                <span>Chennai, India · 13.08° N, 80.27° E</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#34d399] shrink-0" />
                <span>Available: Summer 2027 (May – Aug)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Résumé Download & Professional Profiles */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Résumé Action Card */}
            <div className="liquid-glass-frame rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-[#9bc1ff] mb-4">
                  <span>Curriculum Vitae</span>
                  <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10 text-white/50">
                    PDF format
                  </span>
                </div>

                <h4 className="text-xl font-medium text-white tracking-tight">
                  Download Technical Résumé
                </h4>

                <p className="mt-2 text-xs sm:text-sm text-[#9caec5] leading-relaxed">
                  Comprehensive 1-page résumé detailing mechatronics coursework, NASA HERC leadership, patent filings, and technical competencies.
                </p>
              </div>

              <a
                href={PROFILE.resumePath}
                download="Ashwin_TE_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="mt-6 group flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#9bc1ff]/40 bg-[#9bc1ff]/10 p-4 transition-all hover:border-[#9bc1ff] hover:bg-[#9bc1ff]/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#9bc1ff]/20 text-[#9bc1ff] transition-transform group-hover:scale-105">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-[#9bc1ff] transition-colors">
                      Ashwin_TE_Resume.pdf
                    </div>
                    <div className="font-mono text-xs text-white/50">
                      Verified Technical Résumé · 116 KB
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#9bc1ff] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* External Links Card */}
            <div className="liquid-glass-frame rounded-2xl p-6 sm:p-7">
              <div className="font-mono text-xs uppercase tracking-wider text-white/40 mb-3">
                Verified Profiles
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs font-mono text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <span>GitHub</span>
                  <ExternalLink className="h-3.5 w-3.5 text-white/40" />
                </a>

                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs font-mono text-white/80 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="h-3.5 w-3.5 text-white/40" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}