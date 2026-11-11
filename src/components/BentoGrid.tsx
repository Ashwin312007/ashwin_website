"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Plus,
  Cpu,
  CircuitBoard,
  Trophy,
  Award,
  Sparkles,
  Waves,
  Gauge,
  Bot,
  Activity,
  Layers,
  Box
} from "lucide-react";
import type { ProjectData } from "@/types";
import { PROJECTS_DATA, EXPERIENCE, CAPABILITIES } from "@/lib/portfolio";
export { PROJECTS_DATA } from "@/lib/portfolio";

const capabilityIcons: Record<string, React.ElementType> = {
  biomimicry: Sparkles,
  control: Gauge,
  embedded: Cpu,
  robotics: Bot
};

function matchesProjectCategory(project: ProjectData, category: string): boolean {
  if (category === "all") return true;
  if (category === "biomimicry") {
    return Boolean(project.bioInspiration) || project.category.toLowerCase().includes("biomimicry") || project.category.toLowerCase().includes("fluid");
  }
  if (category === "robotics") {
    return (
      project.category.toLowerCase().includes("robot") ||
      project.category.toLowerCase().includes("flight") ||
      project.category.toLowerCase().includes("competition")
    );
  }
  if (category === "embedded") {
    return (
      project.category.toLowerCase().includes("control") ||
      project.category.toLowerCase().includes("medical") ||
      project.category.toLowerCase().includes("automation") ||
      project.stack.some((s) => s.toLowerCase().includes("embedded") || s.toLowerCase().includes("pcb"))
    );
  }
  return true;
}

function ProjectCard({
  project,
  onSelect
}: {
  project: ProjectData;
  onSelect: (project: ProjectData, initialTab?: "overview" | "cad3d") => void;
}) {
  return (
    <article className="project-card">
      <div className="project-top">
        <span className="project-category-tag">{project.category}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {project.hasSimulation && (
            <span className="card-3d-badge">
              <Box size={11} aria-hidden="true" /> 3D CAD
            </span>
          )}
          <span className="status-label">{project.status}</span>
        </div>
      </div>

      <h3>{project.title}</h3>
      {project.tagline && <p className="card-tagline">{project.tagline}</p>}
      <p>{project.description}</p>

      {project.bioInspiration && (
        <div className="card-bio-pill">
          <Sparkles size={13} aria-hidden="true" />
          <span>Bio-Inspired: {project.bioInspiration.slice(0, 78)}...</span>
        </div>
      )}

      <div className="tags">
        {project.stack.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
        {project.stack.length > 4 && <span>+{project.stack.length - 4}</span>}
      </div>

      <div className="project-bottom">
        <button
          className="text-action"
          onClick={() => onSelect(project, project.hasSimulation ? "cad3d" : "overview")}
          aria-label={`View ${project.title} details and 3D kinematics`}
        >
          {project.hasSimulation ? "Inspect in 3D" : "View project"} <ArrowUpRight size={17} aria-hidden="true" />
        </button>
        <span className="project-kind">
          {project.hasSimulation ? "Interactive 3D CAD" : "Engineering overview"}
        </span>
      </div>
    </article>
  );
}

export function BentoGrid({
  onProjectSelect
}: {
  onProjectSelect: (project: ProjectData, initialTab?: "overview" | "cad3d") => void;
}) {
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [capabilityCategory, setCapabilityCategory] = useState<string>("all");

  const filteredProjects = PROJECTS_DATA.filter((p) => matchesProjectCategory(p, projectFilter));
  const spotlightProject = PROJECTS_DATA[0]; // Bio-Pipe Robot

  const filteredCapabilities = CAPABILITIES.filter(
    (item) => capabilityCategory === "all" || item.id === capabilityCategory
  );

  return (
    <div className="shell">
      {/* Projects Section */}
      <section className="content-section" id="projects" aria-labelledby="projects-title">
        <div className="section-heading">
          <div>
            <h2 id="projects-title">
              Selected work
              <span className="section-count" aria-label={`${PROJECTS_DATA.length} projects`}>
                {" "}{PROJECTS_DATA.length}
              </span>
            </h2>
            <p>
              From biological peristalsis and fluid dynamics to space rovers, medical devices, and autonomous aerial platforms.
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className="filter-bar" role="group" aria-label="Filter engineering projects">
            <button
              className="filter-button"
              aria-pressed={projectFilter === "all"}
              onClick={() => setProjectFilter("all")}
            >
              All Work ({PROJECTS_DATA.length})
            </button>
            <button
              className="filter-button"
              aria-pressed={projectFilter === "biomimicry"}
              onClick={() => setProjectFilter("biomimicry")}
            >
              Biomimicry
            </button>
            <button
              className="filter-button"
              aria-pressed={projectFilter === "robotics"}
              onClick={() => setProjectFilter("robotics")}
            >
              Robotics
            </button>
            <button
              className="filter-button"
              aria-pressed={projectFilter === "embedded"}
              onClick={() => setProjectFilter("embedded")}
            >
              Embedded & Control
            </button>
          </div>
        </div>

        <div className="project-grid">
          {/* Flagship Spotlight Card (when all or biomimicry is selected) */}
          {(projectFilter === "all" || projectFilter === "biomimicry") && (
            <article className="project-card featured">
              <div className="featured-content">
                <div className="project-top">
                  <span className="project-category-tag highlight-emerald">{spotlightProject.category}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="card-3d-badge">
                      <Box size={11} aria-hidden="true" /> 3D CAD Inspector
                    </span>
                    <span className="status-label">{spotlightProject.status}</span>
                  </div>
                </div>

                <h3>{spotlightProject.title}</h3>
                <p className="card-tagline highlight-emerald">{spotlightProject.tagline}</p>
                <p>{spotlightProject.description}</p>

                {spotlightProject.bioInspiration && (
                  <div className="card-bio-pill highlight-emerald">
                    <Sparkles size={14} aria-hidden="true" />
                    <span>Bio-Inspiration: {spotlightProject.bioInspiration}</span>
                  </div>
                )}

                <div className="tags">
                  {spotlightProject.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <div className="project-bottom">
                  <button
                    className="text-action"
                    onClick={() => onProjectSelect(spotlightProject, "cad3d")}
                    aria-label="Inspect Bio-Inspired Peristaltic In-Pipe Crawling Robot in 3D CAD and view specifications"
                  >
                    Inspect in 3D CAD & Launch Specs <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                  <span className="project-kind">
                    Metameric 3D Assembly
                  </span>
                </div>
              </div>

              {/* Physical Render or Architecture diagram */}
              <div className="feature-diagram spotlight-diagram" role="img" aria-label="Peristaltic Soft Robot Architecture">
                <div className="diagram-title">
                  <span>Metameric Locomotion Architecture</span>
                  <Activity size={17} className="highlight-emerald" aria-hidden="true" />
                </div>

                <div className="diagram-center">
                  <strong>Retrograde Peristalsis</strong>
                  <span>Alternating Radial Anchorage & Axial Stroke</span>
                </div>

                <div className="diagram-branches">
                  <div>
                    <strong>95A TPU Bellows</strong>
                    <br />
                    1.18 mm shell profile
                  </div>
                  <div>
                    <strong>ESP32 RTOS</strong>
                    <br />
                    PWM wave sequencer
                  </div>
                </div>

                <div className="diagram-note">
                  Directional micro-setae arrays · Zero pipe jamming
                </div>
              </div>
            </article>
          )}

          {/* Render remaining filtered projects */}
          {filteredProjects
            .filter((p) => (projectFilter === "all" || projectFilter === "biomimicry" ? p.id !== spotlightProject.id : true))
            .map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={onProjectSelect} />
            ))}
        </div>
      </section>

      {/* Experience & Leadership Section */}
      <section className="content-section experience-layout" id="experience" aria-labelledby="experience-title">
        <div className="split-heading">
          <h2 id="experience-title">
            Experience &<br />leadership.
          </h2>
          <p>Hands-on engineering, research, and the people who make it happen.</p>
          <a className="text-action" href="/Ashwin_TE_Resume.pdf" target="_blank" rel="noopener noreferrer">
            View full résumé <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div className="experience-list">
          {EXPERIENCE.map((item, index) => (
            <details className="experience-item" key={item.organization} open={index === 0 ? true : undefined}>
              <summary>
                <div>
                  <h3>{item.organization}</h3>
                  <p>{item.role}</p>
                </div>
                <div className="experience-meta">
                  <span>{item.period}</span>
                  <Plus size={18} aria-hidden="true" />
                </div>
              </summary>
              <p className="experience-detail">
                <span className="mobile-period">{item.period}</span>
                {item.detail}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Tools & Capabilities Section */}
      <section className="content-section" id="skills" aria-labelledby="skills-title">
        <div className="section-heading">
          <div>
            <h2 id="skills-title">Tools & capabilities.</h2>
            <p>From biological metameric modeling to real-time embedded control and autonomous navigation.</p>
          </div>
          <div className="filter-bar" role="group" aria-label="Filter technical capabilities">
            <button
              className="filter-button"
              aria-pressed={capabilityCategory === "all"}
              onClick={() => setCapabilityCategory("all")}
            >
              All capabilities
            </button>
            {CAPABILITIES.map((item) => (
              <button
                key={item.id}
                className="filter-button"
                aria-pressed={capabilityCategory === item.id}
                onClick={() => setCapabilityCategory(item.id)}
              >
                {item.filter}
              </button>
            ))}
          </div>
        </div>

        <div className={`capability-grid ${capabilityCategory !== "all" ? "filtered" : ""}`} aria-live="polite">
          {filteredCapabilities.map((item) => {
            const IconComponent = capabilityIcons[item.id] || Cpu;
            return (
              <article className="capability" key={item.id}>
                <IconComponent size={26} strokeWidth={1.4} aria-hidden="true" />
                <h3>{item.title}</h3>
                <ul>
                  {item.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <p>{item.evidence}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Milestones & Recognition Section */}
      <section className="content-section" id="achievements" aria-labelledby="recognition-title">
        <div className="section-heading">
          <div>
            <h2 id="recognition-title">A few milestones.</h2>
            <p>Team efforts. Real outcomes.</p>
          </div>
        </div>
        <div className="recognition-list">
          <div className="recognition">
            <Trophy size={23} strokeWidth={1.4} aria-hidden="true" />
            <strong>6th globally</strong>
            <p>NASA HERC 2026<br />Best Indian Team · 7:02 run</p>
          </div>
          <div className="recognition">
            <Award size={23} strokeWidth={1.4} aria-hidden="true" />
            <strong>3rd nationally</strong>
            <p>Innovate Hackathon<br />National-level competition</p>
          </div>
          <div className="recognition">
            <Award size={23} strokeWidth={1.4} aria-hidden="true" />
            <strong>Hackathon winner</strong>
            <p>REVIVE 2024<br />National-level competition</p>
          </div>
        </div>
        <div className="recognition-footnote">
          <span>Finalist / BITS Hyderabad Techfest</span>
          <span>Semi-finalist / IIT Madras Caterpillar Challenge</span>
        </div>
      </section>

      {/* Education Section */}
      <section className="education-section" id="education" aria-labelledby="education-title">
        <h2 id="education-title">Always learning.</h2>
        <div className="education-content">
          <div>
            <span className="education-date">2024–present</span>
            <h3>B.Tech, Mechatronics<br />& Automation</h3>
            <p>Vellore Institute of Technology, Chennai</p>
          </div>
          <div>
            <span className="education-date">Higher secondary / 91%</span>
            <h3>SBOA Matriculation &<br />Higher Secondary School</h3>
            <p>Chennai, India</p>
          </div>
          <div className="education-extra">Languages: English, Tamil, Hindi, German</div>
        </div>
      </section>
    </div>
  );
}
