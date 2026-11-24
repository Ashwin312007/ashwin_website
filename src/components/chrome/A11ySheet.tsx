"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";
import { audioEngine } from "@/audio/AudioEngine";

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onToggle,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-3.5 last:border-b-0">
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-normal text-[#FAFAFA]"
        >
          {label}
        </label>
        <p className="mt-0.5 text-xs text-[#8A8A8A]">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => {
          audioEngine.playTick();
          onToggle();
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center border transition-colors ${
          checked
            ? "border-[#FAFAFA] bg-[#FAFAFA]"
            : "border-white/25 bg-transparent"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transition-transform ${
            checked
              ? "translate-x-5.5 bg-[#0A0A0A]"
              : "translate-x-1 bg-[#FAFAFA]"
          }`}
        />
      </button>
    </div>
  );
}

export function A11ySheet() {
  const a11yOpen = useAppStore((s) => s.a11yOpen);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const webgl = useAppStore((s) => s.webgl);
  const highContrast = useAppStore((s) => s.highContrast);
  const largeText = useAppStore((s) => s.largeText);
  const tiltControl = useAppStore((s) => s.tiltControl);
  const soundOn = useAppStore((s) => s.soundOn);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!a11yOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        useAppStore.getState().set({ a11yOpen: false });
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [a11yOpen]);

  if (!a11yOpen) return null;

  const handleTiltToggle = async () => {
    const next = !tiltControl;
    if (next && typeof window !== "undefined") {
      const DOE = window.DeviceOrientationEvent as
        | (typeof DeviceOrientationEvent & {
            requestPermission?: () => Promise<"granted" | "denied">;
          })
        | undefined;
      if (DOE && typeof DOE.requestPermission === "function") {
        try {
          const res = await DOE.requestPermission();
          if (res !== "granted") {
            useAppStore.getState().set({ tiltControl: false });
            return;
          }
        } catch {
          useAppStore.getState().set({ tiltControl: false });
          return;
        }
      }
    }
    useAppStore.getState().set({ tiltControl: next });
  };

  const resetDefaults = () => {
    audioEngine.playTick();
    useAppStore.getState().set({
      reducedMotion: false,
      webgl: true,
      highContrast: false,
      largeText: false,
      tiltControl: false,
    });
    if (soundOn) {
      void audioEngine.setEnabled(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          useAppStore.getState().set({ a11yOpen: false });
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-sheet-title"
        className="w-full max-w-md border border-white/20 bg-[#121212] p-6 text-[#FAFAFA] shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8A8A]">
              ACCESSIBILITY & DISPLAY
            </p>
            <h2 id="a11y-sheet-title" className="mt-1 text-lg font-light">
              Preferences
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => useAppStore.getState().set({ a11yOpen: false })}
            aria-label="Close accessibility settings"
            className="border border-white/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#FAFAFA] hover:border-white"
          >
            ESC
          </button>
        </div>

        <div>
          <ToggleRow
            id="a11y-reduce-motion"
            label="Reduce motion"
            description="Uses native scroll and disables scrubbed transforms."
            checked={reducedMotion}
            onToggle={() =>
              useAppStore.getState().set({ reducedMotion: !reducedMotion })
            }
          />
          <ToggleRow
            id="a11y-disable-3d"
            label="Disable 3D WebGL"
            description="Unmounts the 3D scene and enables a calm CSS backdrop."
            checked={!webgl}
            onToggle={() => useAppStore.getState().set({ webgl: !webgl })}
          />
          <ToggleRow
            id="a11y-high-contrast"
            label="High contrast"
            description="Forces pure black/white surfaces and crisp borders."
            checked={highContrast}
            onToggle={() =>
              useAppStore.getState().set({ highContrast: !highContrast })
            }
          />
          <ToggleRow
            id="a11y-large-text"
            label="Larger text"
            description="Scales base root typography by +12.5%."
            checked={largeText}
            onToggle={() =>
              useAppStore.getState().set({ largeText: !largeText })
            }
          />
          <ToggleRow
            id="a11y-tilt-control"
            label="Tilt control (mobile)"
            description="Drives 3D camera parallax from device gyroscope."
            checked={tiltControl}
            onToggle={() => {
              void handleTiltToggle();
            }}
          />
          <ToggleRow
            id="a11y-sound"
            label="Ambient audio"
            description="Generative peristaltic synthesis and UI feedback."
            checked={soundOn}
            onToggle={() => {
              void audioEngine.toggle();
            }}
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
          <button
            type="button"
            onClick={resetDefaults}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#BDBDBD] underline-offset-4 hover:text-[#FAFAFA] hover:underline"
          >
            Reset defaults
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A8A]">
            SAVED LOCALLY
          </span>
        </div>
      </div>
    </div>
  );
}
