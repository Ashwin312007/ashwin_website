"use client";
import { ArrowUpRight, X } from "lucide-react";
import type { ProjectData } from "@/types";
import { ModalFrame } from "./ModalFrame";

export function ProjectModal({project,onClose}:{project:ProjectData|null;onClose:()=>void}) {
  return <ModalFrame open={Boolean(project)} onClose={onClose} labelId="project-dialog-title">
    {project && <>
      <div className="dialog-header"><div><span className="status-label">{project.status}</span><h2 id="project-dialog-title">{project.title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close project details"><X size={20} aria-hidden="true"/></button></div>
      <div className="dialog-body"><p>{project.description}</p><div className="dialog-columns">
        <div><h3>Engineering contribution</h3><ul>{project.highlights.map(highlight=><li key={highlight}>{highlight}</li>)}</ul></div>
        <div><h3>Tools & disciplines</h3><div className="tags">{project.stack.map(tech=><span key={tech}>{tech}</span>)}</div></div>
      </div><div className="dialog-actions">
        <a className="button button-primary" href={`mailto:teashwin3@gmail.com?subject=${encodeURIComponent("Let’s discuss "+project.title)}`}>Discuss this project <ArrowUpRight size={16} aria-hidden="true"/></a>
        {project.links.filter(link=>link.url!=="#").map(link=><a key={link.url} className="button button-secondary" href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={16} aria-hidden="true"/></a>)}
      </div></div>
    </>}
  </ModalFrame>;
}
