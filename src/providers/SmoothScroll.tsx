"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis, { type ScrollToOptions } from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { audioEngine } from "@/audio/AudioEngine";

export interface SmoothScrollContextValue {
  scrollTo: (target: number | string | HTMLElement, options?: ScrollToOptions) => void;
  stop: () => void;
  start: () => void;
  getLenis: () => Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
  getLenis: () => null,
});

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  const loaded = useAppStore((s) => s.loaded);
  const menuOpen = useAppStore((s) => s.menuOpen);
  const a11yOpen = useAppStore((s) => s.a11yOpen);
  const shortcutsOpen = useAppStore((s) => s.shortcutsOpen);
  const terminalOpen = useAppStore((s) => s.terminalOpen);

  // Initialize Lenis (or native fallback when reduced motion is enabled)
  useEffect(() => {
    if (reducedMotion) {
      lenisRef.current?.destroy();
      lenisRef.current = null;

      let lastY = window.scrollY;
      let lastTime = performance.now();

      const onNativeScroll = () => {
        const y = window.scrollY;
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const now = performance.now();
        const dt = Math.max(16, now - lastTime);
        const dy = y - lastY;
        const velocity = (dy / dt) * 16;
        const direction: 1 | -1 = dy < 0 ? -1 : 1;

        lastY = y;
        lastTime = now;

        ScrollTrigger.update();
        useAppStore.getState().set({
          scroll: {
            y,
            progress: Math.min(1, Math.max(0, y / maxScroll)),
            velocity,
            direction,
          },
        });
      };

      window.addEventListener("scroll", onNativeScroll, { passive: true });
      ScrollTrigger.refresh();
      return () => {
        window.removeEventListener("scroll", onNativeScroll);
      };
    }

    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      smoothWheel: true,
      autoRaf: false,
      respectReducedMotion: false,
    });
    lenisRef.current = lenis;

    const unsubscribeScroll = lenis.on("scroll", (instance) => {
      ScrollTrigger.update();
      useAppStore.getState().set({
        scroll: {
          y: instance.scroll,
          progress: instance.progress,
          velocity: instance.velocity,
          direction: instance.direction === -1 ? -1 : 1,
        },
      });
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    let cancelled = false;
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) {
          lenis.resize();
          ScrollTrigger.refresh();
        }
      });
    }

    return () => {
      cancelled = true;
      gsap.ticker.remove(onTick);
      unsubscribeScroll();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Stop Lenis when preloader or modal overlays are open
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const shouldStop =
      !loaded || menuOpen || a11yOpen || shortcutsOpen || terminalOpen;
    if (shouldStop) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [loaded, menuOpen, a11yOpen, shortcutsOpen, terminalOpen]);

  // Refresh ScrollTrigger once preloader exits
  useEffect(() => {
    if (!loaded) return;
    const raf = requestAnimationFrame(() => {
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(raf);
  }, [loaded]);

  // Global keyboard shortcuts (M, T, H, `, ?, Esc)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          if (e.key === "Escape" && useAppStore.getState().terminalOpen) {
            useAppStore.getState().set({ terminalOpen: false });
          }
          return;
        }
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const state = useAppStore.getState();

      if (e.key === "Escape") {
        if (
          state.menuOpen ||
          state.a11yOpen ||
          state.shortcutsOpen ||
          state.terminalOpen ||
          state.tour.active
        ) {
          e.preventDefault();
          state.set({
            menuOpen: false,
            a11yOpen: false,
            shortcutsOpen: false,
            terminalOpen: false,
            tour: { active: false, step: 0 },
          });
        }
        return;
      }

      if (e.key === "`" || e.code === "Backquote") {
        e.preventDefault();
        state.set({
          terminalOpen: !state.terminalOpen,
          menuOpen: false,
          a11yOpen: false,
          shortcutsOpen: false,
        });
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        state.set({
          shortcutsOpen: !state.shortcutsOpen,
          menuOpen: false,
          a11yOpen: false,
        });
        return;
      }

      const lower = e.key.toLowerCase();
      if (lower === "m") {
        e.preventDefault();
        void audioEngine.toggle();
      } else if (lower === "t") {
        e.preventDefault();
        state.set({
          tour: { active: !state.tour.active, step: 0 },
          menuOpen: false,
        });
      } else if (lower === "h") {
        e.preventDefault();
        state.set({ hudVisible: !state.hudVisible });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: ScrollToOptions) => {
      const lenis = lenisRef.current;
      if (lenis && !reducedMotion) {
        lenis.scrollTo(target, options);
        return;
      }

      if (typeof target === "number") {
        window.scrollTo({
          top: target + (options?.offset ?? 0),
          behavior: reducedMotion || options?.immediate ? "auto" : "smooth",
        });
      } else {
        const el =
          typeof target === "string" ? document.querySelector(target) : target;
        if (el) {
          const top =
            el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
          window.scrollTo({
            top,
            behavior: reducedMotion || options?.immediate ? "auto" : "smooth",
          });
        }
      }
      options?.onComplete?.(lenis as unknown as Lenis);
    },
    [reducedMotion]
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const getLenis = useCallback(() => lenisRef.current, []);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({ scrollTo, stop, start, getLenis }),
    [scrollTo, stop, start, getLenis]
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
