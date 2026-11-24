"use client";

import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";

const STORAGE_KEY = "ashwin-a11y-prefs";

interface PersistedA11yPrefs {
  reducedMotion?: boolean;
  webgl?: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  tiltControl?: boolean;
}

function readPersistedPrefs(): PersistedA11yPrefs {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as PersistedA11yPrefs;
  } catch {
    return {};
  }
}

function writePersistedPrefs(prefs: PersistedA11yPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage quota or privacy-mode failures
  }
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const osReducedMotion = useOSReducedMotion();

  const surface = useAppStore((s) => s.surface);
  const reducedMotion = useAppStore((s) => s.reducedMotion);
  const webgl = useAppStore((s) => s.webgl);
  const highContrast = useAppStore((s) => s.highContrast);
  const largeText = useAppStore((s) => s.largeText);
  const tiltControl = useAppStore((s) => s.tiltControl);

  // Hydrate saved accessibility preferences once on mount
  useEffect(() => {
    const saved = readPersistedPrefs();
    const updates: Partial<PersistedA11yPrefs> = {};
    if (typeof saved.reducedMotion === "boolean") updates.reducedMotion = saved.reducedMotion;
    if (typeof saved.webgl === "boolean") updates.webgl = saved.webgl;
    if (typeof saved.highContrast === "boolean") updates.highContrast = saved.highContrast;
    if (typeof saved.largeText === "boolean") updates.largeText = saved.largeText;
    if (typeof saved.tiltControl === "boolean") updates.tiltControl = saved.tiltControl;

    if (Object.keys(updates).length > 0) {
      useAppStore.getState().set(updates);
    }
  }, []);

  // Sync store flags + OS preference onto <html> data-* attributes and persist
  useEffect(() => {
    const root = document.documentElement;
    const effectiveReduced = osReducedMotion || reducedMotion;

    root.setAttribute("data-surface", surface);
    root.setAttribute("data-reduced-motion", String(effectiveReduced));
    root.setAttribute("data-high-contrast", String(highContrast));
    root.setAttribute("data-large-text", String(largeText));
    root.setAttribute("data-webgl", String(webgl));
    root.setAttribute("data-tilt-control", String(tiltControl));

    writePersistedPrefs({
      reducedMotion,
      webgl,
      highContrast,
      largeText,
      tiltControl,
    });
  }, [
    osReducedMotion,
    surface,
    reducedMotion,
    webgl,
    highContrast,
    largeText,
    tiltControl,
  ]);

  return <>{children}</>;
}
