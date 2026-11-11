"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, Zap, Gauge, Waves, Activity, Sparkles } from "lucide-react";

interface BiomimicrySimProps {
  initialMode?: "peristalsis" | "archerfish";
  showModeToggle?: boolean;
}

export function BiomimicrySim({ initialMode = "peristalsis", showModeToggle = true }: BiomimicrySimProps) {
  const [mode, setMode] = useState<"peristalsis" | "archerfish">(initialMode);

  // Peristalsis Sim States
  const [frequency, setFrequency] = useState(1.5); // Hz (0.5 - 3.0)
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1); // 1: forward, -1: reverse
  const [peristalsisTelemetry, setPeristalsisTelemetry] = useState({
    activeAnchor: "Segment 2",
    propulsionStroke: "+12.4 mm/s",
    netVelocity: "8.6 mm/s",
    phaseGait: "Retrograde Metameric"
  });

  // Archerfish Sim States
  const [orificeSpeed, setOrificeSpeed] = useState(14); // ms constriction speed (5 - 30)
  const [pulsePressure, setPulsePressure] = useState(2.8); // Bar (1.0 - 4.5)
  const [isFiring, setIsFiring] = useState(false);
  const [archerfishTelemetry, setArcherfishTelemetry] = useState({
    exitVelocity: "18.2 m/s",
    coalescenceDist: "38.5 cm",
    momentum: "1.92 mJ",
    concentration: "94%"
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Peristalsis Sim Loop
  useEffect(() => {
    if (mode !== "peristalsis") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let pipeOffset = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw Pipe / Conduit
      const pipeYTop = height * 0.22;
      const pipeYBottom = height * 0.78;
      const pipeH = pipeYBottom - pipeYTop;

      // Pipe background glass
      const pipeGrad = ctx.createLinearGradient(0, pipeYTop, 0, pipeYBottom);
      pipeGrad.addColorStop(0, "rgba(20, 35, 55, 0.45)");
      pipeGrad.addColorStop(0.5, "rgba(10, 20, 32, 0.25)");
      pipeGrad.addColorStop(1, "rgba(20, 35, 55, 0.45)");
      ctx.fillStyle = pipeGrad;
      ctx.fillRect(0, pipeYTop, width, pipeH);

      // Pipe conduit walls with spatial glow
      ctx.strokeStyle = "rgba(147, 197, 253, 0.35)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, pipeYTop);
      ctx.lineTo(width, pipeYTop);
      ctx.moveTo(0, pipeYBottom);
      ctx.lineTo(width, pipeYBottom);
      ctx.stroke();

      // Moving pipe grid / graduation ticks (relative motion)
      if (isPlaying) {
        pipeOffset = (pipeOffset - direction * frequency * 1.8) % 32;
      }
      ctx.strokeStyle = "rgba(147, 197, 253, 0.12)";
      ctx.lineWidth = 1;
      for (let x = pipeOffset - 32; x < width + 32; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, pipeYTop);
        ctx.lineTo(x, pipeYTop + 8);
        ctx.moveTo(x, pipeYBottom - 8);
        ctx.lineTo(x, pipeYBottom);
        ctx.stroke();
      }

      // Robot Segments (4 metameric segments)
      const numSegments = 4;
      const centerX = width * 0.5;
      const centerY = (pipeYTop + pipeYBottom) / 2;
      const maxRadius = pipeH * 0.48; // touches pipe wall
      const minRadius = pipeH * 0.28;

      const segmentLengths: number[] = [];
      const segmentRadii: number[] = [];
      const segmentPhases: number[] = [];

      let dominantAnchor = -1;
      let maxRadialRatio = 0;

      for (let i = 0; i < numSegments; i++) {
        // Phase shift between segments
        const phase = t * frequency * 2 * Math.PI * direction - i * (Math.PI / 2);
        segmentPhases.push(phase);

        // Radial expansion: when expanded, it anchors against pipe wall
        // Normalized expansion: 0 (contracted) to 1 (anchored against wall)
        const expansion = (Math.sin(phase) + 1) / 2; // 0 to 1
        const currentRadius = minRadius + (maxRadius - minRadius) * expansion;
        segmentRadii.push(currentRadius);

        // Constant volume conservation: axial length shrinks as radius grows
        const baseLen = 52;
        const currentLen = baseLen - (currentRadius - minRadius) * 0.65;
        segmentLengths.push(currentLen);

        if (expansion > maxRadialRatio) {
          maxRadialRatio = expansion;
          dominantAnchor = i + 1;
        }
      }

      const totalRobotLength = segmentLengths.reduce((a, b) => a + b, 0);
      let curX = centerX - totalRobotLength / 2;

      // Draw compliant bellows and segments
      for (let i = 0; i < numSegments; i++) {
        const segLen = segmentLengths[i];
        const segRad = segmentRadii[i];
        const segPhase = segmentPhases[i];
        const isAnchored = (Math.sin(segPhase) + 1) / 2 > 0.72;

        const segGrad = ctx.createLinearGradient(curX, centerY - segRad, curX + segLen, centerY + segRad);
        if (isAnchored) {
          segGrad.addColorStop(0, "rgba(52, 211, 153, 0.85)"); // Emerald anchor
          segGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.95)");
          segGrad.addColorStop(1, "rgba(5, 150, 105, 0.85)");
        } else {
          segGrad.addColorStop(0, "rgba(96, 165, 250, 0.75)"); // Electric cyan/sapphire stroke
          segGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.85)");
          segGrad.addColorStop(1, "rgba(37, 99, 235, 0.75)");
        }

        // Draw Segment Bellow Body with 3 folds
        ctx.fillStyle = segGrad;
        ctx.beginPath();
        const folds = 4;
        const foldStep = segLen / folds;

        ctx.moveTo(curX, centerY - segRad * 0.75);
        for (let f = 0; f < folds; f++) {
          const fx = curX + f * foldStep;
          const peakY = centerY - (f % 2 === 0 ? segRad : segRad * 0.75);
          ctx.lineTo(fx + foldStep * 0.5, peakY);
          ctx.lineTo(fx + foldStep, centerY - segRad * 0.75);
        }

        // Right cap
        ctx.lineTo(curX + segLen, centerY + segRad * 0.75);

        // Bottom bellow folds
        for (let f = folds - 1; f >= 0; f--) {
          const fx = curX + f * foldStep;
          const peakY = centerY + (f % 2 === 0 ? segRad : segRad * 0.75);
          ctx.lineTo(fx + foldStep * 0.5, peakY);
          ctx.lineTo(fx, centerY + segRad * 0.75);
        }
        ctx.closePath();
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isAnchored ? "rgba(167, 243, 208, 0.9)" : "rgba(191, 219, 254, 0.9)";
        ctx.stroke();

        // Directional Micro-Setae (asymmetric traction bristles)
        if (isAnchored) {
          ctx.strokeStyle = "#34d399";
          ctx.lineWidth = 2;
          const bristleCount = 5;
          const slant = direction > 0 ? -6 : 6;

          for (let b = 1; b <= bristleCount; b++) {
            const bx = curX + (segLen * b) / (bristleCount + 1);
            // Top bristles
            ctx.beginPath();
            ctx.moveTo(bx, centerY - segRad);
            ctx.lineTo(bx + slant, pipeYTop);
            ctx.stroke();

            // Bottom bristles
            ctx.beginPath();
            ctx.moveTo(bx, centerY + segRad);
            ctx.lineTo(bx + slant, pipeYBottom);
            ctx.stroke();
          }

          // Anchor glow aura
          ctx.fillStyle = "rgba(52, 211, 153, 0.15)";
          ctx.beginPath();
          ctx.arc(curX + segLen / 2, centerY, segRad * 1.15, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Inter-segment coupler ring
        if (i < numSegments - 1) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
          ctx.fillRect(curX + segLen - 2, centerY - minRadius * 0.6, 4, minRadius * 1.2);
        }

        // Segment label
        ctx.fillStyle = isAnchored ? "#a7f3d0" : "#dbeafe";
        ctx.font = "10px var(--font-jetbrains-mono, monospace)";
        ctx.textAlign = "center";
        ctx.fillText(`S${i + 1}`, curX + segLen / 2, centerY + 3);

        curX += segLen + 2;
      }

      // Draw Pipe annotations
      ctx.fillStyle = "rgba(147, 197, 253, 0.7)";
      ctx.font = "11px var(--font-jetbrains-mono, monospace)";
      ctx.textAlign = "left";
      ctx.fillText("CONDUIT BORE: Ø 85 mm", 16, pipeYTop - 10);
      ctx.textAlign = "right";
      ctx.fillText(direction > 0 ? "DIRECTION: ➔ FORWARD" : "DIRECTION: ⬅ REVERSE", width - 16, pipeYTop - 10);

      if (isPlaying) {
        t += 0.016;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Update Telemetry interval
    const telemetryTimer = setInterval(() => {
      const netV = (frequency * 5.8 * (direction > 0 ? 1 : -1)).toFixed(1);
      const strokeVal = (frequency * 8.2).toFixed(1);
      const currentActive = Math.floor(((t * frequency * 4) % 4) + 1);
      setPeristalsisTelemetry({
        activeAnchor: `Segment ${currentActive} (Grip: ${(70 + Math.random() * 25).toFixed(0)}%)`,
        propulsionStroke: `+${strokeVal} mm/s`,
        netVelocity: `${netV} mm/s`,
        phaseGait: direction > 0 ? "Retrograde Metameric" : "Anterograde Metameric"
      });
    }, 350);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(telemetryTimer);
    };
  }, [mode, frequency, isPlaying, direction]);

  // Archerfish Fluid Slug Sim Loop
  useEffect(() => {
    if (mode !== "archerfish") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      radius: number;
      alpha: number;
      coalesced: boolean;
    }

    let animId: number;
    let particles: Particle[] = [];
    let pulseTime = 0;
    let orificeAperture = 1.0; // 1.0 down to 0.15 during pulse

    const targetX = canvas.width * 0.82;
    const nozzleX = canvas.width * 0.14;
    const centerY = canvas.height * 0.5;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Trajectory axis guideline
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(nozzleX, centerY);
      ctx.lineTo(targetX + 40, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Target Target Plate at targetX
      ctx.fillStyle = "rgba(251, 191, 36, 0.18)";
      ctx.strokeStyle = "rgba(251, 191, 36, 0.75)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(targetX - 2, centerY - 38, 12, 76, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fde68a";
      ctx.font = "10px var(--font-jetbrains-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText("TARGET", targetX + 4, centerY - 46);

      // Draw Dynamic Iris Orifice & Voice-Coil Nozzle
      const maxApertureRadius = 24;
      const currentRadius = maxApertureRadius * Math.max(0.18, orificeAperture);

      // Nozzle body housing
      ctx.fillStyle = "rgba(30, 41, 59, 0.85)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nozzleX - 50, centerY - 34);
      ctx.lineTo(nozzleX - 10, centerY - currentRadius - 4);
      ctx.lineTo(nozzleX, centerY - currentRadius);
      ctx.lineTo(nozzleX, centerY + currentRadius);
      ctx.lineTo(nozzleX - 10, centerY + currentRadius + 4);
      ctx.lineTo(nozzleX - 50, centerY + 34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Iris aperture opening indicator (emerald/cyan glow)
      ctx.fillStyle = isFiring ? "rgba(56, 189, 248, 0.85)" : "rgba(56, 189, 248, 0.3)";
      ctx.beginPath();
      ctx.ellipse(nozzleX, centerY, 5, currentRadius, 0, 0, Math.PI * 2);
      ctx.fill();

      // Nozzle label
      ctx.fillStyle = "rgba(147, 197, 253, 0.75)";
      ctx.font = "10px var(--font-jetbrains-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText(`APERTURE: ${(orificeAperture * 100).toFixed(0)}%`, nozzleX - 25, centerY + 48);

      // Handle Firing Wave Generation
      if (isFiring) {
        pulseTime += 0.035;
        // Orifice constricts dynamically over orificeSpeed
        const progress = Math.min(1, pulseTime / (orificeSpeed * 0.05));
        orificeAperture = 1.0 - progress * 0.78; // Constricts aperture

        // Tail particles have higher velocity: v(t) = v0 * (1 + beta * progress)
        if (progress < 1.0) {
          const baseVelocity = pulsePressure * 2.8;
          const overtakingVelocity = baseVelocity * (1 + progress * 1.45);

          for (let p = 0; p < 3; p++) {
            particles.push({
              x: nozzleX + 2,
              y: centerY + (Math.random() - 0.5) * (currentRadius * 0.7),
              vx: overtakingVelocity * (0.95 + Math.random() * 0.1),
              radius: 2.2 + (1 - progress) * 1.5,
              alpha: 0.9,
              coalesced: false
            });
          }
        } else {
          // Pulse completed, recover aperture
          if (pulseTime > orificeSpeed * 0.05 + 1.2) {
            setIsFiring(false);
            orificeAperture = 1.0;
          }
        }
      }

      // Update & Render Fluid Particles
      // Find coalescence zone: check density of particles along X axis
      const coalescenceRangeMin = targetX - 70;
      const coalescenceRangeMax = targetX - 10;

      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;

        // Visual coalescence effect: trailing particles merge into slug at coalescence distance
        if (pt.x >= coalescenceRangeMin && pt.x <= coalescenceRangeMax) {
          pt.coalesced = true;
          // Magnetize towards trajectory axis centerY
          pt.y += (centerY - pt.y) * 0.18;
          pt.radius = Math.min(6.5, pt.radius + 0.15);
        }

        // Draw particle
        ctx.beginPath();
        if (pt.coalesced) {
          // Luminous coherent slug particle
          ctx.fillStyle = "rgba(56, 189, 248, 0.95)";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = "rgba(147, 197, 253, 0.7)";
          ctx.shadowBlur = 0;
        }
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Impact with target
        if (pt.x >= targetX) {
          // Splash impact visual
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(targetX, pt.y);
          ctx.lineTo(targetX + 12 + Math.random() * 10, pt.y + (Math.random() - 0.5) * 18);
          ctx.stroke();
          particles.splice(i, 1);
        } else if (pt.x > width + 20) {
          particles.splice(i, 1);
        }
      }

      // Coalescence Zone Annotation
      ctx.strokeStyle = "rgba(52, 211, 153, 0.45)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(coalescenceRangeMin, centerY - 32);
      ctx.lineTo(coalescenceRangeMin, centerY + 32);
      ctx.moveTo(coalescenceRangeMax, centerY - 32);
      ctx.lineTo(coalescenceRangeMax, centerY + 32);
      ctx.stroke();

      ctx.fillStyle = "#34d399";
      ctx.font = "10px var(--font-jetbrains-mono, monospace)";
      ctx.textAlign = "center";
      ctx.fillText("SLUG COALESCENCE ZONE", (coalescenceRangeMin + coalescenceRangeMax) / 2, centerY + 44);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mode, isFiring, orificeSpeed, pulsePressure]);

  const triggerArcherfishPulse = useCallback(() => {
    setIsFiring(true);
    // compute realistic telemetry based on pressure and speed
    const exitV = (pulsePressure * 6.5).toFixed(1);
    const dist = (pulsePressure * 14.2 - orificeSpeed * 0.4).toFixed(1);
    const mom = (pulsePressure * 0.68 + (30 - orificeSpeed) * 0.03).toFixed(2);
    setArcherfishTelemetry({
      exitVelocity: `${exitV} m/s`,
      coalescenceDist: `${dist} cm`,
      momentum: `${mom} mJ`,
      concentration: "94.6%"
    });
  }, [pulsePressure, orificeSpeed]);

  return (
    <div className="sim-container">
      {/* Simulation Header & Mode Toggle */}
      <div className="sim-header">
        <div className="sim-title-group">
          <span className="sim-badge">
            <Activity size={13} aria-hidden="true" /> Interactive Kinetic Simulation
          </span>
          <h4>
            {mode === "peristalsis"
              ? "Metameric Peristaltic In-Pipe Locomotion"
              : "Archerfish Hydrodynamic Pulse Delivery"}
          </h4>
        </div>

        {showModeToggle && (
          <div className="sim-tabs" role="tablist" aria-label="Select simulation model">
            <button
              role="tab"
              aria-selected={mode === "peristalsis"}
              className={`sim-tab-button ${mode === "peristalsis" ? "active" : ""}`}
              onClick={() => setMode("peristalsis")}
            >
              <Waves size={14} aria-hidden="true" />
              Earthworm Peristalsis
            </button>
            <button
              role="tab"
              aria-selected={mode === "archerfish"}
              className={`sim-tab-button ${mode === "archerfish" ? "active" : ""}`}
              onClick={() => setMode("archerfish")}
            >
              <Zap size={14} aria-hidden="true" />
              Archerfish Jet Coalescence
            </button>
          </div>
        )}
      </div>

      {/* Main Simulation Viewport */}
      <div className="sim-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={720}
          height={240}
          className="sim-canvas"
          aria-label={
            mode === "peristalsis"
              ? "Real-time canvas visualization of 4-segment earthworm peristalsis with radial anchorage and axial crawl inside a conduit."
              : "Real-time canvas visualization of variable-orifice fluid ejection coalescing into a single kinetic water slug."
          }
        />

        {/* Legend overlays */}
        <div className="sim-legend">
          {mode === "peristalsis" ? (
            <>
              <span className="legend-item">
                <span className="legend-dot anchor" /> Radial Anchor (Micro-Setae Grip)
              </span>
              <span className="legend-item">
                <span className="legend-dot stroke" /> Axial Stroke Extension
              </span>
            </>
          ) : (
            <>
              <span className="legend-item">
                <span className="legend-dot orifice" /> Dynamic Iris Orifice
              </span>
              <span className="legend-item">
                <span className="legend-dot slug" /> Kinetic Slug Coalescence
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Controls & Telemetry Dashboard */}
      <div className="sim-footer">
        {mode === "peristalsis" ? (
          <div className="sim-controls-grid">
            <div className="sim-control-group">
              <label htmlFor="frequency-slider" className="sim-label">
                Wave Frequency: <strong>{frequency.toFixed(1)} Hz</strong>
              </label>
              <input
                id="frequency-slider"
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="sim-slider"
              />
            </div>

            <div className="sim-actions-group">
              <button
                type="button"
                className="button button-secondary sim-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause peristaltic simulation" : "Resume peristaltic simulation"}
              >
                {isPlaying ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
                <span>{isPlaying ? "Pause Gait" : "Run Gait"}</span>
              </button>

              <button
                type="button"
                className="button button-secondary sim-btn"
                onClick={() => setDirection((d) => (d === 1 ? -1 : 1))}
                aria-label="Toggle crawl direction"
              >
                <RotateCcw size={15} aria-hidden="true" />
                <span>{direction === 1 ? "Direction: Forward" : "Direction: Reverse"}</span>
              </button>
            </div>

            <div className="sim-telemetry">
              <div className="telemetry-card">
                <span className="telemetry-label">Active Anchor</span>
                <strong className="telemetry-value highlight-emerald">{peristalsisTelemetry.activeAnchor}</strong>
              </div>
              <div className="telemetry-card">
                <span className="telemetry-label">Propulsion Stroke</span>
                <strong className="telemetry-value">{peristalsisTelemetry.propulsionStroke}</strong>
              </div>
              <div className="telemetry-card">
                <span className="telemetry-label">Net Forward Velocity</span>
                <strong className="telemetry-value highlight-cyan">{peristalsisTelemetry.netVelocity}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="sim-controls-grid">
            <div className="sim-control-group">
              <label htmlFor="orifice-slider" className="sim-label">
                Aperture Constriction Speed: <strong>{orificeSpeed} ms</strong>
              </label>
              <input
                id="orifice-slider"
                type="range"
                min="5"
                max="30"
                step="1"
                value={orificeSpeed}
                onChange={(e) => setOrificeSpeed(parseInt(e.target.value))}
                className="sim-slider"
              />
            </div>

            <div className="sim-control-group">
              <label htmlFor="pressure-slider" className="sim-label">
                Chamber Pressure: <strong>{pulsePressure.toFixed(1)} bar</strong>
              </label>
              <input
                id="pressure-slider"
                type="range"
                min="1.0"
                max="4.5"
                step="0.1"
                value={pulsePressure}
                onChange={(e) => setPulsePressure(parseFloat(e.target.value))}
                className="sim-slider"
              />
            </div>

            <div className="sim-actions-group">
              <button
                type="button"
                className="button button-primary sim-btn pulse-fire-btn"
                onClick={triggerArcherfishPulse}
                disabled={isFiring}
                aria-label="Trigger high-speed hydrodynamic pulse"
              >
                <Sparkles size={15} aria-hidden="true" />
                <span>{isFiring ? "Ejecting..." : "Fire Hydrodynamic Pulse"}</span>
              </button>
            </div>

            <div className="sim-telemetry">
              <div className="telemetry-card">
                <span className="telemetry-label">Exit Velocity (ve)</span>
                <strong className="telemetry-value highlight-cyan">{archerfishTelemetry.exitVelocity}</strong>
              </div>
              <div className="telemetry-card">
                <span className="telemetry-label">Coalescence Distance (D)</span>
                <strong className="telemetry-value highlight-emerald">{archerfishTelemetry.coalescenceDist}</strong>
              </div>
              <div className="telemetry-card">
                <span className="telemetry-label">Kinetic Momentum (P)</span>
                <strong className="telemetry-value highlight-amber">{archerfishTelemetry.momentum}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
