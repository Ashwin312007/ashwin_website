"use client";

import { useAppStore } from "@/store/useAppStore";
import { useAudio } from "@/providers/AudioProvider";

export function AudioPlayer() {
  const soundOn = useAppStore((s) => s.soundOn);
  const title = useAppStore((s) => s.audioTrackTitle);
  const hasTracks = useAppStore((s) => s.audioHasTracks);
  const { toggle, prev, next, playTick } = useAudio();

  return (
    <div className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--surface-fg)] sm:inline-flex">
      {hasTracks ? (
        <button
          type="button"
          onClick={() => {
            playTick();
            prev();
          }}
          aria-label="Previous audio track"
          className="px-1 py-0.5 text-[var(--surface-muted)] transition-colors hover:text-[var(--surface-fg)]"
        >
          ‹
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => {
          void toggle();
        }}
        aria-pressed={soundOn}
        aria-label={soundOn ? `Pause ${title}` : `Play ${title}`}
        className="max-w-[168px] truncate px-1.5 py-0.5 text-left transition-opacity hover:opacity-80"
        title={title}
      >
        <span className={soundOn ? "opacity-100" : "opacity-60"}>{title}</span>
      </button>

      {hasTracks ? (
        <button
          type="button"
          onClick={() => {
            playTick();
            next();
          }}
          aria-label="Next audio track"
          className="px-1 py-0.5 text-[var(--surface-muted)] transition-colors hover:text-[var(--surface-fg)]"
        >
          ›
        </button>
      ) : null}
    </div>
  );
}
