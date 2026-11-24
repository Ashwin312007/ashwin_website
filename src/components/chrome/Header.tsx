"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useAppStore } from "@/store/useAppStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LetterRoll } from "@/components/ui/LetterRoll";
import { TriangleCover } from "@/components/ui/TriangleCover";
import { audioEngine } from "@/audio/AudioEngine";

const NAV_ITEMS = [
  { label: "WORK", href: "/#work" },
  { label: "CAPABILITIES", href: "/#capabilities" },
  { label: "EXPERIENCE", href: "/#experience" },
  { label: "ABOUT", href: "/#about" },
  { label: "CONTACT", href: "/#contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useReducedMotion();

  const scrollY = useAppStore((s) => s.scroll.y);
  const menuOpen = useAppStore((s) => s.menuOpen);
  const loaded = useAppStore((s) => s.loaded);

  const navListRef = useRef<HTMLUListElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const isHome = pathname === "/";
  const scrolledPastHero = scrollY > 460;
  const collapsed = !isDesktop || !isHome || scrolledPastHero || menuOpen;

  useEffect(() => {
    const list = navListRef.current;
    const btn = menuBtnRef.current;
    if (!list || !btn) return;

    const items = list.querySelectorAll<HTMLElement>("[data-nav-item]");

    if (reducedMotion) {
      gsap.set(items, {
        y: collapsed ? -12 : 0,
        opacity: collapsed ? 0 : 1,
        pointerEvents: collapsed ? "none" : "auto",
      });
      gsap.set(btn, {
        y: collapsed ? 0 : 10,
        opacity: collapsed ? 1 : 0,
        pointerEvents: collapsed ? "auto" : "none",
      });
      return;
    }

    if (collapsed) {
      gsap.to(items, {
        y: -14,
        opacity: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: "power3.in",
        overwrite: "auto",
        onStart: () => {
          list.style.pointerEvents = "none";
        },
      });
      gsap.to(btn, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        delay: 0.14,
        ease: "expo.out",
        overwrite: "auto",
        onStart: () => {
          btn.style.pointerEvents = "auto";
        },
      });
    } else {
      gsap.to(btn, {
        y: -8,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
        onStart: () => {
          btn.style.pointerEvents = "none";
        },
      });
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.48,
        stagger: 0.04,
        delay: 0.08,
        ease: "expo.out",
        overwrite: "auto",
        onStart: () => {
          list.style.pointerEvents = "auto";
        },
      });
    }
  }, [collapsed, reducedMotion]);

  const toggleMenu = () => {
    audioEngine.playTick();
    useAppStore.getState().set((s) => ({
      menuOpen: !s.menuOpen,
      a11yOpen: false,
      shortcutsOpen: false,
    }));
  };

  return (
    <header
      className={`pointer-events-none fixed top-0 right-0 left-0 z-40 flex items-start justify-between px-6 py-5 transition-opacity duration-500 md:px-10 md:py-7 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <TransitionLink
        href="/#top"
        aria-label="Ashwin T E — Back to top"
        className="pointer-events-auto text-[26px] font-medium lowercase tracking-[-0.03em] text-[var(--surface-fg)] transition-colors duration-300"
      >
        <LetterRoll text="ashwin t e" />
      </TransitionLink>

      <nav aria-label="Primary navigation" className="relative flex flex-col items-end">
        <ul
          ref={navListRef}
          className="pointer-events-auto flex flex-col items-end gap-2 font-mono text-[11px] uppercase tracking-[0.14em]"
          aria-hidden={collapsed}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.href} data-nav-item>
              <TransitionLink
                href={item.href}
                tabIndex={collapsed ? -1 : 0}
                className="inline-flex items-center py-0.5 text-[var(--surface-fg)]/85 transition-colors hover:text-[var(--surface-fg)]"
              >
                <LetterRoll text={item.label} />
              </TransitionLink>
            </li>
          ))}
        </ul>

        <button
          ref={menuBtnRef}
          type="button"
          onClick={toggleMenu}
          onPointerEnter={() => audioEngine.playTick()}
          aria-expanded={menuOpen}
          aria-controls="site-menu-overlay"
          tabIndex={collapsed ? 0 : -1}
          className="pointer-events-auto absolute top-0 right-0 overflow-hidden border border-[var(--surface-border)] bg-[var(--surface-bg)]/50 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-fg)] backdrop-blur-md transition-colors"
          style={{ opacity: collapsed ? 1 : 0 }}
        >
          <TriangleCover className="px-4 py-2">
            <LetterRoll text={menuOpen ? "CLOSE" : "MENU"} />
          </TriangleCover>
        </button>
      </nav>
    </header>
  );
}
