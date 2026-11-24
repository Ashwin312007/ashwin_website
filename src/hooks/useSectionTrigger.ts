"use client";

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAppStore, type CameraKey } from "@/store/useAppStore";

export interface UseSectionTriggerOptions {
  id: string;
  index: number;
  label: string;
  cameraKey?: CameraKey;
  start?: string;
  end?: string;
  onProgress?: (progress: number) => void;
}

export function useSectionTrigger<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: UseSectionTriggerOptions
): void {
  const {
    id,
    index,
    label,
    cameraKey,
    start = "top center",
    end = "bottom center",
    onProgress,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const activate = (progress: number) => {
      const state = useAppStore.getState();
      state.set({
        section: { id, index, label, progress },
        ...(cameraKey ? { camera: { key: cameraKey, t: progress } } : {}),
      });
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start,
        end,
        onEnter: (self) => activate(self.progress),
        onEnterBack: (self) => activate(self.progress),
        onUpdate: (self) => {
          if (self.isActive) {
            activate(self.progress);
          }
          onProgress?.(self.progress);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, id, index, label, cameraKey, start, end, onProgress]);
}
