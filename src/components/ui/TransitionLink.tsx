"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useTransitionNav } from "@/providers/TransitionProvider";
import { audioEngine } from "@/audio/AudioEngine";

export interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: ReactNode;
  className?: string;
  cursor?: "view" | "talk" | "drag" | "play" | "copy";
  cursorTip?: string;
}

export function TransitionLink({
  href,
  children,
  className = "",
  cursor,
  cursorTip,
  onClick,
  onPointerEnter,
  onFocus,
  ...rest
}: TransitionLinkProps) {
  const { navigate, prefetch } = useTransitionNav();
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "/";

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      rest.target === "_blank"
    ) {
      return;
    }

    e.preventDefault();
    const ox =
      typeof window !== "undefined" && window.innerWidth > 0
        ? e.clientX / window.innerWidth
        : 0.5;
    const oy =
      typeof window !== "undefined" && window.innerHeight > 0
        ? e.clientY / window.innerHeight
        : 0.5;
    navigate(hrefStr, [ox, oy]);
  };

  return (
    <Link
      href={href}
      data-cursor={cursor}
      data-cursor-tip={cursorTip}
      onClick={handleClick}
      onPointerEnter={(e) => {
        audioEngine.playTick();
        prefetch(hrefStr);
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        prefetch(hrefStr);
        onFocus?.(e);
      }}
      className={className}
      {...rest}
    >
      {children}
    </Link>
  );
}
