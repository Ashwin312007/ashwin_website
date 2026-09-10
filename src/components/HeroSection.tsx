import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";

export function HeroSection() {
  return (
    <section id="about" className="hero shell" aria-labelledby="hero-title">
      <div className="hero-panel">
        <span className="hero-availability"><span className="status-dot" />Open to engineering collaborations</span>
        <div className="hero-monogram" aria-hidden="true">a.</div>
        <h1 id="hero-title">Ashwin T E</h1>
        <p className="hero-role">Mechatronics. Robotics. Autonomous systems.</p>
        <p className="hero-intro">Bringing hardware and software together.<br />I build intelligent machines and help teams turn ambitious ideas into working systems.</p>
        <div className="hero-actions">
          <a href="#projects" className="button button-primary">Explore my work <ArrowDown size={16} aria-hidden="true" /></a>
          <a href="/Ashwin_TE_Resume.pdf" target="_blank" rel="noopener noreferrer" className="button button-secondary">View résumé <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <p className="hero-location"><MapPin size={13} aria-hidden="true" />Chennai, India</p>
      </div>
      <div className="hero-facts" aria-label="Portfolio highlights">
        <div><strong>6th globally</strong><span>NASA HERC 2026</span></div>
        <div><strong>2 patents</strong><span>Applications pending</span></div>
        <div><strong>AutoVIT</strong><span>Club secretary</span></div>
      </div>
    </section>
  );
}
