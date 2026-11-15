"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { PROJECTS, ProjectRecord } from "@/data/projects";
import { useExperience } from "@/context/ExperienceProvider";
import { WorkModal } from "@/components/motion/WorkModal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProjectMotionCanvas({
  type,
  accent,
  motionEnabled,
}: {
  type: ProjectRecord["motionType"];
  accent: string;
  motionEnabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const render = () => {
      if (motionEnabled) t += 0.032;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle background grid
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;

      if (type === "peristaltic") {
        // Pipe walls
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(16, 22);
        ctx.lineTo(w - 16, 22);
        ctx.moveTo(16, h - 22);
        ctx.lineTo(w - 16, h - 22);
        ctx.stroke();
        ctx.setLineDash([]);

        // Central tendon wire
        ctx.strokeStyle = "rgba(155,193,255,0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, h / 2);
        ctx.lineTo(w - 30, h / 2);
        ctx.stroke();

        // 3-Segment metameric body
        for (let i = 0; i < 3; i++) {
          const phase = t * 2.2 - i * 1.35;
          const radial = Math.sin(phase);
          const segH = 46 + radial * 24; // expands to touch walls
          const segW = 68 - radial * 16;
          const x = 70 + i * 110 + Math.cos(phase) * 12;
          const y = (h - segH) / 2;

          // Segment outer shell
          ctx.strokeStyle = accent;
          ctx.lineWidth = radial > 0.4 ? 2.2 : 1.2;
          ctx.strokeRect(x, y, segW, segH);

          // Compliant TPU bellows folds
          for (let r = 1; r < 4; r++) {
            const rx = x + (segW / 4) * r;
            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.beginPath();
            ctx.moveTo(rx, y + 4);
            ctx.lineTo(rx, y + segH - 4);
            ctx.stroke();
          }

          // Wall anchoring contact vectors when fully expanded
          if (radial > 0.6) {
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(x + segW / 2, y, 3, 0, Math.PI * 2);
            ctx.arc(x + segW / 2, y + segH, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (type === "archerfish") {
        // Variable-aperture nozzle
        const aperture = 10 + Math.sin(t * 2.6) * 6;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(24, h / 2 - 26);
        ctx.lineTo(70, h / 2 - aperture);
        ctx.moveTo(24, h / 2 + 26);
        ctx.lineTo(70, h / 2 + aperture);
        ctx.stroke();

        // Nozzle iris guide lines
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.strokeRect(18, h / 2 - 28, 20, 56);

        // Water jet droplets along parabolic trajectory
        for (let i = 0; i < 16; i++) {
          const prog = (t * 0.95 + i / 16) % 1;
          const px = 76 + prog * (w - 110);
          const py = h / 2 - Math.sin(prog * Math.PI) * 44;
          const r = 2.2 + (1 - prog) * 2.8;
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Target impact crosshair
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(w - 34, h / 2, 8, 0, Math.PI * 2);
        ctx.moveTo(w - 44, h / 2);
        ctx.lineTo(w - 24, h / 2);
        ctx.moveTo(w - 34, h / 2 - 10);
        ctx.lineTo(w - 34, h / 2 + 10);
        ctx.stroke();
      } else if (type === "nasa-rover") {
        // Martian undulating terrain profile
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < w; x += 5) {
          const y = h - 26 + Math.sin(x * 0.024 + t * 2) * 8 + Math.cos(x * 0.05 + t) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Rocker-Bogie wheel positions
        const w1x = w * 0.32;
        const w2x = w * 0.50;
        const w3x = w * 0.68;
        const w1y = h - 42 + Math.sin(w1x * 0.024 + t * 2) * 8;
        const w2y = h - 42 + Math.sin(w2x * 0.024 + t * 2) * 8;
        const w3y = h - 42 + Math.sin(w3x * 0.024 + t * 2) * 8;
        const bodyY = (w1y + w2y + w3y) / 3 - 26;

        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.8;
        // 3 Wheels
        [w1x, w2x, w3x].forEach((wx, i) => {
          const wy = [w1y, w2y, w3y][i];
          ctx.beginPath();
          ctx.arc(wx, wy, 13, 0, Math.PI * 2);
          ctx.stroke();
          // Spokes
          const rot = t * 2;
          ctx.beginPath();
          ctx.moveTo(wx, wy);
          ctx.lineTo(wx + Math.cos(rot) * 12, wy + Math.sin(rot) * 12);
          ctx.stroke();
        });

        // Rocker-bogie linkage bars
        ctx.beginPath();
        ctx.moveTo(w1x, w1y);
        ctx.lineTo(w2x - 10, bodyY + 6);
        ctx.lineTo(w2x, w2y);
        ctx.moveTo(w2x - 10, bodyY + 6);
        ctx.lineTo(w3x, w3y);
        ctx.stroke();

        // Avionics chassis & PDB enclosure
        ctx.strokeStyle = accent;
        ctx.strokeRect(w * 0.5 - 32, bodyY - 14, 64, 18);
        ctx.fillStyle = "rgba(155,193,255,0.15)";
        ctx.fillRect(w * 0.5 - 32, bodyY - 14, 64, 18);
      } else if (type === "ros2-rover") {
        const cx = 95;
        const cy = h / 2;

        // LiDAR sweep radar
        ctx.strokeStyle = "rgba(147,197,253,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 42, 0, Math.PI * 2);
        ctx.stroke();

        const angle = t * 2.2;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 42, cy + Math.sin(angle) * 42);
        ctx.stroke();

        // Dual-EKF Covariance Ellipse
        const covA = 22 + Math.sin(t * 3) * 4;
        const covB = 14 + Math.cos(t * 3) * 3;
        ctx.strokeStyle = "rgba(52,211,153,0.45)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, covA, covB, Math.PI / 6, 0, Math.PI * 2);
        ctx.stroke();

        // Nav2 MPPI Rollout trajectories
        for (let k = -2; k <= 2; k++) {
          ctx.strokeStyle = k === 0 ? accent : "rgba(147,197,253,0.2)";
          ctx.lineWidth = k === 0 ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.bezierCurveTo(
            cx + 70,
            cy + k * 18,
            cx + 150,
            cy - k * 14,
            w - 35,
            cy + k * 8
          );
          ctx.stroke();
        }
      } else if (type === "tonometer") {
        // Micro-pneumatic pulse waveform & solenoid valve
        ctx.strokeStyle = "rgba(251,191,36,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, h - 25);
        ctx.lineTo(w - 20, h - 25);
        ctx.stroke();

        // Dynamic pressure pulse curve P(t)
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let x = 20; x < w - 20; x += 3) {
          const norm = (x - 20) / (w - 40);
          // Bell curve pulse with traveling wave
          const pulsePhase = (t * 1.5) % 3 - 1;
          const dist = norm - (pulsePhase * 0.4 + 0.3);
          const gaussian = Math.exp(-(dist * dist) * 45);
          const py = h - 25 - gaussian * (h - 55);
          if (x === 20) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();

        // Solenoid valve gate indicator
        const valveOpen = Math.sin(t * 3) > 0.3;
        ctx.strokeStyle = valveOpen ? "#34d399" : "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(30, 25, 36, 24);
        ctx.fillStyle = valveOpen ? "rgba(52,211,153,0.2)" : "transparent";
        ctx.fillRect(30, 25, 36, 24);
      } else if (type === "agrisort") {
        // Conveyor belt with NIR active illumination
        const beltY = h / 2 + 18;
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(20, beltY);
        ctx.lineTo(w - 20, beltY);
        ctx.stroke();

        // Moving items on conveyor
        for (let i = 0; i < 4; i++) {
          const itemX = (25 + ((t * 45 + i * 90) % (w - 60)));
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(itemX, beltY - 12, 10, 0, Math.PI * 2);
          ctx.fill();

          // 850nm NIR cone when under scanner
          if (itemX > w * 0.42 && itemX < w * 0.58) {
            ctx.fillStyle = "rgba(52,211,153,0.18)";
            ctx.beginPath();
            ctx.moveTo(w * 0.5, 18);
            ctx.lineTo(w * 0.4, beltY);
            ctx.lineTo(w * 0.6, beltY);
            ctx.closePath();
            ctx.fill();
          }
        }

        // Scanner emitter head
        ctx.strokeStyle = accent;
        ctx.strokeRect(w * 0.5 - 18, 16, 36, 12);
      } else if (type === "drone") {
        // Quadcopter attitude and thrust vectors
        const cx = w * 0.5;
        const cy = h * 0.5 + Math.sin(t * 3) * 6;
        const roll = Math.sin(t * 2) * 0.15;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(roll);

        // Quadcopter cross arms
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-55, 0);
        ctx.lineTo(55, 0);
        ctx.stroke();

        // 4 Rotors with spinning blades
        [-55, 55].forEach((rx) => {
          ctx.fillStyle = "rgba(56,189,248,0.25)";
          ctx.beginPath();
          ctx.ellipse(rx, -10, 18, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Thrust vector arrow
          ctx.strokeStyle = "#38bdf8";
          ctx.beginPath();
          ctx.moveTo(rx, -12);
          ctx.lineTo(rx, -28 - Math.sin(t * 6) * 4);
          ctx.stroke();
        });

        // Center fuselage & Pixhawk cube
        ctx.fillStyle = accent;
        ctx.fillRect(-12, -8, 24, 16);
        ctx.restore();

        // Gyro horizon line
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        ctx.moveTo(25, h / 2);
        ctx.lineTo(65, h / 2);
        ctx.moveTo(w - 65, h / 2);
        ctx.lineTo(w - 25, h / 2);
        ctx.stroke();
      } else if (type === "lqr-line") {
        // High speed line following with state-space recovery
        ctx.strokeStyle = "rgba(255,255,255,0.22)";
        ctx.lineWidth = 1;
        // Track line
        ctx.beginPath();
        for (let x = 20; x < w - 20; x += 4) {
          const ly = h / 2 + Math.sin(x * 0.03 + t) * 25;
          if (x === 20) ctx.moveTo(x, ly);
          else ctx.lineTo(x, ly);
        }
        ctx.stroke();

        // Robot position on line
        const rx = w * 0.48;
        const targetY = h / 2 + Math.sin(rx * 0.03 + t) * 25;
        const err = Math.sin(t * 3.5) * 12; // tracking error
        const ry = targetY + err;

        // Differential drive robot body
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(rx - 20, ry - 14, 40, 28);
        ctx.fillStyle = "rgba(251,191,36,0.15)";
        ctx.fillRect(rx - 20, ry - 14, 40, 28);

        // LQR Error vector arrow
        ctx.strokeStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx, targetY);
        ctx.stroke();

        // IR sensor array dots on front bumper
        ctx.fillStyle = accent;
        for (let s = -3; s <= 3; s++) {
          ctx.beginPath();
          ctx.arc(rx + 22, ry + s * 4, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (motionEnabled) {
        raf = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [type, accent, motionEnabled]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={145}
      className="h-[135px] w-full sm:h-[150px]"
    />
  );
}

// Left-Edge Half-Circle Dial for Desktop + Touch Swipe Inertia & Stepper for Mobile
export function RotaryWorkDial() {
  const { motionEnabled, scrollStoreRef } = useExperience();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState<ProjectRecord | null>(null);
  const lastIndexRef = useRef(0);

  // Touch gesture tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const notchSpacingDeg = 20;
  // Dial rotation locks to the active index so every project notch snaps cleanly onto the 0° horizontal pointer
  const lockedDialAngle = -activeIndex * notchSpacingDeg;

  // Map scroll progress [0..1] -> project index [0..7] with a lead-in dwell on 01 and lead-out dwell on 08
  const progressToIndex = useCallback((p: number) => {
    const leadIn = 0.08;
    const leadOut = 0.92;
    if (p <= leadIn) return 0;
    if (p >= leadOut) return PROJECTS.length - 1;
    const norm = (p - leadIn) / (leadOut - leadIn);
    return Math.round(norm * (PROJECTS.length - 1));
  }, []);

  const indexToProgress = useCallback((idx: number) => {
    const leadIn = 0.08;
    const leadOut = 0.92;
    return leadIn + (idx / (PROJECTS.length - 1)) * (leadOut - leadIn);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const snapPoints = PROJECTS.map((_, i) => indexToProgress(i));

    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=4800",
        pin: true,
        scrub: 0.6,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.25, max: 0.55 },
          delay: 0.02,
          ease: "power2.out",
        },
        onEnter: () => {
          // Ensure we start locked on Project 01
          lastIndexRef.current = 0;
          setActiveIndex(0);
          scrollStoreRef.current.activeDialIndex = 0;
          scrollStoreRef.current.activeAccent = PROJECTS[0].accent;
          gsap.to(scrollStoreRef.current, {
            dialDockProgress: 1,
            disperseProgress: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        },
        onLeave: () => {
          // Once 3D structure crosses the dial, disperse into background stars in slow motion
          gsap.to(scrollStoreRef.current, {
            dialDockProgress: 1,
            disperseProgress: 1,
            duration: 1.4,
            ease: "power2.out",
          });
        },
        onEnterBack: () => {
          // Re-converge stars back into solid mechanical structure in slow motion
          gsap.to(scrollStoreRef.current, {
            dialDockProgress: 1,
            disperseProgress: 0,
            duration: 1.4,
            ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(scrollStoreRef.current, {
            dialDockProgress: 0,
            disperseProgress: 0,
            duration: 0.7,
            ease: "power2.inOut",
          });
        },
        onUpdate: (self) => {
          const idx = progressToIndex(self.progress);
          if (idx !== lastIndexRef.current) {
            lastIndexRef.current = idx;
            setActiveIndex(idx);
            scrollStoreRef.current.activeDialIndex = idx;
            scrollStoreRef.current.activeAccent =
              PROJECTS[idx]?.accent || "#9bc1ff";
          }

          // Gradual, cinematic dispersion as scroll finishes project 8 and crosses dial
          if (self.progress > 0.82) {
            const disp = Math.min(1, Math.max(0, (self.progress - 0.82) / 0.18));
            scrollStoreRef.current.disperseProgress = disp;
          } else {
            scrollStoreRef.current.disperseProgress = 0;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [indexToProgress, progressToIndex, scrollStoreRef]);

  const jumpToProject = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(PROJECTS.length - 1, idx));
      lastIndexRef.current = clamped;
      setActiveIndex(clamped);
      scrollStoreRef.current.activeDialIndex = clamped;
      scrollStoreRef.current.activeAccent =
        PROJECTS[clamped]?.accent || "#9bc1ff";

      if (stRef.current) {
        const targetScroll =
          stRef.current.start +
          indexToProgress(clamped) * (stRef.current.end - stRef.current.start);
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    },
    [indexToProgress, scrollStoreRef]
  );

  // Touch Swipe Event Handlers for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStartX.current;
    const dy = endY - touchStartY.current;

    // Detect intentional horizontal swipe (dx > 45px, dx > 1.35 * dy)
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.35) {
      if (dx < 0 && activeIndex < PROJECTS.length - 1) {
        // Swiped Left -> Next
        jumpToProject(activeIndex + 1);
      } else if (dx > 0 && activeIndex > 0) {
        // Swiped Right -> Previous
        jumpToProject(activeIndex - 1);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
  };

  const activeProject = PROJECTS[activeIndex] ?? PROJECTS[0];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative z-10 flex h-screen max-h-screen items-center overflow-hidden border-t border-white/10"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-8">
        {/* Left-Edge Half-Circle Dial (Desktop only, 380x380 circle anchored at left edge) */}
        <div className="relative hidden h-[400px] w-[300px] shrink-0 items-center md:flex">
          <div className="relative -ml-[190px] flex h-[380px] w-[380px] select-none items-center justify-center rounded-full liquid-glass border border-white/20">
            <div className="pointer-events-none absolute inset-7 rounded-full border border-dashed border-white/15" />

            {/* Spring-Snapped Notch Wheel */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${lockedDialAngle}deg)` }}
            >
              {PROJECTS.map((proj, idx) => {
                const deg = idx * notchSpacingDeg;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => jumpToProject(idx)}
                    style={{
                      transform: `rotate(${deg}deg) translateX(190px)`,
                    }}
                    className="group absolute left-1/2 top-1/2 -ml-2.5 -mt-2.5 flex cursor-pointer items-center gap-3 text-left outline-none"
                  >
                    <span
                      className={`block rounded-full transition-all duration-200 ${
                        isActive
                          ? "h-3.5 w-3.5 bg-[#9bc1ff] shadow-[0_0_16px_#9bc1ff]"
                          : "h-2 w-2 bg-white/30 group-hover:bg-white/75"
                      }`}
                    />
                    <span
                      className={`whitespace-nowrap font-mono text-[11px] tracking-wider transition-all duration-200 ${
                        isActive
                          ? "translate-x-1 font-medium text-white"
                          : "text-white/35 group-hover:text-white/70"
                      }`}
                    >
                      {proj.index} {proj.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Horizontal 0° Lock Pointer Indicator */}
            <div className="pointer-events-none absolute right-0 top-1/2 h-[1.5px] w-10 -translate-y-1/2 bg-[#9bc1ff]" />
          </div>
        </div>

        {/* Right Side: Responsive Project Display with Touch Swipe Inertia & Mobile Stepper */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="liquid-glass-card rounded-2xl p-6 sm:p-8 w-full max-w-xl lg:max-w-2xl"
        >
          {/* Header Row: Index + Category + Stepper Controls */}
          <div className="flex items-center justify-between border-b border-white/12 pb-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-light tracking-tighter tabular-nums text-white sm:text-4xl">
                {activeProject.index}
              </span>
              <span className="font-mono text-xs text-white/35">/ 08</span>
              <span
                className="ml-2 font-mono text-xs"
                style={{ color: activeProject.accent }}
              >
                {activeProject.category} · {activeProject.year}
              </span>
            </div>

            {/* Stepper Controls (Both Desktop & Mobile) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => jumpToProject(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#9bc1ff] hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => jumpToProject(activeIndex + 1)}
                disabled={activeIndex === PROJECTS.length - 1}
                aria-label="Next project"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#9bc1ff] hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Visual Pagination Stepper / Progress Track (01 — 08) */}
          <div className="mt-3 flex items-center justify-between gap-1.5 md:hidden">
            {PROJECTS.map((proj, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => jumpToProject(idx)}
                  aria-label={`Go to project ${proj.index}: ${proj.shortTitle}`}
                  className="group relative flex-1 py-1.5 outline-none"
                >
                  <div
                    className="h-1 w-full rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? activeProject.accent
                        : "rgba(255,255,255,0.15)",
                      boxShadow: isActive
                        ? `0 0 10px ${activeProject.accent}`
                        : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Live Motion Graphic Stage */}
          <div className="my-5 rounded-lg border border-white/10 bg-[#08080A]/60 px-4 py-3">
            <ProjectMotionCanvas
              type={activeProject.motionType}
              accent={activeProject.accent}
              motionEnabled={motionEnabled}
            />
          </div>

          <h2 className="text-2xl font-medium tracking-tight text-white sm:text-4xl">
            {activeProject.title}
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9caec5] sm:text-base">
            {activeProject.oneLiner}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-5">
            <div className="flex gap-7">
              {activeProject.metrics.map((m) => (
                <div key={m.label}>
                  <div className="text-[11px] text-white/40">{m.label}</div>
                  <div className="mt-0.5 font-mono text-xs text-white sm:text-sm">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModalProject(activeProject)}
              className="group inline-flex cursor-pointer items-center gap-1.5 border-b border-[#9bc1ff] pb-0.5 text-xs font-medium text-white transition-colors hover:text-[#9bc1ff] sm:text-sm"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#9bc1ff]" />
              <span>Inspect engineering notes</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      <WorkModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </section>
  );
}
