"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseInertiaOptions {
  count: number;
  motionEnabled: boolean;
  onNotchChange: (index: number, velocityNorm: number) => void;
}

// Arc dial with pointer-capture drag, wheel, touch swipe and arrow keys.
// Angular velocity with friction, spring snap to notches, a tick on each crossing.
// Touch uses horizontal-only capture so page scroll still works.
export function useInertia({
  count,
  motionEnabled,
  onNotchChange,
}: UseInertiaOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [angle, setAngle] = useState(0);
  const [omega, setOmega] = useState(0);

  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const lastXRef = useRef(0);
  const lastNotchRef = useRef(0);
  const horizontalLockRef = useRef<boolean | null>(null);

  const stepDeg = 360 / Math.max(1, count);

  const snapTo = useCallback(
    (idx: number) => {
      const wrapped = ((idx % count) + count) % count;
      const targetAngle = -wrapped * stepDeg;
      angleRef.current = targetAngle;
      velocityRef.current = 0;
      lastNotchRef.current = wrapped;
      setActiveIndex(wrapped);
      setAngle(targetAngle);
      setOmega(0);
      onNotchChange(wrapped, 0.65);
    },
    [count, stepDeg, onNotchChange]
  );

  useEffect(() => {
    let raf = 0;
    const step = () => {
      if (!draggingRef.current) {
        if (Math.abs(velocityRef.current) > 0.035 && motionEnabled) {
          angleRef.current += velocityRef.current;
          velocityRef.current *= 0.92;
        } else {
          const nearest = Math.round(-angleRef.current / stepDeg);
          const target = -nearest * stepDeg;
          const diff = target - angleRef.current;
          angleRef.current += motionEnabled ? diff * 0.18 : diff;
          velocityRef.current *= 0.5;
        }
      }

      const rawNotch = Math.round(-angleRef.current / stepDeg);
      const wrapped = ((rawNotch % count) + count) % count;
      if (wrapped !== lastNotchRef.current) {
        lastNotchRef.current = wrapped;
        setActiveIndex(wrapped);
        onNotchChange(wrapped, Math.min(1, Math.abs(velocityRef.current) / 7));
      }

      setAngle(angleRef.current);
      setOmega(Number((velocityRef.current * 1.04).toFixed(2)));
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [count, stepDeg, motionEnabled, onNotchChange]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    horizontalLockRef.current = null;
    velocityRef.current = 0;
    if (e.pointerType === "mouse") {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!draggingRef.current) return;
    const dxTotal = Math.abs(e.clientX - startXRef.current);
    const dyTotal = Math.abs(e.clientY - startYRef.current);

    if (e.pointerType !== "mouse" && horizontalLockRef.current === null) {
      if (dxTotal > 6 || dyTotal > 6) {
        horizontalLockRef.current = dxTotal >= dyTotal;
      }
    }
    if (horizontalLockRef.current === false) {
      draggingRef.current = false;
      return;
    }

    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    const deltaDeg = dx * 0.42;
    angleRef.current += deltaDeg;
    velocityRef.current = deltaDeg;
  }, []);

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
    horizontalLockRef.current = null;
  }, []);

  const onWheel = useCallback((e: React.WheelEvent<HTMLElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      e.preventDefault();
      const delta = (e.deltaX || e.deltaY) * -0.22;
      velocityRef.current += delta * 0.35;
      angleRef.current += delta;
    }
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        snapTo(activeIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        snapTo(activeIndex - 1);
      }
    },
    [activeIndex, snapTo]
  );

  return {
    activeIndex,
    angle,
    omega,
    snapTo,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onWheel,
      onKeyDown,
    },
  };
}
