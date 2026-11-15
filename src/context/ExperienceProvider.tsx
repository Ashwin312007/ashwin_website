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

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasEntered, setHasEntered] = useState(false);
  const motionEnabled = true;
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [hoveredCapability, setHoveredCapability] =
    useState<CapabilityRecord | null>(null);

  const scrollStoreRef = useRef<ScrollStore>({
    gateProgress: 0,
    scrollProgress: 0,
    narrativeMorph: 0,
    dialDockProgress: 0,
    disperseProgress: 0,
    activeDialIndex: 0,
    activeAccent: "#34d399",
  });

  const { scrollTo, setPaused: setScrollPaused } = useLenisGSAP(hasEntered);

  // Global backtick (`) and Escape key listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        const activeTag = (document.activeElement as HTMLElement)?.tagName || "";
        const isInputField = ["INPUT", "TEXTAREA"].includes(activeTag);

        if (terminalOpen) {
          e.preventDefault();
          setTerminalOpen(false);
          return;
        }

        if (!isInputField) {
          e.preventDefault();
          setTerminalOpen(true);
        }
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
        toggleMotion: () => {},
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
