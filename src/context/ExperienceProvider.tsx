"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLenisGSAP } from "@/hooks/useLenisGSAP";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CapabilityRecord } from "@/data/capabilities";

export interface ScrollStore {
  gateProgress: number; // 0 -> 1 during EntryGate
  scrollProgress: number; // 0 -> 1 overall page scroll
  narrativeMorph: number; // 0 -> 1 in Point-Line-Plane section
  dialDockProgress: number; // 0 (centered) -> 1 (docked at left half-circle dial hub)
  disperseProgress: number; // 0 (assembled solid structure) -> 1 (dispersed into small stars)
  activeDialIndex: number; // 0 -> 7
  activeAccent: string; // hex color of current project
}

export interface ExperienceContextValue {
  hasEntered: boolean;
  motionEnabled: boolean;
  terminalOpen: boolean;
  hoveredCapability: CapabilityRecord | null;
  scrollStoreRef: React.MutableRefObject<ScrollStore>;
  enterExperience: () => void;
  toggleMotion: () => void;
  setTerminalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHoveredCapability: (cap: CapabilityRecord | null) => void;
  scrollTo: (target: string | HTMLElement) => void;
  setScrollPaused: (paused: boolean) => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function isInputOrEditable(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toUpperCase();
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }
  if (
    (element as HTMLElement).isContentEditable ||
    element.getAttribute("contenteditable") === "true" ||
    element.getAttribute("contenteditable") === ""
  ) {
    return true;
  }
  return false;
}

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Default to true immediately (no blocking gate)
  const [hasEntered, setHasEntered] = useState(true);

  // Motion preference: respects OS prefers-reduced-motion, with explicit manual user toggle support
  const prefersReduced = useReducedMotion();
  const [userMotionOverride, setUserMotionOverride] = useState<boolean | null>(
    null
  );

  const motionEnabled =
    userMotionOverride !== null ? userMotionOverride : !prefersReduced;

  const toggleMotion = useCallback(() => {
    setUserMotionOverride((prev) => {
      const current = prev !== null ? prev : !prefersReduced;
      return !current;
    });
  }, [prefersReduced]);

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [hoveredCapability, setHoveredCapability] =
    useState<CapabilityRecord | null>(null);

  const scrollStoreRef = useRef<ScrollStore>({
    gateProgress: 1,
    scrollProgress: 0,
    narrativeMorph: 0,
    dialDockProgress: 0,
    disperseProgress: 0,
    activeDialIndex: 0,
    activeAccent: "#34d399",
  });

  const { scrollTo, setPaused: setScrollPaused } = useLenisGSAP(
    hasEntered,
    motionEnabled
  );

  // Global backtick (`) and tilde (~) shortcut listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        const target = e.target as Element | null;
        const active = document.activeElement;

        // Never trigger if user is focused or typing inside an input, textarea, or contenteditable
        if (isInputOrEditable(target) || isInputOrEditable(active)) {
          return;
        }

        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      } else if (e.key === "Escape" && terminalOpen) {
        e.preventDefault();
        setTerminalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [terminalOpen]);

  const enterExperience = useCallback(() => {
    setHasEntered(true);
  }, []);

  return (
    <ExperienceContext.Provider
      value={{
        hasEntered,
        motionEnabled,
        terminalOpen,
        hoveredCapability,
        scrollStoreRef,
        enterExperience,
        toggleMotion,
        setTerminalOpen,
        setHoveredCapability,
        scrollTo,
        setScrollPaused,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used inside ExperienceProvider");
  }
  return ctx;
}
