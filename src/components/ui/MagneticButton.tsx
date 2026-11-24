"use client";

import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { TriangleCover } from "./TriangleCover";
import { audioEngine } from "@/audio/AudioEngine";

interface SharedMagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  withTriangleCover?: boolean;
  cursor?: "view" | "talk" | "drag" | "play" | "copy";
  cursorTip?: string;
}

type MagneticAsButton = SharedMagneticProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type MagneticAsLink = SharedMagneticProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type MagneticButtonProps = MagneticAsButton | MagneticAsLink;

export function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    className = "",
    strength = 0.25,
    withTriangleCover = true,
    cursor,
    cursorTip,
    ...rest
  } = props;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  useMagnetic(buttonRef, { strength, disabled: props.href !== undefined });
  useMagnetic(anchorRef, { strength, disabled: props.href === undefined });

  const baseClass =
    "group relative inline-flex items-center justify-center overflow-hidden border border-current/25 transition-colors duration-300";

  const content = withTriangleCover ? (
    <TriangleCover className="flex h-full w-full items-center justify-center px-5 py-2.5">
      {children}
    </TriangleCover>
  ) : (
    <span className="relative z-10 inline-flex items-center justify-center px-5 py-2.5">
      {children}
    </span>
  );

  if (typeof props.href === "string") {
    const { href, onPointerEnter, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <a
        ref={anchorRef}
        href={href}
        data-cursor={cursor}
        data-cursor-tip={cursorTip}
        onPointerEnter={(e) => {
          audioEngine.playTick();
          onPointerEnter?.(e);
        }}
        className={`${baseClass} ${className}`}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { type = "button", onPointerEnter, ...btnProps } =
    rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      ref={buttonRef}
      type={type}
      data-cursor={cursor}
      data-cursor-tip={cursorTip}
      onPointerEnter={(e) => {
        audioEngine.playTick();
        onPointerEnter?.(e);
      }}
      className={`${baseClass} ${className}`}
      {...btnProps}
    >
      {content}
    </button>
  );
}
