"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  X,
  Sparkles,
  Layers,
  Sliders,
  PlayCircle,
  Cpu,
  Box
} from "lucide-react";
import type { ProjectData } from "@/types";
import { ModalFrame } from "./ModalFrame";
import { BiomimicrySim } from "./BiomimicrySim";
import { Project3DViewer } from "./Project3DViewer";

interface ProjectModalProps {
  project: ProjectData | null;
  initialTab?: "overview" | "cad3d" | "subsystems" | "specifications" | "simulation";
  onClose: () => void;
}

type ModalTab = "overview" | "cad3d" | "subsystems" | "specifications" | "simulation";

export function ProjectModal({ project, initialTab = "overview", onClose }: ProjectModalProps) {
  const [prevProject, setPrevProject] = useState(project);
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);

  if (project !== prevProject) {
    setPrevProject(project);
    setActiveTab(initialTab || "overview");
  }

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
  const has3D = Boolean(project.hasSimulation && project.simulationType);

  return (
    <ModalFrame open={Boolean(project)} onClose={onClose} labelId="project-dialog-title">
      <div className="dialog-header">
        <div>
          <div className="dialog-meta-row">
            <span className="status-label">{project.status}</span>
            <span className="category-label">{project.category}</span>
            {has3D && (
              <span className="card-3d-badge">
                <Box size={11} aria-hidden="true" /> 3D CAD Available
              </span>
            )}
          </div>
          <h2 id="project-dialog-title">{project.title}</h2>
          {project.tagline && <p className="dialog-tagline">{project.tagline}</p>}
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Close project details">
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Aesthetic Spatial Tabs Bar */}
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

        {has3D && (
          <button
            role="tab"
            aria-selected={activeTab === "cad3d"}
            className={`modal-tab-btn sim-tab-highlight ${activeTab === "cad3d" ? "active" : ""}`}
            onClick={() => setActiveTab("cad3d")}
          >
            <Box size={14} aria-hidden="true" />
            3D CAD Inspector
          </button>
        )}

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
            className={`modal-tab-btn ${activeTab === "simulation" ? "active" : ""}`}
            onClick={() => setActiveTab("simulation")}
          >
            <PlayCircle size={14} aria-hidden="true" />
            2D Wave Telemetry
          </button>
        )}
      </div>

      <div className="dialog-body" data-lenis-prevent>
        {/* Tab: 3D CAD Inspector */}
        {activeTab === "cad3d" && project.simulationType && (
          <div className="tab-pane">
            <div style={{ marginBottom: 16 }}>
              <h3 className="pane-section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Box size={16} className="highlight-cyan" aria-hidden="true" />
                Interactive 3D CAD Robotics Inspector
              </h3>
              <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                Real-time WebGL inspection of kinematic assembly and actuators. Toggle wireframe, examine exploded subcomponents, and observe dynamic wave profiles.
              </p>
            </div>
            <Project3DViewer model={project.simulationType} />
          </div>
        )}

        {/* Tab: Overview & Highlights */}
        {activeTab === "overview" && (
          <div className="tab-pane">
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
                    <span>Physical Prototype & CAD Realization</span>
                    {has3D ? (
                      <button
                        className="text-action"
                        style={{ fontSize: 12, padding: 0 }}
                        onClick={() => setActiveTab("cad3d")}
                      >
                        Inspect in 3D CAD →
                      </button>
                    ) : (
                      <span className="caption-tag">Hardware Architecture</span>
                    )}
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

        {/* Tab: Subsystems */}
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

        {/* Tab: Specifications */}
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

        {/* Tab: 2D Kinetic Telemetry Simulation */}
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
