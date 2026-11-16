"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Terminal as TerminalIcon,
  Maximize2,
  Minimize2,
  Download,
  Activity,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { useExperience } from "@/context/ExperienceProvider";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { CAPABILITIES } from "@/data/capabilities";

const AVAILABLE_COMMANDS = [
  "help",
  "whoami",
  "projects",
  "skills",
  "telemetry",
  "resume",
  "matrix",
  "contact",
  "clear",
  "exit",
];

// Matrix digital rain canvas component
function MatrixRain({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 640;
      canvas.height = canvas.parentElement?.clientHeight || 360;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars =
      "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜXYZ+-*/=<>";
    const fontSize = 13;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const render = () => {
      ctx.fillStyle = "rgba(9, 13, 20, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head is bright white-green, tail is emerald
        if (Math.random() > 0.88) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = "#34d399";
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Auto-exit after 7.5 seconds
    const timer = setTimeout(() => {
      onExit();
    }, 7500);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, [onExit]);

  return (
    <div className="relative h-64 w-full overflow-hidden rounded border border-[#34d399]/30 bg-[#090d14]">
      <canvas ref={canvasRef} className="h-full w-full block" />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <span className="font-mono text-[10px] text-[#34d399]/70 animate-pulse">
          STREAMING PHOSPHOR MATRIX
        </span>
        <button
          type="button"
          onClick={onExit}
          className="rounded border border-[#34d399]/40 bg-black/60 px-2 py-0.5 font-mono text-[10px] text-[#34d399] hover:bg-[#34d399]/20"
        >
          [Press to Exit]
        </button>
      </div>
    </div>
  );
}

export function CyberTerminal() {
  const { terminalOpen, setTerminalOpen } = useExperience();
  const [input, setInput] = useState("");
  const [, startTransition] = useTransition();
  const [maximized, setMaximized] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  // Command History Navigation state
  const [cmdHistory, setCmdHistory] = useState<string[]>([
    "whoami",
    "projects",
  ]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);
  const [draftInput, setDraftInput] = useState<string>("");

  // Terminal output log
  const [history, setHistory] = useState<
    {
      id: string;
      cmd: string;
      out: string;
      isMatrix?: boolean;
      isError?: boolean;
    }[]
  >([
    {
      id: "init",
      cmd: "system --status",
      out: `ASHWIN T E // CYBERTERMINAL [V0.3-RELEASE]\nKernel: Deterministic ROS 2 Humble · Dual-EKF · State-Space LQR\nType "help" for a list of available commands. Backtick (\`) toggles window.`,
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll on output
  useEffect(() => {
    if (terminalOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, terminalOpen, isMatrixActive]);

  // Focus input on open
  useEffect(() => {
    if (terminalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  }, [terminalOpen]);

  // Telemetry stream generator
  const runTelemetryStream = useCallback(() => {
    const streamId = Math.random().toString(36).substring(7);
    const totalFrames = 8;
    let currentFrame = 0;

    setHistory((prev) => [
      ...prev,
      {
        id: streamId,
        cmd: "telemetry",
        out: `[INITIATING 500Hz DETERMINISTIC SENSOR FUSION TELEMETRY STREAM...]`,
      },
    ]);

    const interval = setInterval(() => {
      currentFrame++;
      const timeMs = currentFrame * 20;
      const pitch = (0.28 + Math.sin(currentFrame * 0.45) * 0.12).toFixed(3);
      const roll = (-0.14 + Math.cos(currentFrame * 0.38) * 0.08).toFixed(3);
      const gyroZ = (Math.sin(currentFrame * 0.8) * 0.006).toFixed(4);
      const nirVolts = (3.142 + (Math.random() * 0.02 - 0.01)).toFixed(3);
      const snr = (42.8 + Math.random() * 0.6).toFixed(1);
      const pTrace = (0.0028 - currentFrame * 0.00015).toFixed(5);
      const lqrU1 = (-1.42 + Math.sin(currentFrame * 0.5) * 0.2).toFixed(2);
      const lqrU2 = (1.18 - Math.cos(currentFrame * 0.5) * 0.18).toFixed(2);
      const pwm = (62.4 + Math.sin(currentFrame * 0.3) * 3.2).toFixed(1);

      const packet = `[FRAME #${String(currentFrame).padStart(2, "0")} | T+${timeMs}ms]
  IMU       : Pitch: ${pitch}° | Roll: ${roll}° | Gyro Z: ${gyroZ} rad/s
  NIR 850nm : ADC: ${nirVolts} V | SNR: ${snr} dB | Transimpedance: 120 kΩ
  DUAL-EKF  : P_trace: ${pTrace} m² | Det(P): 7.9e-8 | Innovation: < 0.001 m
  LQR LOOP  : u = -K·x => [${lqrU1} V, ${lqrU2} V] | PWM: ${pwm}% | Rate: 500 Hz
  STATUS    : NOMINAL [SYS_OK · EKF_LOCKED · LQR_ACTIVE]`;

      setHistory((prev) =>
        prev.map((item) =>
          item.id === streamId
            ? {
                ...item,
                out: `${item.out}\n\n${packet}`,
              }
            : item
        )
      );

      if (currentFrame >= totalFrames) {
        clearInterval(interval);
        setHistory((prev) =>
          prev.map((item) =>
            item.id === streamId
              ? {
                  ...item,
                  out: `${item.out}\n\n[TELEMETRY STREAM FINISHED: 8/8 PACKETS VERIFIED · ZERO RESIDUAL DRIFT]`,
                }
              : item
          )
        );
      }
    }, 180);
  }, []);

  // Resume trigger helper
  const triggerResumeDownload = useCallback(() => {
    try {
      const link = document.createElement("a");
      link.href = PROFILE.resumePath;
      link.download = "Ashwin_TE_Resume.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback
    }
  }, []);

  // Execute terminal command
  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const cmd = trimmed.toLowerCase();
      if (!cmd) return;

      // Update command history
      setCmdHistory((prev) => [...prev.filter((c) => c !== trimmed), trimmed]);
      setHistoryPointer(-1);
      setDraftInput("");

      if (cmd === "clear") {
        setHistory([]);
        setIsMatrixActive(false);
        return;
      }

      if (cmd === "exit") {
        setTerminalOpen(false);
        return;
      }

      if (cmd === "matrix") {
        setIsMatrixActive(true);
        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            cmd: raw,
            out: "[ACTIVATING RETRO DIGITAL PHOSPHOR MATRIX RAIN...]",
            isMatrix: true,
          },
        ]);
        return;
      }

      if (cmd === "telemetry") {
        runTelemetryStream();
        return;
      }

      if (cmd === "resume") {
        triggerResumeDownload();
        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            cmd: raw,
            out: `Initiating download of official resume PDF...\n[OK] Path: ${PROFILE.resumePath}\n[OK] Status: Download triggered.\nIf automatic download is blocked by your browser, open directly:\n>> ${PROFILE.resumePath}`,
          },
        ]);
        return;
      }

      let out = "";
      let isError = false;

      switch (cmd) {
        case "help":
          out = `=============================================================================
CYBERTERMINAL COMMAND MATRIX [V0.3]
=============================================================================
whoami     : Background, VIT Chennai degree, CGPA, research focus
projects   : Catalog of all 8 mechatronics & robotics engineering projects
skills     : Core technical domains (ROS 2, Dual-EKF, CAD/FEA, Embedded)
telemetry  : Live simulated stream of IMU, 850nm NIR, EKF & LQR effort
resume     : Trigger instant download of /Ashwin_TE_Resume.pdf
matrix     : Retro digital phosphor matrix rain visualizer
contact    : Direct communication channels (Email, Status, Socials)
clear      : Clear terminal screen history buffer
exit       : Terminate terminal session (or press Esc / \`)

KEYBOARD SHORTCUTS:
[Tab]      : Auto-complete current command
[↑ / ↓]    : Cycle previous command history
[\` / Esc]  : Toggle or close terminal
=============================================================================`;
          break;

        case "whoami":
          out = `=============================================================================
ASHWIN T E  //  MECHATRONICS & ROBOTICS ENGINEER
=============================================================================
Degree     : ${PROFILE.education.degree}
Institute  : ${PROFILE.education.institution}
Timeline   : ${PROFILE.education.period}
CGPA       : ${PROFILE.education.cgpa}
Status     : ${PROFILE.status}
Location   : ${PROFILE.location}

RESEARCH & TECHNICAL FOCUS:
• Bio-Inspired Robotics & Tendon-Driven Locomotion (Peristaltic Pipe Crawler)
• Deterministic Control & State Estimation (Dual-EKF, State-Space LQR)
• Full-Stack ROS 2 Autonomy (Nav2, MPPI, slam_toolbox, micro-ROS)
• Compliant Mechanism CAD/FEA (TPU 3D Printing, SolidWorks, Fusion 360)

PHILOSOPHY:
[01] POINT : Physical First Principles & Sensor Noise (850nm NIR, IMU, Pressure)
[02] LINE  : Closed-Loop Estimation & Feedback Laws (Dual-EKF, LQR, Phase Wave)
[03] PLANE : Field Machines (NASA HERC 2026 6th Globally, 3-Seg Crawler)
=============================================================================`;
          break;

        case "projects": {
          const rows = PROJECTS.map(
            (p) =>
              `[${p.index}]  ${p.title.padEnd(36)} | ${p.category.padEnd(16)} | ${
                p.year
              } | ${p.metrics.map((m) => `${m.label}: ${m.value}`).join(" · ")}`
          ).join("\n");

          out = `=============================================================================
ENGINEERING PROJECTS CATALOG (TOTAL: ${PROJECTS.length})
=============================================================================
${rows}
=============================================================================
Type "projects" or click on any work module on the page for deep interactive telemetry.`;
          break;
        }

        case "skills": {
          const capText = CAPABILITIES.map(
            (c) =>
              `[${c.index}] ${c.title.toUpperCase()}\n    Subtitle: ${
                c.subtitle
              }\n    Skills  : ${c.skills.join(
                ", "
              )}\n    Applied : ${c.appliedIn.join(" · ")}`
          ).join("\n\n");

          out = `=============================================================================
CORE TECHNICAL DOMAINS & CAPABILITY MATRIX
=============================================================================
${capText}
=============================================================================`;
          break;
        }

        case "contact":
          out = `=============================================================================
COMMUNICATION CHANNELS // ASHWIN T E
=============================================================================
Email     : ${PROFILE.email}
Status    : ${PROFILE.status}
Location  : ${PROFILE.location}
LinkedIn  : ${PROFILE.linkedinUrl}
GitHub    : ${PROFILE.githubUrl}
Portfolio : ${PROFILE.portfolioUrl}
=============================================================================`;
          break;

        default:
          isError = true;
          out = `Command not recognized: "${raw}". Type "help" to view all available commands.`;
          break;
      }

      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          cmd: raw,
          out,
          isError,
        },
      ]);
    },
    [runTelemetryStream, triggerResumeDownload, setTerminalOpen]
  );

  // Tab Auto-Completion
  const handleTabCompletion = useCallback(() => {
    const raw = input.trim().toLowerCase();
    if (!raw) return;

    const matches = AVAILABLE_COMMANDS.filter((cmd) => cmd.startsWith(raw));

    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      // Find longest common prefix
      let prefix = raw;
      let idx = raw.length;
      let continueSearch = true;

      while (continueSearch) {
        const char = matches[0][idx];
        if (!char) break;
        for (let i = 1; i < matches.length; i++) {
          if (matches[i][idx] !== char) {
            continueSearch = false;
            break;
          }
        }
        if (continueSearch) {
          prefix += char;
          idx++;
        }
      }

      setInput(prefix);

      // Show hints in history
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          cmd: input,
          out: `Matching commands: ${matches.join("   ")}`,
        },
      ]);
    }
  }, [input]);

  // Key navigation (Up / Down history, Tab completion)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        handleTabCompletion();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length === 0) return;

        if (historyPointer === -1) {
          setDraftInput(input);
          const targetIdx = cmdHistory.length - 1;
          setHistoryPointer(targetIdx);
          setInput(cmdHistory[targetIdx]);
        } else if (historyPointer > 0) {
          const targetIdx = historyPointer - 1;
          setHistoryPointer(targetIdx);
          setInput(cmdHistory[targetIdx]);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyPointer === -1) return;

        if (historyPointer < cmdHistory.length - 1) {
          const targetIdx = historyPointer + 1;
          setHistoryPointer(targetIdx);
          setInput(cmdHistory[targetIdx]);
        } else {
          setHistoryPointer(-1);
          setInput(draftInput);
        }
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        setTerminalOpen(false);
      }
    },
    [
      cmdHistory,
      historyPointer,
      input,
      draftInput,
      handleTabCompletion,
      setTerminalOpen,
    ]
  );

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          key="cyber-terminal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setTerminalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={{ y: 20, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`flex flex-col overflow-hidden rounded-2xl liquid-glass font-mono text-xs text-white ${
              maximized
                ? "h-[94vh] w-[96vw] max-w-none"
                : "h-[540px] w-full max-w-2xl sm:h-[580px]"
            }`}
          >
            {/* Terminal Header Bar */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5 text-white/60">
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4 w-4 text-[#34d399]" />
                <span className="font-semibold text-white/90">
                  ashwin@vit-robotics
                </span>
                <span className="text-white/30">:</span>
                <span className="text-[#9bc1ff]">~</span>
                <span className="hidden rounded bg-[#34d399]/15 px-1.5 py-0.5 text-[10px] text-[#34d399] sm:inline">
                  ROS 2 ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden font-mono text-[10px] text-white/40 md:inline">
                  [`] or [Esc] to close
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMaximized((prev) => !prev);
                  }}
                  className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                  aria-label={maximized ? "Restore" : "Maximize"}
                >
                  {maximized ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTerminalOpen(false);
                  }}
                  className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                  aria-label="Close terminal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Command Ribbon */}
            <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-white/5 bg-black/40 px-3 py-1.5 scrollbar-none">
              <span className="text-[10px] uppercase text-white/30 mr-1 shrink-0">
                Quick:
              </span>
              {[
                { cmd: "help", icon: Sparkles },
                { cmd: "whoami", icon: Cpu },
                { cmd: "projects", icon: Layers },
                { cmd: "telemetry", icon: Activity },
                { cmd: "resume", icon: Download },
                { cmd: "matrix", icon: TerminalIcon },
                { cmd: "skills", icon: null },
                { cmd: "contact", icon: null },
                { cmd: "clear", icon: null },
              ].map(({ cmd, icon: Icon }) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => {
                    executeCommand(cmd);
                  }}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/70 transition-colors hover:border-[#34d399]/60 hover:bg-[#34d399]/10 hover:text-[#34d399]"
                >
                  {Icon && <Icon className="h-2.5 w-2.5" />}
                  <span>{cmd}</span>
                </button>
              ))}
            </div>

            {/* Terminal Body Scroll Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 leading-relaxed scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {history.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center gap-1.5 font-medium text-[#34d399]">
                    <span className="text-white/40">&gt;</span>
                    <span>{item.cmd}</span>
                  </div>

                  {item.isMatrix && (
                    <div className="my-2">
                      <MatrixRain onExit={() => setIsMatrixActive(false)} />
                    </div>
                  )}

                  <pre
                    className={`whitespace-pre-wrap font-mono text-[11px] leading-relaxed sm:text-xs ${
                      item.isError
                        ? "text-rose-400"
                        : "text-[#cbd5e1] [text-shadow:0_0_1px_rgba(203,213,225,0.4)]"
                    }`}
                  >
                    {item.out}
                  </pre>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Prompt Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeCommand(input);
                startTransition(() => {
                  setInput("");
                });
              }}
              className="flex shrink-0 items-center border-t border-white/10 bg-black/60 px-4 py-3"
            >
              <div className="mr-2 flex items-center gap-1 text-[#34d399]">
                <span>ashwin@vit:~$</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                placeholder="type a command ('help', 'projects', 'telemetry', 'matrix')..."
                className="w-full bg-transparent font-mono text-xs text-white outline-none placeholder:text-white/25"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-[#34d399]" />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
