"use client";

import React, { useState } from "react";
import { Gauge, Cpu, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { useExperience } from "@/context/ExperienceProvider";

interface WorkflowDetail {
  number: string;
  stageName: string;
  focusTitle: string;
  summary: string;
  engineeringDeliverables: string[];
  verificationMetric: string;
  icon: React.ReactNode;
}

const WORKFLOW_STEPS: WorkflowDetail[] = [
  {
    number: "01",
    stageName: "POINT",
    focusTitle: "First Principles & Physical Transduction",
    summary:
      "Every robotic system originates at the physical sensor interface. Before implementing firmware, I characterize sensor noise, non-linear hyperelastic compliance (Shore 90A/95A TPU), and motor torque-speed saturation curves.",
    engineeringDeliverables: [
      "850nm NIR reflectance & 24-bit ADC noise characterization",
      "Micro-pneumatic rapid solenoid pressure-pulse calibration",
      "Actuator torque limits, gear reduction & compliance profiling",
    ],
    verificationMetric: "0.02 ms sample jitter · IIR/FIR pre-filtering",
    icon: <Gauge className="h-5 w-5 text-[#38bdf8]" />,
  },
  {
    number: "02",
    stageName: "LINE",
    focusTitle: "Deterministic Estimation & Control Laws",
    summary:
      "Raw telemetry is synthesized into deterministic feedback. I derive state-space dynamic models, solve continuous/discrete Riccati equations for optimal LQR control, configure dual-EKF state estimators in ROS 2, and schedule FreeRTOS tasks.",
    engineeringDeliverables: [
      "Dual-EKF fusion with robot_localization (odom + map)",
      "State-space LQR feedback gain matrix [K] derivation",
      "Tendon phase-locked wave sequencing across TPU segments",
    ],
    verificationMetric: "1.0 kHz deterministic control loop · Zero drift covariance",
    icon: <Cpu className="h-5 w-5 text-[#a78bfa]" />,
  },
  {
    number: "03",
    stageName: "PLANE",
    focusTitle: "Hardware-in-the-Loop & Physical Validation",
    summary:
      "Simulated control architectures are translated to physical hardware through custom high-current PDB layout in EasyEDA Pro, structural FEA stress validation in Fusion 360, DFM machining fixtures, and rugged field trials.",
    engineeringDeliverables: [
      "Custom high-current PDB isolating avionics from motor back-EMF",
      "Structural FEA on chassis load paths & suspension arms",
      "Full-scale terrain obstacle course runs & stall current monitoring",
    ],
    verificationMetric: "6th Globally · NASA HERC 2026 (7:02 Fastest Run)",
    icon: <Award className="h-5 w-5 text-[#34d399]" />,
  },
];

export function HowIWork() {
  const { scrollStoreRef } = useExperience();
  const [activeStep, setActiveStep] = useState(0);

  const handleSelectStep = (idx: number) => {
    setActiveStep(idx);
    if (scrollStoreRef.current) {
      scrollStoreRef.current.narrativeMorph = idx * 0.5;
    }
  };

  return (
    <section id="workflow" className="relative z-10 border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 rounded-2xl border border-white/10 bg-[#080d1a]/80 p-6 backdrop-blur-md">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-[#9bc1ff]">
              Engineering Methodology // First Principles to Field Hardware
            </div>
            <h2 className="mt-1 text-3xl font-medium tracking-tight text-white sm:text-5xl">
              How I Engineer
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-white/50">
            <span>Phase 0{activeStep + 1}</span>
            <span>/</span>
            <span>03</span>
          </div>
        </div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = idx === activeStep;

            return (
              <div
                key={step.number}
                onMouseEnter={() => handleSelectStep(idx)}
                onClick={() => handleSelectStep(idx)}
                className={`liquid-glass-frame rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border-[#38bdf8]/60 shadow-[0_8px_32px_rgba(56,189,248,0.22)] bg-white/[0.04]"
                    : "border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                }`}
              >
                <div>
                  {/* Top Bar: Number & Stage Badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                        {step.icon}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                          Phase {step.number}
                        </span>
                        <div className="font-mono text-xs font-semibold text-[#9bc1ff]">
                          {step.stageName}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`h-2 w-2 rounded-full transition-all ${
                        isActive
                          ? "bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"
                          : "bg-white/20"
                      }`}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-xl font-medium text-white tracking-tight">
                    {step.focusTitle}
                  </h3>

                  <p className="mt-3 text-sm text-[#9caec5] leading-relaxed">
                    {step.summary}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      Core Implementation Focus
                    </div>
                    {step.engineeringDeliverables.map((item, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-start gap-2 text-xs text-[#c6d7eb]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#34d399] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Validation Metric */}
                <div className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">
                    Physical Metric / Benchmark
                  </div>
                  <div className="font-mono text-xs font-medium text-[#34d399] flex items-center justify-between">
                    <span>{step.verificationMetric}</span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        isActive ? "translate-x-1 text-[#38bdf8]" : "text-white/20"
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}