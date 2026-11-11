"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, X, Sparkles, Layers, Sliders, PlayCircle, Cpu } from "lucide-react";
import type { ProjectData } from "@/types";
import { ModalFrame } from "./ModalFrame";
import { BiomimicrySim } from "./BiomimicrySim";

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

type ModalTab = "overview" | "subsystems" | "specifications" | "simulation";

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");

  // Reset tab when a new project opens
  useEffect(() => {
    if (project) {
      setActiveTab("overview");
    }
  }, [project]);

  if (!project) {
    return (
      <ModalFrame open={false} onClose={onClose} labelId="project-dialog-title">
        <div />
      </ModalFrame>
    );
  }

  const hasSubsystems = Boolean(project.subsystems && project.subsystems.length > 0);
  const hasSpecs = Boolean(project.specifications && project.specifications.length > 0);
  const hasSim = Boolean(project.hasSimulation);

  return (
    <ModalFrame open={Boolean(project)} onClose={onClose} labelId="project-dialog-title">
      <div className="dialog-header">
        <div>
          <div className="dialog-meta-row">
            <span className="status-label">{project.status}</span>
            <span className="category-label">{project.category}</span>
          </div>
          <h2 id="project-dialog-title">{project.title}</h2>
          {project.tagline && <p className="dialog-tagline">{project.tagline}</p>}
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close project details">
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Aesthetic Tabs Bar */}
      <div className="modal-tabs-bar" role="tablist" aria-label="Project detail sections">
        <button
          role="tab"
          aria-selected={activeTab === "overview"}
          className={`modal-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Layers size={14} aria-hidden="true" />
          Overview & Highlights
        </button>

        {hasSubsystems && (
          <button
            role="tab"
            aria-selected={activeTab === "subsystems"}
            className={`modal-tab-btn ${activeTab === "subsystems" ? "active" : ""}`}
            onClick={() => setActiveTab("subsystems")}
          >
            <Cpu size={14} aria-hidden="true" />
            Key Subsystems
          </button>
        )}

        {hasSpecs && (
          <button
            role="tab"
            aria-selected={activeTab === "specifications"}
            className={`modal-tab-btn ${activeTab === "specifications" ? "active" : ""}`}
            onClick={() => setActiveTab("specifications")}
          >
            <Sliders size={14} aria-hidden="true" />
            Specifications
          </button>
        )}

        {hasSim && (
          <button
            role="tab"
            aria-selected={activeTab === "simulation"}
            className={`modal-tab-btn sim-tab-highlight ${activeTab === "simulation" ? "active" : ""}`}
            onClick={() => setActiveTab("simulation")}
          >
            <PlayCircle size={14} aria-hidden="true" />
            Interactive Simulation
          </button>
        )}
      </div>

      <div className="dialog-body">
        {/* Render Image Banner if present */}
        {project.image && (
          <div className="project-image-showcase">
            <div className="image-frame">
              <Image
                src={project.image}
                alt={`Physical rendering of ${project.title}`}
                width={800}
                height={450}
                className="showcase-img"
                priority
              />
              <div className="image-caption-bar">
                <span>Rendering & Prototype Model</span>
                <span className="caption-tag">CAD / Physical Realization</span>
              </div>
            </div>
          </div>
        )}

        {/* Bio-Inspiration Aesthetic Callout */}
        {project.bioInspiration && (
          <div className="bio-inspiration-callout" role="region" aria-label="Biological Inspiration">
            <div className="bio-callout-header">
              <Sparkles size={16} className="bio-icon" aria-hidden="true" />
              <strong>Biological Principle & Biomimicry Inspiration</strong>
            </div>
            <p className="bio-callout-text">{project.bioInspiration}</p>
          </div>
        )}

        {/* Tab 1: Overview & Highlights */}
        {activeTab === "overview" && (
          <div className="tab-pane">
            <p className="project-full-desc">{project.description}</p>

            <div className="dialog-columns">
              <div>
                <h3>Engineering Highlights & Innovations</h3>
                <ul>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Disciplines & Technology Stack</h3>
                <div className="tags">
                  {project.stack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Subsystems */}
        {activeTab === "subsystems" && hasSubsystems && (
          <div className="tab-pane">
            <h3 className="pane-section-title">Subsystem Architecture</h3>
            <div className="subsystems-grid">
              {project.subsystems?.map((subsystem) => (
                <article key={subsystem.name} className="subsystem-card">
                  <h4>{subsystem.name}</h4>
                  <p>{subsystem.description}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Specifications */}
        {activeTab === "specifications" && hasSpecs && (
          <div className="tab-pane">
            <h3 className="pane-section-title">Technical Specifications & Performance</h3>
            <div className="specs-grid">
              {project.specifications?.map((spec) => (
                <div key={spec.label} className="spec-tile">
                  <span className="spec-label">{spec.label}</span>
                  <strong className="spec-value">{spec.value}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Interactive Kinetic Simulation */}
        {activeTab === "simulation" && hasSim && (
          <div className="tab-pane simulation-pane">
            <BiomimicrySim initialMode={project.simulationType} />
          </div>
        )}

        {/* Dialog Actions Footer */}
        <div className="dialog-actions">
          <a
            className="button button-primary"
            href={`mailto:teashwin3@gmail.com?subject=${encodeURIComponent("Discussion: " + project.title)}`}
          >
            Discuss this project <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          {project.links
            .filter((link) => link.url !== "#")
            .map((link) => (
              <a
                key={link.url}
                className="button button-secondary"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            ))}
        </div>
      </div>
    </ModalFrame>
  );
}
