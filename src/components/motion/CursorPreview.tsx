"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useExperience } from "@/context/ExperienceProvider";
import { CapabilityRecord } from "@/data/capabilities";

function CapabilityGlyph({ type }: { type: CapabilityRecord["glyphType"] }) {
  switch (type) {
    case "ros2":
      return (
        <svg viewBox="0 0 220 88" className="h-20 w-full" fill="none">
          {/* Node 1: Publisher */}
          <circle cx="36" cy="44" r="18" stroke="#9bc1ff" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="36" cy="44" r="4" fill="#9bc1ff" />
          <text x="36" y="74" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">/odom</text>

          {/* Connection Topic Arrow 1 */}
          <path d="M 54 44 L 92 44" stroke="#9bc1ff" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <polygon points="92,41 98,44 92,47" fill="#9bc1ff" />

          {/* Node 2: Central Nav2 / EKF */}
          <circle cx="116" cy="44" r="18" stroke="#34d399" strokeWidth="1.8" fill="rgba(52,211,153,0.12)" />
          <circle cx="116" cy="44" r="5" fill="#34d399" />
          <text x="116" y="74" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">/nav2</text>

          {/* Connection Topic Arrow 2 */}
          <path d="M 134 44 L 172 44" stroke="#9bc1ff" strokeWidth="1.5" />
          <polygon points="172,41 178,44 172,47" fill="#9bc1ff" />

          {/* Node 3: Actuator /diffbot */}
          <circle cx="194" cy="44" r="16" stroke="#9bc1ff" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="194" cy="44" r="3" fill="#9bc1ff" />
          <text x="194" y="74" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">/cmd_vel</text>
        </svg>
      );
    case "ekf":
      return (
        <svg viewBox="0 0 220 88" className="h-20 w-full" fill="none">
          {/* Prior Covariance Ellipse */}
          <ellipse
            cx="110"
            cy="44"
            rx="72"
            ry="28"
            stroke="rgba(155,193,255,0.35)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          {/* Posterior Covariance Ellipse (Fused) */}
          <ellipse
            cx="110"
            cy="44"
            rx="36"
            ry="15"
            fill="rgba(52,211,153,0.15)"
            stroke="#34d399"
            strokeWidth="1.8"
          />
          {/* State vector point */}
          <circle cx="110" cy="44" r="4.5" fill="#34d399" />

          {/* Innovation Vector Arrow */}
          <line x1="72" y1="28" x2="108" y2="43" stroke="#9bc1ff" strokeWidth="1.5" />
          <polygon points="106,39 112,44 104,45" fill="#9bc1ff" />

          <text x="110" y="76" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" textAnchor="middle">
            COVARIANCE TRACE P(+|+)
          </text>
        </svg>
      );
    case "cad":
      return (
        <svg viewBox="0 0 220 88" className="h-20 w-full" fill="none">
          {/* Isometric Extruded Block */}
          {/* Top face */}
          <polygon
            points="110,14 165,32 110,50 55,32"
            fill="rgba(155,193,255,0.14)"
            stroke="#9bc1ff"
            strokeWidth="1.5"
          />
          {/* Left face */}
          <polygon
            points="55,32 110,50 110,72 55,54"
            fill="rgba(155,193,255,0.06)"
            stroke="#9bc1ff"
            strokeWidth="1.5"
          />
          {/* Right face */}
          <polygon
            points="165,32 110,50 110,72 165,54"
            fill="rgba(155,193,255,0.1)"
            stroke="#9bc1ff"
            strokeWidth="1.5"
          />
          {/* Center bore hole */}
          <ellipse cx="110" cy="32" rx="14" ry="7" stroke="#34d399" strokeWidth="1.4" />

          {/* Caliper Dimension lines */}
          <line x1="42" y1="32" x2="42" y2="54" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="38" y1="32" x2="46" y2="32" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="38" y1="54" x2="46" y2="54" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <text x="32" y="46" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="end">22mm</text>
        </svg>
      );
    case "embedded":
      return (
        <svg viewBox="0 0 220 88" className="h-20 w-full" fill="none">
          {/* Microcontroller IC Package */}
          <rect
            x="75"
            y="22"
            width="70"
            height="44"
            rx="4"
            fill="rgba(155,193,255,0.12)"
            stroke="#9bc1ff"
            strokeWidth="1.6"
          />
          <circle cx="86" cy="32" r="2.5" fill="#34d399" />
          <text x="110" y="47" fill="#edf2fa" fontSize="8" fontFamily="monospace" textAnchor="middle">
            STM32 / ESP32
          </text>

          {/* Left Pins */}
          {[28, 38, 48, 58].map((py) => (
            <line key={`lp-${py}`} x1="58" y1={py} x2="75" y2={py} stroke="#9bc1ff" strokeWidth="1.4" />
          ))}
          {/* Right Pins */}
          {[28, 38, 48, 58].map((py) => (
            <line key={`rp-${py}`} x1="145" y1={py} x2="162" y2={py} stroke="#9bc1ff" strokeWidth="1.4" />
          ))}

          {/* Logic analyzer clock pulses on bottom */}
          <path
            d="M 20 78 L 35 78 L 35 68 L 50 68 L 50 78 L 65 78 L 65 68 L 80 68 L 80 78"
            stroke="#34d399"
            strokeWidth="1.2"
          />
          <text x="20" y="65" fill="#34d399" fontSize="7" fontFamily="monospace">CLK</text>
        </svg>
      );
    case "vision":
      return (
        <svg viewBox="0 0 220 88" className="h-20 w-full" fill="none">
          {/* Reticle / Lens circle */}
          <circle cx="110" cy="44" r="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 3" />
          <line x1="110" y1="6" x2="110" y2="82" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="72" y1="44" x2="148" y2="44" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {/* Bounding Box Detector */}
          <rect x="88" y="24" width="46" height="38" stroke="#34d399" strokeWidth="1.5" fill="rgba(52,211,153,0.1)" />
          <rect x="88" y="16" width="38" height="8" fill="#34d399" />
          <text x="91" y="22" fill="#08080a" fontSize="6" fontFamily="monospace" fontWeight="bold">NIR: 0.98</text>

          {/* Spectral Reflectance Wave */}
          <path
            d="M 16 68 Q 30 68 38 48 T 60 72 T 80 68"
            stroke="#9bc1ff"
            strokeWidth="1.4"
          />
          <text x="16" y="80" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace">850nm λ</text>
        </svg>
      );
    case "electronics":
      return (
        <svg viewBox="0 0 220 88" className="h-20 w-full" fill="none">
          {/* Op-Amp / Circuit schematic */}
          <polygon
            points="70,22 135,44 70,66"
            stroke="#9bc1ff"
            strokeWidth="1.8"
            fill="rgba(155,193,255,0.1)"
          />
          <text x="76" y="36" fill="#edf2fa" fontSize="9" fontFamily="monospace">-</text>
          <text x="76" y="58" fill="#edf2fa" fontSize="9" fontFamily="monospace">+</text>

          {/* Inverting & Non-inverting lines */}
          <line x1="35" y1="32" x2="70" y2="32" stroke="#9bc1ff" strokeWidth="1.4" />
          <line x1="35" y1="54" x2="70" y2="54" stroke="#9bc1ff" strokeWidth="1.4" />

          {/* Output Line */}
          <line x1="135" y1="44" x2="175" y2="44" stroke="#34d399" strokeWidth="1.6" />
          <circle cx="175" cy="44" r="3" fill="#34d399" />

          {/* Feedback loop resistor */}
          <path
            d="M 150 44 L 150 14 L 125 14 L 120 8 L 110 20 L 100 8 L 95 14 L 55 14 L 55 32"
            stroke="#9bc1ff"
            strokeWidth="1.2"
          />
          <text x="110" y="30" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="monospace" textAnchor="middle">
            Rf 10kΩ
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 220 88" className="h-20 w-full" fill="none">
          <polyline
            points="15,55 45,55 45,22 85,22 85,55 125,55 125,22 165,22 165,55 205,55"
            stroke="#9bc1ff"
            strokeWidth="1.6"
          />
        </svg>
      );
  }
}

export function CursorPreview() {
  const { motionEnabled, hoveredCapability } = useExperience();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 320, damping: 30 });
  const y = useSpring(rawY, { stiffness: 320, damping: 30 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX + 24);
      rawY.set(e.clientY - 96);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  if (!motionEnabled || !hoveredCapability) return null;

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="pointer-events-none fixed left-0 top-0 z-30 hidden w-64 rounded-xl border border-white/20 bg-[#090d14]/95 p-4 shadow-[0_0_30px_rgba(0,0,0,0.85)] backdrop-blur-md lg:block"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#9bc1ff]">
          GLYPH // {hoveredCapability.glyphType.toUpperCase()}
        </span>
        <span className="font-mono text-[10px] text-white/40">
          {hoveredCapability.index} / 06
        </span>
      </div>

      <div className="my-2">
        <CapabilityGlyph type={hoveredCapability.glyphType} />
      </div>

      <div className="border-t border-white/10 pt-2 font-mono text-[11px] text-[#9caec5] leading-snug">
        <span className="text-white/40 block text-[9px] uppercase tracking-wider mb-0.5">Applied in</span>
        {hoveredCapability.appliedIn.join(" · ")}
      </div>
    </motion.div>
  );
}
