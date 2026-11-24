"use client";

import { useAppStore } from "@/store/useAppStore";
import { LetterRoll } from "@/components/ui/LetterRoll";

export function SectionLabel() {
  const section = useAppStore((s) => s.section);
  const idx = String(section.index).padStart(2, "0");
  const formatted = `${idx} · ${section.label}`;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-fg)]"
    >
      <LetterRoll text={formatted} trigger="change" />
    </div>
  );
}
