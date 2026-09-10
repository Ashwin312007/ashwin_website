"use client";
import { useState } from "react";
import { ArrowUpRight, Plus, Cpu, Scan, CircuitBoard, Settings2, Trophy, Award, Orbit } from "lucide-react";
import type { ProjectData } from "@/types";
import { PROJECTS_DATA, EXPERIENCE, CAPABILITIES } from "@/lib/portfolio";
export { PROJECTS_DATA } from "@/lib/portfolio";

const skillIcons = [Orbit, Cpu, Scan, Settings2];

function ProjectCard({project, onSelect}: {project:ProjectData; onSelect:(project:ProjectData)=>void}) {
  return <article className="project-card">
    <div className="project-top"><span>{project.category}</span><span className="status-label">{project.status}</span></div>
    <h3>{project.title}</h3><p>{project.description}</p>
    <div className="tags">{project.stack.map(tag=><span key={tag}>{tag}</span>)}</div>
    <div className="project-bottom"><button className="text-action" onClick={()=>onSelect(project)} aria-label={`View ${project.title} details`}>View project <ArrowUpRight size={17} aria-hidden="true"/></button><span className="project-kind">Engineering overview</span></div>
  </article>;
}

export function BentoGrid({onProjectSelect}: {onProjectSelect:(project:ProjectData)=>void}) {
  const [category,setCategory]=useState("all");
  const featured=PROJECTS_DATA[0];
  const drone=PROJECTS_DATA[4];
  const filtered=CAPABILITIES.filter(item=>category==="all" || item.id===category);
  return <div className="shell">
    <section className="content-section" id="projects" aria-labelledby="projects-title">
      <div className="section-heading"><h2 id="projects-title">Selected work<span className="section-count" aria-label="5 projects"> 5</span></h2><p>Ideas taken from the workbench to autonomous systems, competition, and patent applications.</p></div>
      <div className="project-grid">
        <article className="project-card featured">
          <div className="featured-content">
            <div className="project-top"><span>Team MOVIS / NASA HERC</span><span className="status-label"><Trophy size={13} aria-hidden="true"/>6th place globally</span></div>
            <h3>NASA HERC Rover</h3><p>{featured.description}</p>
            <div className="tags">{featured.stack.map(tag=><span key={tag}>{tag}</span>)}</div>
            <div className="project-bottom"><button className="text-action" onClick={()=>onProjectSelect(featured)} aria-label="View NASA HERC Rover details">Explore the rover project <ArrowUpRight size={17} aria-hidden="true"/></button></div>
          </div>
          <div className="feature-diagram" role="img" aria-label="Contribution overview: electrical and software architecture connects embedded motor control and power distribution.">
            <div className="diagram-title"><span>My engineering contribution</span><CircuitBoard size={17} aria-hidden="true"/></div>
            <div className="diagram-center"><strong>Electrical + software</strong><span>Rover systems architecture</span></div>
            <div className="diagram-branches"><div>Embedded<br/>motor control</div><div>Power<br/>distribution</div></div>
            <div className="diagram-note">Team MOVIS · NASA HERC 2026</div>
          </div>
        </article>
        {PROJECTS_DATA.slice(1,3).map(project=><ProjectCard key={project.id} project={project} onSelect={onProjectSelect}/>)}
        <ProjectCard project={PROJECTS_DATA[3]} onSelect={onProjectSelect}/>
        <ProjectCard project={drone} onSelect={onProjectSelect}/>
      </div>
    </section>

    <section className="content-section experience-layout" id="experience" aria-labelledby="experience-title">
      <div className="split-heading"><h2 id="experience-title">Experience &<br/>leadership.</h2><p>Hands-on engineering, research, and the people who make it happen.</p><a className="text-action" href="/Ashwin_TE_Resume.pdf" target="_blank" rel="noopener noreferrer">View full résumé <ArrowUpRight size={17} aria-hidden="true"/></a></div>
      <div className="experience-list">{EXPERIENCE.map((item,index)=><details className="experience-item" key={item.organization} open={index===0 ? true : undefined}>
        <summary><div><h3>{item.organization}</h3><p>{item.role}</p></div><div className="experience-meta"><span>{item.period}</span><Plus size={18} aria-hidden="true"/></div></summary>
        <p className="experience-detail"><span className="mobile-period">{item.period}</span>{item.detail}</p>
      </details>)}</div>
    </section>

    <section className="content-section" id="skills" aria-labelledby="skills-title">
      <div className="section-heading"><h2 id="skills-title">Tools & capabilities.</h2><p>From a machined part to a navigation algorithm. The tools I bring to the work.</p></div>
      <div className="filter-bar" role="group" aria-label="Filter technical skills"><button className="filter-button" aria-pressed={category==="all"} onClick={()=>setCategory("all")}>All capabilities</button>{CAPABILITIES.map(item=><button key={item.id} className="filter-button" aria-pressed={category===item.id} onClick={()=>setCategory(item.id)}>{item.filter}</button>)}</div>
      <div className={`capability-grid ${category!=="all" ? "filtered" : ""}`} aria-live="polite">{filtered.map(item=>{
        const Icon=skillIcons[CAPABILITIES.findIndex(capability=>capability.id===item.id)];
        return <article className="capability" key={item.id}><Icon size={26} strokeWidth={1.3} aria-hidden="true"/><h3>{item.title}</h3><ul>{item.skills.map(skill=><li key={skill}>{skill}</li>)}</ul><p>{item.evidence}</p></article>;
      })}</div>
    </section>

    <section className="content-section" id="achievements" aria-labelledby="recognition-title">
      <div className="section-heading"><h2 id="recognition-title">A few milestones.</h2><p>Team efforts. Real outcomes.</p></div>
      <div className="recognition-list">
        <div className="recognition"><Trophy size={23} strokeWidth={1.4} aria-hidden="true"/><strong>6th globally</strong><p>NASA HERC 2026<br/>Best Indian Team · 7:02 run</p></div>
        <div className="recognition"><Award size={23} strokeWidth={1.4} aria-hidden="true"/><strong>3rd nationally</strong><p>Innovate Hackathon<br/>National-level competition</p></div>
        <div className="recognition"><Award size={23} strokeWidth={1.4} aria-hidden="true"/><strong>Hackathon winner</strong><p>REVIVE 2024<br/>National-level competition</p></div>
      </div>
      <div className="recognition-footnote"><span>Finalist / BITS Hyderabad Techfest</span><span>Semi-finalist / IIT Madras Caterpillar Challenge</span></div>
    </section>

    <section className="education-section" id="education" aria-labelledby="education-title">
      <h2 id="education-title">Always learning.</h2>
      <div className="education-content">
        <div><span className="education-date">2024–present</span><h3>B.Tech, Mechatronics<br/>& Automation</h3><p>Vellore Institute of Technology, Chennai</p></div>
        <div><span className="education-date">Higher secondary / 91%</span><h3>SBOA Matriculation &<br/>Higher Secondary School</h3><p>Chennai, India</p></div>
        <div className="education-extra">Languages: English, Tamil, Hindi, German</div>
      </div>
    </section>
  </div>;
}
