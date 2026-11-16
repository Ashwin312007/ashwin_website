"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Cpu,
  FileText,
  Activity,
  Play,
  Pause,
  CheckCircle2,
  Wrench,
  Zap,
  Compass,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  User,
  Users,
  CameraOff,
  ExternalLink,
  Terminal,
  AlertTriangle,
} from "lucide-react";
import { ProjectRecord } from "@/data/projects";
import { useExperience } from "@/context/ExperienceProvider";

interface WorkModalProps {
  project: ProjectRecord | null;
  onClose: () => void;
}

type TabKey = "overview" | "subsystems" | "validation" | "simulation";

// Interactive 2D Dynamic Physics Simulation Canvas for Modal
function ModalSimulationCanvas({
  type,
  accent,
  motionEnabled,
}: {
  type: ProjectRecord["motionType"];
  accent: string;
  motionEnabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [paramValue, setParamValue] = useState(50); // General parameter scrubber [0..100]

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const render = () => {
      if (motionEnabled && isRunning) {
        t += 0.028 * speedMultiplier;
      }
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Technical blueprint background grid
      ctx.strokeStyle = "rgba(155,193,255,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Coordinate axes
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.moveTo(40, 20);
      ctx.lineTo(40, h - 25);
      ctx.lineTo(w - 20, h - 25);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "10px monospace";
      ctx.fillText("STATE_VECTOR [x, y, θ]", 46, 32);

      const pFactor = paramValue / 50; // [0..2]

      if (type === "peristaltic") {
        // Detailed 3-segment peristaltic locomotion simulation
        const pipeTop = 50;
        const pipeBottom = h - 50;

        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(40, pipeTop);
        ctx.lineTo(w - 30, pipeTop);
        ctx.moveTo(40, pipeBottom);
        ctx.lineTo(w - 30, pipeBottom);
        ctx.stroke();
        ctx.setLineDash([]);

        // Central tendon line
        ctx.strokeStyle = "rgba(52,211,153,0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(50, h / 2);
        ctx.lineTo(w - 50, h / 2);
        ctx.stroke();

        const numSegs = 3;
        for (let i = 0; i < numSegs; i++) {
          const phase = t * 2.4 * pFactor - i * 1.4;
          const radial = Math.sin(phase);
          const segH = 50 + radial * 26 * pFactor;
          const segW = 90 - radial * 22;
          const sx = 100 + i * 155 + Math.cos(phase) * 16;
          const sy = (h - segH) / 2;

          // Segment body with rounded corners
          ctx.strokeStyle = accent;
          ctx.lineWidth = radial > 0.4 ? 2.5 : 1.4;
          ctx.strokeRect(sx, sy, segW, segH);

          // Internal tendon ribs
          for (let r = 1; r < 5; r++) {
            const rx = sx + (segW / 5) * r;
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.beginPath();
            ctx.moveTo(rx, sy + 4);
            ctx.lineTo(rx, sy + segH - 4);
            ctx.stroke();
          }

          // Force contact vectors when anchoring against pipe wall
          if (radial > 0.5) {
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(sx + segW / 2, sy, 4, 0, Math.PI * 2);
            ctx.arc(sx + segW / 2, sy + segH, 4, 0, Math.PI * 2);
            ctx.fill();

            // Contact friction vectors
            ctx.strokeStyle = "#34d399";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(sx + segW / 2, sy);
            ctx.lineTo(sx + segW / 2 - 14, sy);
            ctx.moveTo(sx + segW / 2, sy + segH);
            ctx.lineTo(sx + segW / 2 - 14, sy + segH);
            ctx.stroke();
          }

          // Segment index tag
          ctx.fillStyle = "rgba(255,255,255,0.45)";
          ctx.fillText(`SEG_0${i + 1}`, sx + 6, sy + 14);
        }

        // Live Telemetry Readout
        ctx.fillStyle = "#edf2fa";
        ctx.fillText(`PHASE_OFFSET: ${(1.4 * pFactor).toFixed(2)} rad`, 50, h - 35);
        ctx.fillText(`AXIAL_CONTRACTION: ${(Math.abs(Math.cos(t * 2)) * 32).toFixed(1)}%`, 240, h - 35);
        ctx.fillText(`WALL_FRICTION_µ: ${(0.42 * pFactor).toFixed(2)}`, 450, h - 35);
      } else if (type === "archerfish") {
        // Variable-aperture jet trajectory & droplet fluid dynamics
        const aperture = (12 + Math.sin(t * 2.8) * 8) * pFactor;
        const nozzleX = 70;
        const nozzleY = h / 2 + 20;

        // Nozzle housing
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(25, nozzleY - 35);
        ctx.lineTo(nozzleX, nozzleY - aperture);
        ctx.moveTo(25, nozzleY + 35);
        ctx.lineTo(nozzleX, nozzleY + aperture);
        ctx.stroke();

        // Parabolic fluid stream with droplet breakup
        for (let i = 0; i < 24; i++) {
          const prog = (t * 0.9 * pFactor + i / 24) % 1;
          const px = nozzleX + prog * (w - 140);
          const py = nozzleY - Math.sin(prog * Math.PI) * 75 * pFactor;
          const r = 2 + (1 - prog) * 4;

          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();

          // Droplet velocity tail
          ctx.strokeStyle = "rgba(56,189,248,0.25)";
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - 10 * pFactor, py + 2);
          ctx.stroke();
        }

        // Target marker
        const tx = w - 60;
        const ty = nozzleY;
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(tx, ty, 14, 0, Math.PI * 2);
        ctx.moveTo(tx - 20, ty);
        ctx.lineTo(tx + 20, ty);
        ctx.moveTo(tx, ty - 20);
        ctx.lineTo(tx, ty + 20);
        ctx.stroke();

        ctx.fillStyle = "#edf2fa";
        ctx.fillText(`APERTURE_DIAMETER: ${(aperture * 0.4).toFixed(2)} mm`, 50, h - 35);
        ctx.fillText(`EXIT_VELOCITY: ${(14.2 * pFactor).toFixed(1)} m/s`, 250, h - 35);
        ctx.fillText(`REYNOLDS_RE: ${(2840 * pFactor).toFixed(0)}`, 450, h - 35);
      } else if (type === "ros2-rover" || type === "nasa-rover") {
        // Dual-EKF Covariance Ellipse, Nav2 Trajectory & Rocker-Bogie Kinematics
        const cx = 140;
        const cy = h / 2 - 10;

        // Ground track
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.beginPath();
        for (let x = 40; x < w - 20; x += 6) {
          const gy = cy + 45 + Math.sin(x * 0.02 + t * 1.5) * 6;
          if (x === 40) ctx.moveTo(x, gy);
          else ctx.lineTo(x, gy);
        }
        ctx.stroke();

        // Rover body
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 35, cy - 20, 70, 35);
        ctx.fillStyle = "rgba(155,193,255,0.12)";
        ctx.fillRect(cx - 35, cy - 20, 70, 35);

        // Wheels
        [-30, 0, 30].forEach((wx) => {
          ctx.beginPath();
          ctx.arc(cx + wx, cy + 24, 11, 0, Math.PI * 2);
          ctx.stroke();
        });

        // EKF Uncertainty Covariance Ellipse
        const covRx = (36 + Math.sin(t * 3) * 6) * pFactor;
        const covRy = (20 + Math.cos(t * 3) * 4) * pFactor;
        ctx.strokeStyle = "rgba(52,211,153,0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, covRx, covRy, Math.PI / 8, 0, Math.PI * 2);
        ctx.stroke();

        // Planned Trajectory Spline (Nav2 MPPI)
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 35, cy);
        ctx.bezierCurveTo(cx + 120, cy - 35, cx + 240, cy + 25, w - 50, cy - 10);
        ctx.stroke();

        // Waypoint beacons
        [0.25, 0.5, 0.75, 1.0].forEach((prog) => {
          const bx = cx + 35 + prog * (w - 85 - cx);
          const by = cy - Math.sin(prog * Math.PI) * 20;
          ctx.fillStyle = accent;
          ctx.beginPath();
          ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.fillStyle = "#edf2fa";
        ctx.fillText(`EKF_COVARIANCE_TRACE: ${(0.018 * pFactor).toFixed(4)} m²`, 50, h - 35);
        ctx.fillText(`LOCAL_COSTMAP_OBS: 04 DETECTED`, 280, h - 35);
        ctx.fillText(`MPPI_COST_CONVERGED: YES`, 480, h - 35);
      } else {
        // General state-space / dynamic control waveform
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let x = 40; x < w - 30; x += 3) {
          const norm = (x - 40) / (w - 70);
          const env = Math.exp(-norm * 2.2);
          const py =
            h / 2 - 10 - Math.sin(norm * 16 * pFactor - t * 3) * 55 * env;
          if (x === 40) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();

        // Target setpoint line
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(40, h / 2 - 10);
        ctx.lineTo(w - 30, h / 2 - 10);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#edf2fa";
        ctx.fillText(`FREQUENCY: ${(1.85 * pFactor).toFixed(2)} Hz`, 50, h - 35);
        ctx.fillText(`SETPOINT_ERROR: ${(Math.abs(Math.sin(t * 2)) * 0.08).toFixed(3)}`, 250, h - 35);
        ctx.fillText(`LOOP_CYCLE: 100 Hz (0.01 ms)`, 450, h - 35);
      }

      if (motionEnabled && isRunning) {
        raf = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [type, accent, motionEnabled, isRunning, speedMultiplier, paramValue]);

  return (
    <div className="space-y-4">
      {/* Canvas Frame */}
      <div className="relative overflow-hidden rounded-xl border border-white/12 bg-[#06080c]">
        <canvas
          ref={canvasRef}
          width={720}
          height={260}
          className="h-[210px] w-full sm:h-[260px]"
        />

        {/* Status Badge */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded border border-white/10 bg-[#08080a]/80 px-2.5 py-1 font-mono text-[10px] text-white/70 backdrop-blur-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              isRunning ? "bg-[#34d399] animate-pulse" : "bg-white/40"
            }`}
          />
          <span>{isRunning ? "SIMULATION RUNNING (60 FPS)" : "PAUSED"}</span>
        </div>
      </div>

      {/* Physics Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 font-mono text-xs text-white/80">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-white hover:border-[#9bc1ff] hover:bg-[#9bc1ff]/10 transition-colors"
          >
            {isRunning ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Play</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1 border-l border-white/10 pl-2">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeedMultiplier(s)}
                className={`rounded px-2.5 py-1 text-[10px] transition-colors ${
                  speedMultiplier === s
                    ? "bg-[#9bc1ff]/20 text-[#9bc1ff] font-semibold border border-[#9bc1ff]/30"
                    : "text-white/45 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Parameter Scrubber */}
        <div className="flex items-center gap-2.5">
          <span className="text-white/45 text-[11px]">Drive Parameter:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={paramValue}
            onChange={(e) => setParamValue(Number(e.target.value))}
            className="h-1.5 w-24 cursor-pointer accent-[#9bc1ff] sm:w-36"
            aria-label="Simulation drive parameter slider"
          />
          <span className="w-8 text-right font-mono text-[11px] text-[#9bc1ff]">
            {paramValue}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function WorkModal({ project, onClose }: WorkModalProps) {
  const { setScrollPaused } = useExperience();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [prevProject, setPrevProject] = useState(project);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Reset tab to overview when a new project opens
  if (project !== prevProject) {
    setPrevProject(project);
    setActiveTab("overview");
  }

  // Keyboard accessibility: Escape key, tab trap, focus restore, scroll locking
  useEffect(() => {
    if (!project) {
      setScrollPaused(false);
      document.body.style.overflow = "";
      return;
    }

    setScrollPaused(true);
    document.body.style.overflow = "hidden";
    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

    // Focus the first interactive element or close button
    const timer = setTimeout(() => {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Tab trap inside modal
      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      setScrollPaused(false);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [project, onClose, setScrollPaused]);

  if (!project) return null;

  const primaryMedia = project.media?.[0];
  const hasRealImage =
    Boolean(primaryMedia?.url) && !primaryMedia?.isPlaceholder;

  const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "subsystems", label: "Mechatronic Subsystems", icon: Cpu },
    { id: "validation", label: "Validation & Evidence", icon: ShieldCheck },
    { id: "simulation", label: "Kinematic Simulation", icon: Activity },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="work-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-2xl sm:p-6"
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl liquid-glass text-[#edf2fa] shadow-2xl"
        >
          {/* MODAL HEADER */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="font-mono text-xs tracking-wider font-semibold"
                  style={{ color: project.accent }}
                >
                  {project.index} {"//"} {project.category.toUpperCase()} · {project.year}
                </span>

                {project.patentStatus && (
                  <span className="flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-200">
                    <ShieldAlert className="h-3 w-3 text-amber-400" />
                    <span>Patent Pending · Institutional IPR Disclosed</span>
                  </span>
                )}

                {project.featured && (
                  <span className="flex items-center gap-1 rounded border border-[#9bc1ff]/40 bg-[#9bc1ff]/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#9bc1ff]">
                    <Sparkles className="h-3 w-3" />
                    <span>Featured System</span>
                  </span>
                )}
              </div>

              <h2
                id="modal-project-title"
                className="text-xl font-medium tracking-tight text-white sm:text-2xl lg:text-3xl"
              >
                {project.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study modal"
              className="rounded-full border border-white/15 p-2 text-white/60 transition-colors hover:border-[#9bc1ff] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9bc1ff]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ACCESSIBLE TABLIST */}
          <div
            role="tablist"
            aria-label="Case study sections"
            className="flex overflow-x-auto border-b border-white/10 bg-[#06080c]/80 px-6 sm:px-8 scrollbar-none"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  type="button"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex shrink-0 items-center gap-2 border-b-2 py-3.5 pr-6 font-mono text-xs transition-colors sm:text-sm ${
                    isActive
                      ? "border-[#9bc1ff] text-white font-semibold"
                      : "border-transparent text-white/45 hover:text-white/80"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* MODAL SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div
                role="tabpanel"
                id="tabpanel-overview"
                aria-labelledby="tab-overview"
                className="space-y-6"
              >
                {/* Visual Media Header / Wireframe Blueprint */}
                {hasRealImage && primaryMedia?.url ? (
                  <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/40">
                    <div className="relative aspect-[16/9] w-full max-h-[360px]">
                      <Image
                        src={primaryMedia.url}
                        alt={primaryMedia.caption || `${project.title} physical prototype`}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 1024px) 100vw, 900px"
                        priority
                      />
                    </div>
                    <div className="border-t border-white/10 bg-[#06080c]/90 px-4 py-2.5 font-mono text-[11px] text-white/70">
                      <span className="text-[#9bc1ff] font-medium mr-2">PHYSICAL CAPTURE:</span>
                      {primaryMedia.caption}
                    </div>
                  </div>
                ) : (
                  /* Technical Blueprint Container (NO AI CONCEPT ART) */
                  <div className="relative overflow-hidden rounded-xl border border-white/15 bg-[#06080c] p-6 font-mono">
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(155,193,255,0.2) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(155,193,255,0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: "24px 24px",
                      }}
                      aria-hidden="true"
                    />

                    <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-white/10 pb-3 text-xs text-white/50">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: project.accent }}
                        />
                        <span>SYSTEM BLUEPRINT // {project.motionType.toUpperCase()}</span>
                      </span>
                      <span className="text-[#9bc1ff]">STATUS: BENCH VALIDATED</span>
                    </div>

                    <div className="relative z-10 my-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300">
                        <CameraOff className="h-4 w-4" />
                        <span>HARDWARE CAPTURE NOTICE</span>
                      </div>
                      <p className="mt-2 font-mono text-xs text-white/80 max-w-lg mx-auto">
                        {primaryMedia?.placeholderNote ||
                          "[TODO: Hardware Photograph / Testing Video from Ashwin]"}
                      </p>
                      {primaryMedia?.caption && (
                        <p className="mt-1 text-[11px] text-white/50">
                          {primaryMedia.caption}
                        </p>
                      )}
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/40">
                      <span>LOCATION: CHENNAI, IN (13.08° N, 80.27° E)</span>
                      <span>ASSEMBLY SPECIFICATION REV 2.4</span>
                    </div>
                  </div>
                )}

                {/* Metadata Pills Row */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/40">
                      <User className="h-3 w-3 text-[#9bc1ff]" />
                      <span>Personal Role</span>
                    </div>
                    <div className="mt-1 text-xs text-white font-medium">
                      {project.personalRole}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/40">
                      <Users className="h-3 w-3 text-[#9bc1ff]" />
                      <span>Team Organization</span>
                    </div>
                    <div className="mt-1 text-xs text-white font-medium">
                      {project.teamSize}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/40">
                      <ShieldAlert className="h-3 w-3 text-amber-400" />
                      <span>Intellectual Property</span>
                    </div>
                    <div className="mt-1 text-xs text-amber-200 font-medium">
                      {project.patentStatus || "Open Hardware / Academic Research"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/40">
                      <Compass className="h-3 w-3 text-[#34d399]" />
                      <span>Locomotion Modality</span>
                    </div>
                    <div className="mt-1 text-xs text-[#34d399] font-medium font-mono">
                      {project.motionType}
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="rounded-xl border border-white/10 bg-[#06080c] p-5 space-y-2">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
                    Problem Statement & Scope
                  </h3>
                  <p className="text-sm leading-relaxed text-[#edf2fa]/90">
                    {project.summary}
                  </p>
                </div>

                {/* Key Performance Metrics */}
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-3">
                    Key Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {project.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="font-mono text-[10px] text-white/40">{m.label}</div>
                        <div
                          className="mt-1 font-mono text-base sm:text-lg font-semibold tracking-tight"
                          style={{ color: project.accent }}
                        >
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Architecture Highlights */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                    End-to-End System Architecture
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {project.systemArchitecture.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-[#9caec5]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#9bc1ff] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div>
                  <div className="font-mono text-[11px] text-white/40 mb-2.5">
                    Engineering Toolchain & Protocols
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-white/12 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MECHATRONIC SUBSYSTEMS */}
            {activeTab === "subsystems" && (
              <div
                role="tabpanel"
                id="tabpanel-subsystems"
                aria-labelledby="tab-subsystems"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Subsystem 1: Mechanical Design */}
                  <div className="rounded-xl border border-white/12 bg-[#06080c] p-5 space-y-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                      <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <span>Mechanical Design & Kinematics</span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#9caec5] leading-relaxed">
                      {project.mechanicalDesign.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 select-none">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subsystem 2: Electronics & Power */}
                  <div className="rounded-xl border border-white/12 bg-[#06080c] p-5 space-y-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                      <div className="rounded-md border border-sky-500/30 bg-sky-500/10 p-1.5 text-sky-400">
                        <Zap className="h-4 w-4" />
                      </div>
                      <span>Electronics Hardware & Power</span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#9caec5] leading-relaxed">
                      {project.electronicsHardware.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sky-400 select-none">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subsystem 3: Embedded Software */}
                  <div className="rounded-xl border border-white/12 bg-[#06080c] p-5 space-y-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                      <div className="rounded-md border border-indigo-500/30 bg-indigo-500/10 p-1.5 text-indigo-400">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <span>Embedded Firmware & Middleware</span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#9caec5] leading-relaxed">
                      {project.embeddedSoftware.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-400 select-none">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subsystem 4: Control Algorithms */}
                  <div className="rounded-xl border border-white/12 bg-[#06080c] p-5 space-y-3">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                      <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-1.5 text-amber-400">
                        <Compass className="h-4 w-4" />
                      </div>
                      <span>Control Theory & Estimation</span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#9caec5] leading-relaxed">
                      {project.controlAlgorithms.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 select-none">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Subsystems Specification Table */}
                <div className="rounded-xl border border-white/10 bg-[#06080c] p-5">
                  <div className="font-mono text-xs text-white/50 uppercase tracking-wider mb-3">
                    Subsystems Specification Summary
                  </div>
                  <div className="divide-y divide-white/10 rounded-lg border border-white/10 bg-white/[0.02]">
                    {project.subsystems.map((sub, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-3 text-xs"
                      >
                        <span className="font-mono text-[#9bc1ff] font-medium">
                          {sub.label}
                        </span>
                        <span className="text-white/80">{sub.spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VALIDATION & EVIDENCE */}
            {activeTab === "validation" && (
              <div
                role="tabpanel"
                id="tabpanel-validation"
                aria-labelledby="tab-validation"
                className="space-y-6"
              >
                {/* Simulation vs Physical Reality Breakdown */}
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white/40 mb-3">
                    Simulation vs. Physical Reality
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-5 space-y-2">
                      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-sky-300">
                        <Activity className="h-4 w-4" />
                        <span>Simulation & Numerical Modeling</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#9caec5]">
                        {project.simulationVsPhysical.simulation}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-2">
                      <div className="flex items-center gap-2 font-mono text-xs font-semibold text-emerald-300">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Physical Reality & Empirical Testing</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#9caec5]">
                        {project.simulationVsPhysical.physical}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Empirical Testing & Validation Protocol */}
                <div className="rounded-xl border border-white/10 bg-[#06080c] p-5 space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white/40">
                    Testing Protocol & Measured Validation
                  </h3>
                  <ul className="space-y-2.5 text-xs text-[#9caec5]">
                    {project.testingValidation.map((test, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-[#34d399] shrink-0 mt-0.5" />
                        <span className="leading-relaxed text-[#edf2fa]/90">{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Engineering Challenges & Mitigations */}
                <div className="rounded-xl border border-white/10 bg-[#06080c] p-5 space-y-3">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-amber-300/80">
                    Critical Challenges & Mitigations
                  </h3>
                  <ul className="space-y-2.5 text-xs text-[#9caec5]">
                    {project.challenges.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed text-[#edf2fa]/90">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Repository and Demonstration Links */}
                {(project.repoUrl || project.demoUrl) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-white hover:border-[#9bc1ff] hover:text-[#9bc1ff] transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View Repository / Codebase</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-[#34d399]/40 bg-[#34d399]/10 px-4 py-2 font-mono text-xs text-[#34d399] hover:bg-[#34d399]/20 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Live Demonstration</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: KINEMATIC SIMULATION */}
            {activeTab === "simulation" && (
              <div
                role="tabpanel"
                id="tabpanel-simulation"
                aria-labelledby="tab-simulation"
                className="space-y-6"
              >
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-white/40">
                    Interactive Kinematic & Physics Model
                  </div>
                  <p className="mt-1 text-xs text-[#9caec5]">
                    Real-time HTML5 2D canvas simulation modeling system dynamics, state vectors, and closed-loop control responses.
                  </p>
                </div>

                <ModalSimulationCanvas
                  type={project.motionType}
                  accent={project.accent}
                  motionEnabled={true}
                />

                <div className="rounded-xl border border-white/10 bg-[#06080c] p-4 text-xs text-[#9caec5] leading-relaxed">
                  <div className="font-mono font-medium text-white mb-1">
                    Kinematic Formulation & State Update Dynamics:
                  </div>
                  {project.summary}
                </div>
              </div>
            )}
          </div>

          {/* MODAL FOOTER */}
          <div className="flex items-center justify-between border-t border-white/10 bg-[#06080c] px-6 py-4 sm:px-8 font-mono text-xs text-white/45">
            <span className="hidden sm:inline">
              ESC to close · TAB to cycle controls
            </span>
            <div className="flex items-center gap-3 ml-auto">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/12 px-3 py-1.5 text-xs text-white/70 hover:border-white/30 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>GitHub</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-white/15 px-4 py-1.5 text-xs text-white transition-colors hover:border-[#9bc1ff] hover:text-[#9bc1ff]"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
