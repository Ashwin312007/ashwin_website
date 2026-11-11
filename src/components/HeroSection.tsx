import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section id="about" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-panel">
        <span className="hero-availability">
          <span className="status-dot" />Open to engineering collaborations
        </span>
        <div className="hero-monogram" aria-hidden="true">a.</div>
        <h1 id="hero-title">Ashwin T E</h1>
        <p className="hero-role">Biomimicry · Robotics · Control · Embedded Systems</p>
        <p className="hero-intro">
          Connecting biological principles with real-time embedded control.<br />
          I design adaptive mechanisms, intelligent robots, and tactile autonomous systems.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="button button-primary">
            Explore my work <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a href="/Ashwin_TE_Resume.pdf" target="_blank" rel="noopener noreferrer" className="button button-secondary">
            View résumé <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <p className="hero-location">
          <MapPin size={13} aria-hidden="true" />Chennai, India
        </p>
      </div>

      <div className="hero-facts" aria-label="Portfolio highlights">
        <div>
          <strong>7 Projects</strong>
          <span>Robotics & biomimicry</span>
        </div>
        <div>
          <strong>2 Patents</strong>
          <span>Applications pending</span>
        </div>
        <div>
          <strong>6th Globally</strong>
          <span>NASA HERC 2026</span>
        </div>
      </div>
    </section>
  );
}
