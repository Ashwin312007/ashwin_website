"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";

export function HeroSection() {
  return (
    <section id="about" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-panel">
        <div className="hero-availability">
          <span className="status-dot" aria-hidden="true" />
          <span>Open to engineering collaborations · Chennai, India</span>
        </div>

        <h1 id="hero-title" className="hero-name">
          Ashwin T E
        </h1>

        <h2 className="hero-headline">
          Engineering adaptive machines, bio-inspired robotics, and real-time control systems.
        </h2>

        <p className="hero-lead">
          From peristaltic in-pipe soft crawlers and dynamic hydrodynamic fluid mechanisms to space exploration rovers and medical sensing devices. Bridging mechanics, firmware, and autonomy.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="button button-primary">
            Explore Selected Work <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            href="/Ashwin_TE_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="button button-secondary"
          >
            View Résumé <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-facts" aria-label="Portfolio highlights">
        <div className="hero-fact-card">
          <strong>7 Projects</strong>
          <span>Biomimicry, Robotics & Controls</span>
        </div>
        <div className="hero-fact-card">
          <strong>2 Patents Pending</strong>
          <span>Autonomous & Mechanical Systems</span>
        </div>
        <div className="hero-fact-card">
          <strong>6th Globally</strong>
          <span>NASA HERC 2026 Telemetry & Rover lead</span>
        </div>
      </div>
    </section>
  );
}
