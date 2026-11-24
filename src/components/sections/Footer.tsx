"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PROFILE } from "@/data/profile";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useSmoothScroll } from "@/providers/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { audioEngine } from "@/audio/AudioEngine";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LetterRoll } from "@/components/ui/LetterRoll";

export function Footer() {
  const prefooterRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const [copied, setCopied] = useState(false);
  const { scrollTo } = useSmoothScroll();
  const reducedMotion = useReducedMotion();

  useSectionTrigger(prefooterRef, {
    id: "prefooter",
    index: 7,
    label: "CONTACT",
    cameraKey: "prefooter",
    start: "top center",
    end: "bottom center",
  });

  useSectionTrigger(footerRef, {
    id: "contact",
    index: 7,
    label: "CONTACT",
    cameraKey: "footer",
    start: "top center",
    end: "bottom bottom",
  });

  // Scrub footerDomeProgress 0 -> 1 as #contact rises into viewport
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footer,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = reducedMotion ? (self.progress > 0.25 ? 1 : 0) : self.progress;
          useAppStore.getState().set({ footerDomeProgress: p });
        },
        onLeaveBack: () => {
          useAppStore.getState().set({ footerDomeProgress: 0 });
        },
        onLeave: () => {
          useAppStore.getState().set({ footerDomeProgress: 1 });
        },
      });
    }, footerRef);

    return () => {
      ctx.revert();
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, [reducedMotion]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      // Fallback copy
      const area = document.createElement("textarea");
      area.value = PROFILE.email;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        // Ignore
      }
      document.body.removeChild(area);
    }

    audioEngine.playCopy();
    setCopied(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 2200);
  };

  const handleTourAgain = () => {
    audioEngine.playTick();
    if (reducedMotion) {
      window.scrollTo({ top: 0, behavior: "auto" });
      useAppStore.getState().set({ tour: { active: true, step: 0 } });
      return;
    }

    scrollTo(0, {
      duration: 2.4,
      onComplete: () => {
        useAppStore.getState().set({ tour: { active: true, step: 0 } });
      },
    });
  };

  return (
    <>
      {/* 100vh prefooter spacer pitching camera toward dome */}
      <div
        ref={prefooterRef}
        aria-hidden="true"
        className="h-screen w-full"
      />

      <footer
        id="contact"
        ref={footerRef}
        className="relative flex min-h-screen w-full flex-col justify-between px-6 pt-24 pb-24 md:px-10 md:pb-24"
      >
        {/* Upper-center open space for floating WebGL Monogram */}
        <div className="flex min-h-[28vh] items-start justify-between">
          <span className="font-mono-label text-[var(--surface-muted)]">
            07 · CONTACT
          </span>

          <button
            type="button"
            onClick={() => {
              audioEngine.playTick();
              useAppStore.getState().set({ terminalOpen: true });
            }}
            className="inline-flex items-center gap-2 border border-[var(--surface-border)] bg-[var(--surface-bg)]/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--surface-muted)] backdrop-blur-sm transition-colors hover:border-[var(--surface-fg)] hover:text-[var(--surface-fg)]"
          >
            <span>&gt;_ TERMINAL</span>
            <kbd className="border border-current/30 px-1 py-0.5 text-[9px]">`</kbd>
          </button>
        </div>

        {/* Center: giant clickable email */}
        <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
          <span className="font-mono-label mb-4 block text-[var(--surface-muted)]">
            {copied ? "COPIED TO CLIPBOARD ✓" : PROFILE.status}
          </span>

          <button
            type="button"
            onClick={() => void handleCopyEmail()}
            onPointerEnter={() => audioEngine.playTick()}
            data-cursor="copy"
            data-cursor-tip={copied ? "COPIED ✓" : "CLICK TO COPY"}
            className="text-fluid-email break-all font-light text-[var(--surface-fg)] transition-opacity hover:opacity-80"
          >
            {PROFILE.email}
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-6 border-t border-[var(--surface-border)] pt-6 lg:flex-row lg:items-center">
          {/* Left: GITHUB · LINKEDIN · RÉSUMÉ */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-fg)]">
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => audioEngine.playTick()}
              className="hover:opacity-75"
            >
              <LetterRoll text="GITHUB" />
            </a>
            <span aria-hidden="true" className="text-[var(--surface-muted)]">
              ·
            </span>
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => audioEngine.playTick()}
              className="hover:opacity-75"
            >
              <LetterRoll text="LINKEDIN" />
            </a>
            <span aria-hidden="true" className="text-[var(--surface-muted)]">
              ·
            </span>
            <a
              href={PROFILE.resumePath}
              download="Ashwin_TE_Resume.pdf"
              onPointerEnter={() => audioEngine.playTick()}
              className="hover:opacity-75"
            >
              <LetterRoll text="RÉSUMÉ" />
            </a>
          </div>

          {/* Center: TAKE THE TOUR AGAIN */}
          <div>
            <MagneticButton
              cursor="play"
              withTriangleCover
              onClick={handleTourAgain}
              className="rounded-full border-[var(--surface-border)] text-[var(--surface-fg)]"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
                <LetterRoll text="TAKE THE TOUR AGAIN" />
              </span>
            </MagneticButton>
          </div>

          {/* Right: copyright */}
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--surface-muted)]">
            © 2026 ASHWIN T E · BUILT WITH THREE.JS
          </p>
        </div>
      </footer>
    </>
  );
}
