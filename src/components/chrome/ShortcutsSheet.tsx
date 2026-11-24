"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

const SHORTCUTS = [
  { key: "M", action: "Toggle ambient sound & SFX" },
  { key: "T", action: "Start or stop guided tour" },
  { key: "H", action: "Toggle telemetry HUD" },
  { key: "`", action: "Toggle interactive cyber terminal" },
  { key: "?", action: "Open keyboard shortcuts" },
  { key: "ESC", action: "Close active overlay or stop tour" },
] as const;

export function ShortcutsSheet() {
  const shortcutsOpen = useAppStore((s) => s.shortcutsOpen);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!shortcutsOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const timer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        useAppStore.getState().set({ shortcutsOpen: false });
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
  }, [shortcutsOpen]);

  if (!shortcutsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          useAppStore.getState().set({ shortcutsOpen: false });
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-sheet-title"
        className="w-full max-w-md border border-white/20 bg-[#121212] p-6 text-[#FAFAFA] shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/15 pb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8A8A8A]">
              KEYBOARD CONTROLS
            </p>
            <h2 id="shortcuts-sheet-title" className="mt-1 text-lg font-light">
              Shortcuts
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => useAppStore.getState().set({ shortcutsOpen: false })}
            aria-label="Close keyboard shortcuts"
            className="border border-white/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#FAFAFA] hover:border-white"
          >
            ESC
          </button>
        </div>

        <ul className="divide-y divide-white/10">
          {SHORTCUTS.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-[#BDBDBD]">{item.action}</span>
              <kbd className="min-w-[2.25rem] border border-white/25 bg-[#0A0A0A] px-2 py-0.5 text-center font-mono text-[11px] text-[#FAFAFA]">
                {item.key}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
