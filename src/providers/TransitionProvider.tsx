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
import { usePathname, useRouter } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import { PROJECTS } from "@/data/projects";
import { useAppStore } from "@/store/useAppStore";
import { useSmoothScroll } from "./SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { audioEngine } from "@/audio/AudioEngine";

export interface TransitionContextValue {
  navigate: (href: string, origin?: [number, number]) => void;
  prefetch: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  prefetch: () => {},
});

export function useTransitionNav(): TransitionContextValue {
  return useContext(TransitionContext);
}

function resolveAccentForPath(pathname: string): string {
  if (pathname.startsWith("/work/")) {
    const slug = pathname.slice("/work/".length).split("/")[0];
    const match = PROJECTS.find((p) => p.id === slug);
    if (match) return match.accent;
  }
  return "#ffffff";
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const reducedMotion = useReducedMotion();

  const outTimerRef = useRef<number | null>(null);
  const inTimerRef = useRef<number | null>(null);
  const prevPathRef = useRef<string>(pathname);

  const clearTimers = useCallback(() => {
    if (outTimerRef.current !== null) {
      window.clearTimeout(outTimerRef.current);
      outTimerRef.current = null;
    }
    if (inTimerRef.current !== null) {
      window.clearTimeout(inTimerRef.current);
      inTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Handle route arrival & browser back/forward
  useEffect(() => {
    const isRouteChange = prevPathRef.current !== pathname;
    prevPathRef.current = pathname;

    const accent = resolveAccentForPath(pathname);
    const state = useAppStore.getState();

    state.set({
      accent,
      surface: "dark",
      wipe: { progress: 0, origin: [0.5, 0.5] },
      menuOpen: false,
      ...(pathname.startsWith("/work/")
        ? {
            camera: { key: "case", t: 0 },
            section: { id: "case", index: 3, label: "CASE STUDY", progress: 0 },
          }
        : {}),
    });

    if (!isRouteChange) return;

    scrollTo(0, { immediate: true });

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const currentPhase = useAppStore.getState().transition.phase;
        if (currentPhase === "out" || !reducedMotion) {
          useAppStore.getState().set({
            transition: { phase: "in", origin: [0.5, 0.5] },
          });
          inTimerRef.current = window.setTimeout(
            () => {
              useAppStore.getState().set({
                transition: { phase: "idle", origin: [0.5, 0.5] },
              });
            },
            reducedMotion ? 180 : 780
          );
        } else {
          useAppStore.getState().set({
            transition: { phase: "idle", origin: [0.5, 0.5] },
          });
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname, reducedMotion, scrollTo]);

  const navigate = useCallback(
    (href: string, origin: [number, number] = [0.5, 0.5]) => {
      const [rawPath, hash] = href.split("#");
      const targetPath = rawPath || pathname;

      // Same-page hash navigation
      if (targetPath === pathname) {
        useAppStore.getState().set({ menuOpen: false });
        if (hash) {
          scrollTo(`#${hash}`, { duration: reducedMotion ? 0 : 1.2 });
        } else {
          scrollTo(0, { duration: reducedMotion ? 0 : 1.2 });
        }
        return;
      }

      clearTimers();
      audioEngine.playWhoosh();

      useAppStore.getState().set({
        menuOpen: false,
        tour: { active: false, step: 0 },
        transition: { phase: "out", origin },
      });

      const coverDelay = reducedMotion ? 160 : 680;
      outTimerRef.current = window.setTimeout(() => {
        router.push(href, { scroll: false });
      }, coverDelay);
    },
    [pathname, reducedMotion, router, scrollTo, clearTimers]
  );

  const prefetch = useCallback(
    (href: string) => {
      const targetPath = href.split("#")[0];
      if (targetPath && targetPath !== pathname) {
        router.prefetch(targetPath);
      }
    },
    [pathname, router]
  );

  const value = useMemo<TransitionContextValue>(
    () => ({ navigate, prefetch }),
    [navigate, prefetch]
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}
