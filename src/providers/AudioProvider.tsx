"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { audioEngine } from "@/audio/AudioEngine";
import { useAppStore } from "@/store/useAppStore";

export interface AudioContextValue {
  toggle: () => Promise<boolean>;
  next: () => void;
  prev: () => void;
  playTick: () => void;
  playWhoosh: () => void;
  playCopy: () => void;
  volume: number;
  setVolume: (v: number) => void;
}

const AudioContext = createContext<AudioContextValue>({
  toggle: async () => false,
  next: () => {},
  prev: () => {},
  playTick: () => {},
  playWhoosh: () => {},
  playCopy: () => {},
  volume: 0.5,
  setVolume: () => {},
});

export function useAudio(): AudioContextValue {
  return useContext(AudioContext);
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    // Sync scroll velocity into AudioEngine without React re-renders
    const unsubscribe = useAppStore.subscribe((state, prev) => {
      if (state.scroll.velocity !== prev.scroll.velocity) {
        audioEngine.setVelocity(state.scroll.velocity);
      }
    });

    return () => {
      unsubscribe();
      audioEngine.dispose();
    };
  }, []);

  const toggle = useCallback(() => audioEngine.toggle(), []);
  const next = useCallback(() => audioEngine.next(), []);
  const prev = useCallback(() => audioEngine.prev(), []);
  const playTick = useCallback(() => audioEngine.playTick(), []);
  const playWhoosh = useCallback(() => audioEngine.playWhoosh(), []);
  const playCopy = useCallback(() => audioEngine.playCopy(), []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    audioEngine.setVolume(v);
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({
      toggle,
      next,
      prev,
      playTick,
      playWhoosh,
      playCopy,
      volume,
      setVolume,
    }),
    [toggle, next, prev, playTick, playWhoosh, playCopy, volume, setVolume]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
