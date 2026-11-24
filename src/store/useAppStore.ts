import { create } from "zustand";

export type Surface = "dark" | "light";
export type Tier = "high" | "mid" | "low";
export type CameraKey =
  | "top"
  | "dive_in"
  | "approach"
  | "capabilities"
  | "work"
  | "experience"
  | "research"
  | "about"
  | "prefooter"
  | "footer"
  | "case";

export interface AppState {
  loaded: boolean;
  tier: Tier;
  webgl: boolean;
  webglReady: boolean;
  webglProgress: number;
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  tiltControl: boolean;
  soundOn: boolean;
  surface: Surface;
  scroll: {
    y: number;
    progress: number;
    velocity: number;
    direction: 1 | -1;
  };
  section: {
    id: string;
    index: number;
    label: string;
    progress: number;
  };
  camera: {
    key: CameraKey;
    t: number;
  };
  wipe: {
    progress: number;
    origin: [number, number];
  };
  pointer: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
  accent: string;
  tour: {
    active: boolean;
    step: number;
  };
  transition: {
    phase: "idle" | "out" | "in";
    origin: [number, number];
  };
  menuOpen: boolean;
  a11yOpen: boolean;
  shortcutsOpen: boolean;
  hudVisible: boolean;
  terminalOpen: boolean;
  portraitEl: HTMLElement | null;
  portraitMix: number;
  portraitFade: number;
  footerDomeProgress: number;
  audioTrackTitle: string;
  audioHasTracks: boolean;
  set: (
    partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)
  ) => void;
}

export const useAppStore = create<AppState>((set) => ({
  loaded: false,
  tier: "high",
  webgl: true,
  webglReady: false,
  webglProgress: 0,
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  tiltControl: false,
  soundOn: false,
  surface: "dark",
  scroll: {
    y: 0,
    progress: 0,
    velocity: 0,
    direction: 1,
  },
  section: {
    id: "top",
    index: 0,
    label: "HERO",
    progress: 0,
  },
  camera: {
    key: "top",
    t: 0,
  },
  wipe: {
    progress: 0,
    origin: [0.5, 0.5],
  },
  pointer: {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  },
  accent: "#ffffff",
  tour: {
    active: false,
    step: 0,
  },
  transition: {
    phase: "idle",
    origin: [0.5, 0.5],
  },
  menuOpen: false,
  a11yOpen: false,
  shortcutsOpen: false,
  hudVisible: true,
  terminalOpen: false,
  portraitEl: null,
  portraitMix: 0,
  portraitFade: 0,
  footerDomeProgress: 0,
  audioTrackTitle: "Ambient · Peristalsis",
  audioHasTracks: false,
  set: (partial) =>
    set((state) => (typeof partial === "function" ? partial(state) : partial)),
}));
