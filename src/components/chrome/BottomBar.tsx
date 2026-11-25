"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { useSmoothScroll } from "@/providers/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Emblem } from "@/components/ui/Emblem";
import { SectionLabel } from "./SectionLabel";
import { AudioPlayer } from "./AudioPlayer";
import { VolumeButton } from "./VolumeButton";
import { audioEngine } from "@/audio/AudioEngine";

export function BottomBar() {
  const loaded = useAppStore((s) => s.loaded);
  const sectionId = useAppStore((s) => s.section.id);
  const tourActive = useAppStore((s) => s.tour.active);
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  const emblemRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<SVGSVGElement | null>(null);

  // Rotate emblem subtly with scroll velocity via rAF (no React re-renders)
  useEffect(() => {
    if (reducedMotion) return;
    let angle = 0;
    let rafId = 0;

    const tick = () => {
      const vel = useAppStore.getState().scroll.velocity;
      angle += 0.15 + vel * 0.25;
      if (emblemRef.current) {
        emblemRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  // Subtle bobbing chevron
  useEffect(() => {
    const el = chevronRef.current;
    if (!el || reducedMotion) return;
    const tween = gsap.to(el, {
      y: 4,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  const handleChevronClick = () => {
    audioEngine.playTick();
    if (sectionId === "contact" || sectionId === "footer") {
      scrollTo(0, { duration: 1.8 });
    } else {
      scrollTo(window.scrollY + window.innerHeight * 0.9, { duration: 1.2 });
    }
  };

  return (
    <>
    {/* Bottom scrim: section content fades out behind the fixed HUD / audio controls */}
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 h-28 bg-gradient-to-t from-[var(--surface-bg)]/95 via-[var(--surface-bg)]/75 via-55% to-transparent transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
    <div
      className={`pointer-events-none fixed right-0 bottom-0 left-0 z-40 flex items-end justify-between px-6 py-5 transition-opacity duration-500 md:px-10 md:py-7 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Left: Emblem + SectionLabel */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div
          ref={emblemRef}
          className="flex h-6 w-6 items-center justify-center text-[var(--surface-fg)]"
        >
          <Emblem size={20} />
        </div>
        <SectionLabel />
      </div>

      {/* Center: scroll chevron (hidden during active tour since TourController shows STOP TOUR) */}
      {!tourActive ? (
        <button
          type="button"
          onClick={handleChevronClick}
          onPointerEnter={() => audioEngine.playTick()}
          aria-label={
            sectionId === "contact" || sectionId === "footer"
              ? "Scroll back to top"
              : "Scroll down"
          }
          className="pointer-events-auto hidden h-8 w-8 items-center justify-center text-[var(--surface-muted)] transition-colors hover:text-[var(--surface-fg)] md:inline-flex"
        >
          <svg
            ref={chevronRef}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={
              sectionId === "contact" || sectionId === "footer" ? "rotate-180" : ""
            }
          >
            <path
              d="M3.5 6L8 10.5L12.5 6"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="square"
            />
          </svg>
        </button>
      ) : (
        <div />
      )}

      {/* Right: AudioPlayer, VolumeButton, A11y, Shortcuts */}
      <div className="pointer-events-auto flex items-center gap-2">
        <AudioPlayer />
        <VolumeButton />

        <button
          type="button"
          onClick={() => {
            audioEngine.playTick();
            useAppStore.getState().set((s) => ({
              a11yOpen: !s.a11yOpen,
              shortcutsOpen: false,
              menuOpen: false,
            }));
          }}
          aria-label="Accessibility settings"
          aria-expanded={useAppStore((s) => s.a11yOpen)}
          className="inline-flex h-8 w-8 items-center justify-center border border-[var(--surface-border)] bg-[var(--surface-bg)]/40 text-[var(--surface-fg)] backdrop-blur-sm transition-colors hover:border-current"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="4.5" r="2" fill="currentColor" />
            <path
              d="M4 8.5H20M12 8.5V14.5M12 14.5L8.5 21M12 14.5L15.5 21"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => {
            audioEngine.playTick();
            useAppStore.getState().set((s) => ({
              shortcutsOpen: !s.shortcutsOpen,
              a11yOpen: false,
              menuOpen: false,
            }));
          }}
          aria-label="Keyboard shortcuts (?)"
          aria-expanded={useAppStore((s) => s.shortcutsOpen)}
          className="inline-flex h-8 w-8 items-center justify-center border border-[var(--surface-border)] bg-[var(--surface-bg)]/40 font-mono text-[11px] text-[var(--surface-fg)] backdrop-blur-sm transition-colors hover:border-current"
        >
          ?
        </button>
      </div>
    </div>
    </>
  );
}
