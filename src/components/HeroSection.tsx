"use client";

import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { Hero3DScene } from "./Hero3DScene";

export function HeroSection() {
  return (
    <section id="about" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-panel">
        <div className="hero-left">
          <span className="hero-availability">
            <span className="status-dot" aria-hidden="true" />
            Open to engineering collaborations
          </span>
          <h1 id="hero-title">Ashwin T E</h1>
          <p className="hero-role">Biomimicry · Robotics · Control · Embedded Systems</p>
          <p className="hero-intro">
            Bridging biological mechanics and real-time embedded control to engineer adaptive machines, soft robotics, and high-precision autonomous systems.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="button button-primary">
              Explore 3D work <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a
              href="/Ashwin_TE_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              View résumé <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="hero-location">
            <MapPin size={13} aria-hidden="true" />
            Chennai, India
          </p>
        </div>

        <div className="hero-right">
          <Hero3DScene />
        </div>
      </div>

      <div className="hero-facts" aria-label="Portfolio highlights">
        <div>
          <strong>7 Projects</strong>
          <span>Biomimicry, Robotics & Controls</span>
        </div>
        <div>
          <strong>2 Patents Pending</strong>
          <span>Autonomous & Mechanical Systems</span>
        </div>
        <div>
          <strong>6th Globally</strong>
          <span>NASA HERC 2026 Telemetry & Rover</span>
        </div>
      </div>
    </section>
  );
}
