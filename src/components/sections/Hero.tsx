"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { PROFILE } from "@/data/profile";
import { useAppStore } from "@/store/useAppStore";
import { useSectionTrigger } from "@/hooks/useSectionTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { audioEngine } from "@/audio/AudioEngine";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LetterRoll } from "@/components/ui/LetterRoll";

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·°./";
const LOCATION_TEXT = "CHENNAI, IN · 13.08° N, 80.27° E";

function runCharScramble(
  el: HTMLElement,
  target: string,
  durationMs = 800
): () => void {
  let rafId = 0;
  const start = performance.now();
  const len = target.length;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / durationMs);
    const revealed = Math.floor(progress * len);
    let out = "";
    for (let i = 0; i < len; i++) {
      const ch = target[i];
      if (ch === " " || ch === "·" || i < revealed) {
        out += ch;
      } else {
        out += SCRAMBLE_GLYPHS[(i * 7 + Math.floor(now / 38)) % SCRAMBLE_GLYPHS.length];
      }
    }
    el.textContent = out;
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  };

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineWrapRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const locTextRef = useRef<HTMLSpanElement | null>(null);
  const statusTextRef = useRef<HTMLSpanElement | null>(null);
  const tourWrapRef = useRef<HTMLDivElement | null>(null);

  const loaded = useAppStore((s) => s.loaded);
  const reducedMotion = useReducedMotion();

  useSectionTrigger(sectionRef, {
    id: "top",
    index: 0,
    label: "HERO",
    cameraKey: "top",
    start: "top top",
    end: "bottom top",
  });

  // Intro reveal when preloader finishes (SplitText lines + meta char-scramble)
  useEffect(() => {
    if (!loaded) return;

    const headlineEl = headlineRef.current;
    const locEl = locTextRef.current;
    const statusEl = statusTextRef.current;

    if (reducedMotion) {
      if (locEl) locEl.textContent = LOCATION_TEXT;
      if (statusEl) statusEl.textContent = PROFILE.status;
      return;
    }

    let cancelled = false;
    let split: SplitText | null = null;
    let ctx: gsap.Context | null = null;

    const cancelLoc = locEl ? runCharScramble(locEl, LOCATION_TEXT, 800) : undefined;
    const cancelStatus = statusEl
      ? runCharScramble(statusEl, PROFILE.status, 800)
      : undefined;

    const runIntro = async () => {
      if (typeof document !== "undefined" && document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Proceed even if font readiness rejects
        }
      }
      if (cancelled || !headlineEl) return;

      ctx = gsap.context(() => {
        split = SplitText.create(headlineEl, {
          type: "lines",
          mask: "lines",
        });

        if (split.lines.length > 0) {
          gsap.from(split.lines, {
            yPercent: 110,
            duration: 1.4,
            stagger: 0.08,
            ease: "expo.out",
          });
        }

        if (tourWrapRef.current) {
          gsap.from(tourWrapRef.current, {
            y: 18,
            opacity: 0,
            duration: 1.0,
            delay: 0.35,
            ease: "expo.out",
          });
        }
      }, sectionRef);
    };

    void runIntro();

    return () => {
      cancelled = true;
      cancelLoc?.();
      cancelStatus?.();
      split?.revert();
      ctx?.revert();
    };
  }, [loaded, reducedMotion]);

  // Scrubbed scroll-out (0 -> 100vh)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      if (headlineWrapRef.current) {
        tl.to(
          headlineWrapRef.current,
          {
            y: "-12vh",
            opacity: 0,
            ease: "none",
          },
          0
        );
      }

      if (metaRef.current) {
        tl.to(
          metaRef.current,
          {
            y: -24,
            opacity: 0,
            ease: "none",
          },
          0
        );
      }

      if (tourWrapRef.current) {
        tl.to(
          tourWrapRef.current,
          {
            y: 16,
            opacity: 0,
            ease: "none",
          },
          0
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleEmptyAreaClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a, button, [role='button']")) return;
    void audioEngine.toggle();
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onClick={handleEmptyAreaClick}
      data-cursor-tip="CLICK OR PRESS M FOR SOUND"
      className="relative flex min-h-screen w-full flex-col justify-end px-6 pt-28 pb-24 md:px-10 md:pb-24"
    >
      <div className="relative flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        {/* Left-bottom headline */}
        <div ref={headlineWrapRef} className="max-w-[40ch] will-change-transform">
          <h1
            ref={headlineRef}
            className="text-fluid-h1 font-light text-[var(--surface-fg)]"
          >
            {PROFILE.headline}
          </h1>
        </div>

        {/* Bottom-center Tour trigger */}
        <div
          ref={tourWrapRef}
          className="flex justify-start lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2"
        >
          <MagneticButton
            cursor="play"
            withTriangleCover
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.playTick();
              useAppStore.getState().set({ tour: { active: true, step: 0 } });
            }}
            className="rounded-full border-[var(--surface-border)] bg-[var(--surface-bg)]/40 text-[var(--surface-fg)] backdrop-blur-sm"
          >
            <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em]">
              <svg
                width="9"
                height="10"
                viewBox="0 0 9 10"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M0.5 0.6L8.5 5L0.5 9.4V0.6Z" />
              </svg>
              <LetterRoll text="TAKE THE TOUR" />
            </span>
          </MagneticButton>
        </div>

        {/* Right-bottom meta */}
        <div
          ref={metaRef}
          className="flex flex-col items-start gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--surface-muted)] lg:items-end lg:text-right"
        >
          <span ref={locTextRef} className="text-[var(--surface-fg)]">
            {LOCATION_TEXT}
          </span>
          <span ref={statusTextRef}>{PROFILE.status}</span>
        </div>
      </div>
    </section>
  );
}
