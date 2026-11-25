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
  const firstRunRef = useRef(true);

  const isHome = pathname === "/";
  const scrolledPastHero = scrollY > 460;
  const collapsed = !isDesktop || !isHome || scrolledPastHero || menuOpen;

  // Nav <-> MENU swap. ONE sequenced timeline (items out -> button in, and the reverse) driven only
  // by GSAP `autoAlpha` (opacity + visibility). The button has no React-controlled inline opacity,
  // so it can never pop in on top of nav links that are still fading out.
  useEffect(() => {
    const list = navListRef.current;
    const btn = menuBtnRef.current;
    if (!list || !btn) return;

    const items = list.querySelectorAll<HTMLElement>("[data-nav-item]");

    list.style.pointerEvents = collapsed ? "none" : "auto";
    btn.style.pointerEvents = collapsed ? "auto" : "none";

    if (reducedMotion || firstRunRef.current) {
      firstRunRef.current = false;
      gsap.set(items, { autoAlpha: collapsed ? 0 : 1, y: collapsed ? -14 : 0 });
      gsap.set(btn, { autoAlpha: collapsed ? 1 : 0, y: 0 });
      return;
    }

    const tl = gsap.timeline();
    if (collapsed) {
      tl.to(items, {
        autoAlpha: 0,
        y: -14,
        duration: 0.3,
        stagger: 0.035,
        ease: "power3.in",
      }).fromTo(
        btn,
        { y: -8 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "expo.out" },
        ">-0.05"
      );
    } else {
      tl.to(btn, { autoAlpha: 0, y: -8, duration: 0.22, ease: "power2.in" }).to(
        items,
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "expo.out" },
        ">-0.05"
      );
    }

    return () => {
      tl.kill();
    };
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
    <>
    {/* Top scrim: content scrolling under the fixed header fades out instead of colliding with the logo/nav */}
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-[var(--surface-bg)]/90 via-[var(--surface-bg)]/60 via-50% to-transparent transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
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
          className="pointer-events-auto invisible absolute top-0 right-0 z-10 overflow-hidden border border-[var(--surface-border)] bg-[var(--surface-bg)]/50 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--surface-fg)] backdrop-blur-md transition-colors"
        >
          <TriangleCover className="px-4 py-2">
            <LetterRoll text={menuOpen ? "CLOSE" : "MENU"} />
          </TriangleCover>
        </button>
      </nav>
    </header>
    </>
  );
}
