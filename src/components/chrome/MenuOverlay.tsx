"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { PROFILE } from "@/data/profile";
import { useAppStore } from "@/store/useAppStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { LetterRoll } from "@/components/ui/LetterRoll";
import { TriangleCover } from "@/components/ui/TriangleCover";
import { audioEngine } from "@/audio/AudioEngine";

const MENU_LINKS = [
  { index: "00", label: "Hero", href: "/#top" },
  { index: "01", label: "Approach", href: "/#approach" },
  { index: "02", label: "Capabilities", href: "/#capabilities" },
  { index: "03", label: "Work", href: "/#work" },
  { index: "04", label: "Experience", href: "/#experience" },
  { index: "05", label: "Research", href: "/#research" },
  { index: "06", label: "About", href: "/#about" },
  { index: "07", label: "Contact", href: "/#contact" },
] as const;

export function MenuOverlay() {
  const menuOpen = useAppStore((s) => s.menuOpen);
  const reducedMotion = useReducedMotion();

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap + Escape handling + entrance animation
  useEffect(() => {
    if (!menuOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 30);

    const links = dialog.querySelectorAll<HTMLElement>("[data-menu-item]");
    if (!reducedMotion && links.length > 0) {
      gsap.fromTo(
        links,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "expo.out",
          delay: 0.12,
        }
      );
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        useAppStore.getState().set({ menuOpen: false });
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [menuOpen, reducedMotion]);

  if (!menuOpen) return null;

  const close = () => {
    audioEngine.playTick();
    useAppStore.getState().set({ menuOpen: false });
  };

  return (
    <div
      id="site-menu-overlay"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation menu"
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-[#0A0A0A]/96 px-6 py-6 text-[#FAFAFA] backdrop-blur-xl md:px-10 md:py-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8A8A]">
          INDEX · NAVIGATION
        </span>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={close}
          className="overflow-hidden border border-white/25 font-mono text-[11px] uppercase tracking-[0.14em] text-[#FAFAFA]"
        >
          <TriangleCover fillColor="#FAFAFA" className="px-4 py-2">
            <LetterRoll text="CLOSE · ESC" />
          </TriangleCover>
        </button>
      </div>

      <div className="my-auto grid grid-cols-1 gap-10 py-8 lg:grid-cols-12 lg:items-end">
        <nav aria-label="Full navigation" className="lg:col-span-8">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {MENU_LINKS.map((item) => (
              <li key={item.href} data-menu-item>
                <TransitionLink
                  href={item.href}
                  onClick={() => useAppStore.getState().set({ menuOpen: false })}
                  className="group inline-flex items-baseline gap-4 py-1 text-[clamp(2rem,5.4vw,4.6rem)] font-light leading-[1.06] tracking-[-0.025em] text-[#FAFAFA] transition-colors hover:text-[#BDBDBD]"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A8A]">
                    {item.index}
                  </span>
                  <LetterRoll text={item.label} />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          data-menu-item
          className="flex flex-col gap-6 border-t border-white/15 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#BDBDBD] lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
        >
          <div>
            <p className="mb-1 text-[#8A8A8A]">DIRECT CONTACT</p>
            <a
              href={`mailto:${PROFILE.email}`}
              className="text-sm font-normal tracking-normal text-[#FAFAFA] underline-offset-4 hover:underline"
            >
              {PROFILE.email}
            </a>
          </div>

          <div>
            <p className="mb-1 text-[#8A8A8A]">LOCATION & STATUS</p>
            <p className="text-[#FAFAFA]">{PROFILE.location}</p>
            <p className="mt-1 text-[#BDBDBD]">{PROFILE.status}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#FAFAFA] hover:underline"
            >
              <LetterRoll text="GITHUB" />
            </a>
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#FAFAFA] hover:underline"
            >
              <LetterRoll text="LINKEDIN" />
            </a>
            <a
              href={PROFILE.resumePath}
              download
              className="text-[#FAFAFA] hover:underline"
            >
              <LetterRoll text="RÉSUMÉ" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A8A]">
        <span>{PROFILE.name}</span>
        <span>PRESS ESC TO CLOSE</span>
      </div>
    </div>
  );
}
