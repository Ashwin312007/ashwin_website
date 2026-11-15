"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Cpu,
  Layers,
  Activity,
  Play,
  Pause,
  CheckCircle2,
  FileCode2,
} from "lucide-react";
import { ProjectRecord } from "@/data/projects";
import { useExperience } from "@/context/ExperienceProvider";

interface WorkModalProps {
  project: ProjectRecord | null;
  onClose: () => void;
}

type TabKey = "simulation" | "schematic" | "specifications";

// Technical schematic metadata per project
const PROJECT_CAD_ASSETS: Record<
  string,
  {
    imagePath?: string;
    imageCaption?: string;
    diagramTitle: string;
    cadSoftware: string;
    verificationMethod: string;
    tolerance: string;
    bomSummary: string[];
  }
> = {
  "bio-pipe-robot": {
    imagePath: "/projects/earthworm-peristaltic-robot.png",
    imageCaption:
      "Tendon-driven peristaltic pipe crawler CAD assembly. Metameric TPU 95A bellows coupled to rigid structural rings and radial anchoring cams.",
    diagramTitle: "Metameric Tendon Actuation & Anchoring Linkage",
    cadSoftware: "Fusion 360 & SolidWorks",
    verificationMethod: "Gazebo & Webots multi-friction dynamic simulation",
    tolerance: "±0.15 mm FDM TPU 95A / 90A",
    bomSummary: [
      "TPU 95A Metameric Bellows (3x)",
      "Rigid Structural Rings (PLA+/PETG)",
      "High-Torque Coreless Micro-Servo (25kg-cm)",
      "Spectra High-Tensile Tendon Line",
      "ESP32-S3 Dual-Core Controller",
    ],
  },
  "archerfish-ejection": {
    imagePath: "/projects/archerfish-fluid-mechanism.png",
    imageCaption:
      "Variable-aperture fluid ejection nozzle cross-section. Pulsed solenoid manifold coupled to compliant iris aperture for parabolic jet focusing.",
    diagramTitle: "Variable-Aperture Iris & Pulsed Fluidic Manifold",
    cadSoftware: "SolidWorks Parametric Surface Flow",
    verificationMethod: "Hydrodynamic parabolic jet trajectory & high-speed droplet capture",
    tolerance: "±0.08 mm SLA Resin & CNC Aluminum",
    bomSummary: [
      "Compliant Iris Variable-Aperture Nozzle",
      "High-Speed Pulsed 12V Solenoid Valve (8ms response)",
      "Micro-Diaphragm Fluid Booster Pump",
      "Precision Fluidic Pressure Transducer",
      "STM32G4 High-Resolution PWM Timer",
    ],
  },
  "nasa-herc": {
    imagePath: "/images/actuator-concept.webp",
    imageCaption:
      "Precision electromechanical actuator concept & NASA HERC 2026 custom Power Distribution Board (PDB) subsystem.",
    diagramTitle: "Custom High-Current PDB & Rocker-Bogie FEA Distribution",
    cadSoftware: "EasyEDA Pro (PCB) & SolidWorks Simulation (FEA)",
    verificationMethod: "Structural component FEA (3G impact safety factor > 2.4) & 100A bench load test",
    tolerance: "IPC-2221 Class 2 · Aluminum 6061-T6 CNC",
    bomSummary: [
      "Custom 4-Layer 2oz Copper Power Distribution Board",
      "High-Current Solid-State MOSFET Switches (120A continuous)",
      "Galvanically Isolated CAN Bus Transceivers",
      "6061-T6 Aluminum Rocker-Bogie Linkages",
      "Teensy 4.1 Telemetry & Drive Supervisor",
    ],
  },
  "delivery-robot": {
    imagePath: "/images/actuator-concept.webp",
    imageCaption:
      "Autonomous delivery rover drivetrain actuator assembly and ROS 2 dual-EKF sensor layout.",
    diagramTitle: "ROS 2 Dual-EKF & Nav2 Sensor/Compute Architecture",
    cadSoftware: "Fusion 360 & ROS 2 URDF/Xacro",
    verificationMethod: "Hardware-in-the-loop Gazebo simulation & indoor/outdoor SLAM localization",
    tolerance: "Differential-drive kinematic footprint 650x480 mm",
    bomSummary: [
      "NVIDIA Jetson Nano Companion Computer (ROS 2 Humble)",
      "STM32F401 Hardware Bridge Controller (micro-ROS)",
      "360° RPLiDAR A2M8 12m Range",
      "BNO085 9-DOF IMU Sensor Fusion",
      "Optical Quadrature Wheel Encoders (1024 CPR)",
    ],
  },
  "air-puff-tonometer": {
    imagePath: "/images/actuator-concept.webp",
    imageCaption:
      "Micro-pneumatic solenoid actuator assembly and corneal applanation sensor front-end.",
    diagramTitle: "Micro-Pneumatic Pulse Circuit & Optical Applanation Sensor",
    cadSoftware: "Fusion 360 & EasyEDA",
    verificationMethod: "Calibrated micro-manometer pressure profiling & IPR patent disclosure",
    tolerance: "±1.2 mmHg medical pressure calibration",
    bomSummary: [
      "Miniature High-Speed Pneumatic Solenoid Valve",
      "Ultra-Compact DC Micro-Diaphragm Pump",
      "Honeywell High-Precision Differential Pressure Sensor",
      "Infrared Transmitter & Photodiode Corneal Sensor Pair",
      "ARM Cortex-M4 Microcontroller",
    ],
  },
  "agri-sorter": {
    diagramTitle: "850nm NIR Multi-Spectral Illumination & 24-Bit Load Cell System",
    cadSoftware: "SolidWorks & Fusion 360",
    verificationMethod: "YOLO edge inference at 30 FPS + NAU7802 calibrated weight validation",
    tolerance: "±0.5g dynamic sorting resolution",
    bomSummary: [
      "Raspberry Pi 5 Compute Module",
      "Raspberry Pi NoIR Camera Module v2",
      "850nm NIR High-Power LED Illumination Ring",
      "NAU7802 24-Bit ADC Dual-Beam Load Cell",
      "NEMA 17 Stepper Motor & Sorting Diverter Pneumatics",
    ],
  },
  "isro-drone": {
    diagramTitle: "Autonomous UAV Pixhawk 6C & Companion ROS 2 Bridge",
    cadSoftware: "SolidWorks Drone Frame CAD",
    verificationMethod: "QGroundControl telemetry logs & outdoor autonomous waypoint flight test",
    tolerance: "450mm Carbon-Fiber Quadcopter Frame",
    bomSummary: [
      "Pixhawk 6C Autopilot with Dual IMU Redundancy",
      "Raspberry Pi 5 ROS 2 Companion Computer",
      "Holybro M9N High-Precision GPS/Compass",
      "40A BLHeli_32 DShot ESCs & 2216 920KV Brushless Motors",
      "FrSky Telemetry & 5.8GHz FPV Downlink",
    ],
  },
  "line-follower-lqr": {
    diagramTitle: "State-Space Dynamic Model & LQR Optimal Control Architecture",
    cadSoftware: "MATLAB/Simulink State-Space Synthesis",
    verificationMethod: "High-speed 3.2 m/s track benchmarking with hardware-in-loop logging",
    tolerance: "Differential track width 160 mm · Response latency < 2.5 ms",
    bomSummary: [
      "8-Channel High-Speed IR Reflectance Sensor Array",
      "Pololu High-Power Metal Gearmotors (30:1)",
      "Dual TB6612FNG H-Bridge Motor Drivers",
      "STM32F103 (72MHz) ARM Cortex-M3 Controller",
      "High-Discharge 3S LiPo Power Supply",
    ],
  },
};

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
      <div className="relative overflow-hidden rounded-lg border border-white/12 bg-[#06080c]">
        <canvas
          ref={canvasRef}
          width={720}
          height={260}
          className="h-[210px] w-full sm:h-[260px]"
        />

        {/* Status Badge */}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded border border-white/10 bg-[#08080a]/80 px-2 py-1 font-mono text-[10px] text-white/70 backdrop-blur-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              isRunning ? "bg-[#34d399] animate-pulse" : "bg-white/40"
            }`}
          />
          <span>{isRunning ? "SIMULATION RUNNING (60 FPS)" : "PAUSED"}</span>
        </div>
      </div>

      {/* Physics Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-3 font-mono text-xs text-white/80">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white hover:border-[#9bc1ff] hover:bg-[#9bc1ff]/10"
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
                className={`rounded px-2 py-0.5 text-[10px] ${
                  speedMultiplier === s
                    ? "bg-[#9bc1ff]/20 text-[#9bc1ff] font-medium"
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
  const [activeTab, setActiveTab] = useState<TabKey>("simulation");
  const [prevProject, setPrevProject] = useState(project);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descId = useId();

  // Reset tab to simulation when project opens (React render-phase state adjustment)
  if (project !== prevProject) {
    setPrevProject(project);
    setActiveTab("simulation");
  }

  // Accessibility: Focus trap & Escape key handler
  useEffect(() => {
    if (!project) {
      setScrollPaused(false);
      return;
    }

    setScrollPaused(true);
    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;

    // Focus the modal after mounting
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
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocusedElement.current?.focus();
    };
  }, [project, onClose, setScrollPaused]);

  if (!project) return null;

  const cadAsset = PROJECT_CAD_ASSETS[project.id] ?? {
    diagramTitle: "System Architecture & Subsystems",
    cadSoftware: "Fusion 360 & SolidWorks",
    verificationMethod: "Empirical bench testing & numerical simulation",
    tolerance: "Standard precision manufacturing",
    bomSummary: [
      "Custom Microcontroller Supervisor",
      "Precision Actuator Assembly",
      "Sensor Signal Conditioning Interface",
      "Regulated Low-Noise Power Supply",
    ],
  };

  return (
    <AnimatePresence>
      <motion.div
        key="work-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
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
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl liquid-glass text-[#edf2fa]"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
            <div>
              <div
                className="font-mono text-xs tracking-wider"
                style={{ color: project.accent }}
              >
                {project.index} {"//"} {project.category.toUpperCase()} · {project.year}
              </div>
              <h2
                id={titleId}
                className="mt-1.5 text-xl font-medium tracking-tight text-white sm:text-3xl"
              >
                {project.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-full border border-white/15 p-2 text-white/60 transition-colors hover:border-[#9bc1ff] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#9bc1ff]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Tabs (Tablist) */}
          <div
            role="tablist"
            aria-label="Engineering notes view modes"
            className="flex border-b border-white/10 bg-[#06080c]/80 px-6 sm:px-8"
          >
            {[
              {
                id: "simulation" as TabKey,
                label: "Live Simulation",
                icon: Activity,
              },
              {
                id: "schematic" as TabKey,
                label: "Technical CAD / Schematic",
                icon: Layers,
              },
              {
                id: "specifications" as TabKey,
                label: "System Specifications",
                icon: Cpu,
              },
            ].map((tab) => {
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 border-b-2 py-3.5 pr-6 font-mono text-xs transition-colors sm:text-sm ${
                    isActive
                      ? "border-[#9bc1ff] text-white"
                      : "border-transparent text-white/45 hover:text-white/80"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <p id={descId} className="sr-only">
              {project.oneLiner}
            </p>

            {/* TAB 1: LIVE SIMULATION CANVAS */}
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
                  <p className="mt-1 text-sm text-[#9caec5]">
                    Dynamic real-time simulation executing in an HTML5 2D canvas with variable drive parameters and telemetry readouts.
                  </p>
                </div>

                <ModalSimulationCanvas
                  type={project.motionType}
                  accent={project.accent}
                  motionEnabled={true}
                />

                <div className="rounded-lg border border-white/10 bg-[#06080c] p-4 text-xs text-[#9caec5] leading-relaxed">
                  <div className="font-mono font-medium text-white mb-1">
                    Kinematic Formulation & Control Loop Note:
                  </div>
                  {project.summary}
                </div>
              </div>
            )}

            {/* TAB 2: TECHNICAL SCHEMATIC / CAD DIAGRAM */}
            {activeTab === "schematic" && (
              <div
                role="tabpanel"
                id="tabpanel-schematic"
                aria-labelledby="tab-schematic"
                className="space-y-6"
              >
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-white/40">
                    Mechanical Assembly & Blueprint Schematics
                  </div>
                  <h3 className="mt-1 text-lg font-medium text-white">
                    {cadAsset.diagramTitle}
                  </h3>
                </div>

                {/* Embedded CAD Image if available */}
                {cadAsset.imagePath ? (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/40">
                      <div className="relative aspect-[16/10] w-full max-h-[380px]">
                        <Image
                          src={cadAsset.imagePath}
                          alt={`${project.title} CAD Schematic`}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 100vw, 800px"
                          priority
                        />
                      </div>
                      <div className="border-t border-white/10 bg-[#06080c]/90 px-4 py-2.5 font-mono text-[11px] text-white/60">
                        <span className="text-[#9bc1ff] font-medium mr-2">CAD NOTE:</span>
                        {cadAsset.imageCaption || cadAsset.diagramTitle}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* High-Fidelity Technical Blueprint Graphic for projects without photo asset */
                  <div className="rounded-xl border border-white/15 bg-[#06080c] p-6 font-mono">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs text-white/50">
                      <span>REV 2.4 // SCHEMATIC LAYOUT</span>
                      <span className="text-[#9bc1ff]">{cadAsset.cadSoftware}</span>
                    </div>

                    <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded border border-dashed border-white/15 p-4">
                        <div className="text-[11px] text-[#34d399] uppercase">Primary Controller & Buses</div>
                        <div className="mt-2 text-xs text-white leading-relaxed">
                          UART / I2C / CAN-bus deterministic timing. High-frequency DMA transfers for real-time sensor polling.
                        </div>
                      </div>

                      <div className="rounded border border-dashed border-white/15 p-4">
                        <div className="text-[11px] text-[#9bc1ff] uppercase">Actuator Stage & Driver</div>
                        <div className="mt-2 text-xs text-white leading-relaxed">
                          Isolated MOSFET/H-Bridge driver rails with transient flyback diode clamping and thermal ground pours.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CAD & Manufacturing Specifications Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
                    <div className="font-mono text-[10px] uppercase text-white/40">CAD Toolchain</div>
                    <div className="mt-1 font-mono text-xs text-white font-medium">{cadAsset.cadSoftware}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
                    <div className="font-mono text-[10px] uppercase text-white/40">Manufacturing Tolerances</div>
                    <div className="mt-1 font-mono text-xs text-white font-medium">{cadAsset.tolerance}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
                    <div className="font-mono text-[10px] uppercase text-white/40">Verification Protocol</div>
                    <div className="mt-1 font-mono text-xs text-[#34d399] font-medium">{cadAsset.verificationMethod}</div>
                  </div>
                </div>

                {/* Bill of Materials (BOM) summary */}
                <div className="rounded-lg border border-white/10 bg-[#06080c] p-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-white font-medium mb-3">
                    <FileCode2 className="h-4 w-4 text-[#9bc1ff]" />
                    <span>Key Bill of Materials (BOM) Subcomponents</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {cadAsset.bomSummary.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#9caec5]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#9bc1ff] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SYSTEM ARCHITECTURE & SPECIFICATIONS */}
            {activeTab === "specifications" && (
              <div
                role="tabpanel"
                id="tabpanel-specifications"
                aria-labelledby="tab-specifications"
                className="space-y-8"
              >
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-white/40">
                    Engineering Architecture
                  </div>
                  <h3 className="mt-1 text-lg font-medium text-white">
                    System Architecture & Engineering Decisions
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-white/45">
                      Architecture & Constraints
                    </h4>
                    <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#9caec5]">
                      {project.architecture.map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#9bc1ff] select-none">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-white/45">
                      Subsystems Breakdown
                    </h4>
                    <div className="mt-3 divide-y divide-white/10 rounded-lg border border-white/10 bg-[#06080c] px-4">
                      {project.subsystems.map((s) => (
                        <div
                          key={s.label}
                          className="flex justify-between gap-4 py-2.5 text-xs sm:text-sm"
                        >
                          <span className="font-mono text-white/45">{s.label}</span>
                          <span className="text-right text-white font-medium">{s.spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Performance Metrics */}
                <div className="border-t border-white/10 pt-6">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-white/45 mb-4">
                    Key Performance Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {project.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-lg border border-white/10 bg-white/5 p-4 text-center sm:text-left"
                      >
                        <div className="font-mono text-[11px] text-white/40">{m.label}</div>
                        <div
                          className="mt-1 font-mono text-lg sm:text-2xl font-light tracking-tight"
                          style={{ color: project.accent }}
                        >
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div className="border-t border-white/10 pt-6">
                  <div className="font-mono text-xs text-white/40 mb-3">Toolchain & Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/12 bg-white/5 px-3 py-1 font-mono text-xs text-white/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-white/10 bg-[#06080c] px-6 py-4 sm:px-8 font-mono text-xs text-white/45">
            <span className="hidden sm:inline">
              ESC to close · TAB to cycle elements
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-white/15 px-4 py-1.5 text-white transition-colors hover:border-[#9bc1ff] hover:text-[#9bc1ff]"
              >
                Close Specification
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
