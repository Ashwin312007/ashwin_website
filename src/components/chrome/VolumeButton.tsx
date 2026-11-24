"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { useAudio } from "@/providers/AudioProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function VolumeButton() {
  const soundOn = useAppStore((s) => s.soundOn);
  const { toggle } = useAudio();
  const reducedMotion = useReducedMotion();
  const barsRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const container = barsRef.current;
    if (!container) return;
    const bars = container.querySelectorAll<HTMLElement>("[data-vbar]");
    gsap.killTweensOf(bars);

    if (!soundOn || reducedMotion) {
      gsap.to(bars, {
        scaleY: soundOn ? 0.65 : 0.22,
        duration: 0.25,
        ease: "power2.out",
      });
      return;
    }

    bars.forEach((bar, i) => {
      gsap.to(bar, {
        scaleY: 1,
        duration: 0.36 + i * 0.09,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.11,
      });
    });

    return () => {
      gsap.killTweensOf(bars);
    };
  }, [soundOn, reducedMotion]);

  return (
    <button
      type="button"
      onClick={() => {
        void toggle();
      }}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Mute ambient audio (M)" : "Enable ambient audio (M)"}
      data-cursor="play"
      className="inline-flex h-8 w-8 items-center justify-center border border-[var(--surface-border)] bg-[var(--surface-bg)]/40 text-[var(--surface-fg)] backdrop-blur-sm transition-colors hover:border-current"
    >
      <span
        ref={barsRef}
        aria-hidden="true"
        className="flex h-3.5 items-end gap-[2px]"
      >
        <span data-vbar className="h-full w-[2px] origin-bottom bg-current" />
        <span data-vbar className="h-full w-[2px] origin-bottom bg-current" />
        <span data-vbar className="h-full w-[2px] origin-bottom bg-current" />
        <span data-vbar className="h-full w-[2px] origin-bottom bg-current" />
      </span>
    </button>
  );
}
