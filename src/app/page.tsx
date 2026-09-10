"use client";
import { useState } from "react";
import { Copy, Check, Terminal, ArrowUpRight } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { BentoGrid } from "@/components/BentoGrid";
import { CyberTerminal } from "@/components/CyberTerminal";
import { ProjectModal } from "@/components/ProjectModal";
import type { ProjectData } from "@/types";

export default function Home() {
  const [selectedProject,setSelectedProject] = useState<ProjectData | null>(null);
  const [copyStatus,setCopyStatus] = useState("");
  async function copyEmail() {
    try { await navigator.clipboard.writeText("teashwin3@gmail.com"); setCopyStatus("Email address copied."); }
    catch { setCopyStatus("Couldn’t copy automatically. Select the email address to copy it, or click it to send a message."); }
  }
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <NavBar/>
    <main id="main-content" tabIndex={-1}>
      <HeroSection/>
      <BentoGrid onProjectSelect={setSelectedProject}/>
      <section className="shell contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-top"><span className="availability"><span className="status-dot"/>Open to collaborations & research</span><span>Based in Chennai, building beyond it.</span></div>
        <h2 id="contact-title">Have something<br/>worth building?</h2>
        <div className="contact-bottom"><p>Robotics, embedded systems, or an idea that connects the two. Let’s talk.</p>
          <div className="contact-actions"><a className="email-link" href="mailto:teashwin3@gmail.com">teashwin3@gmail.com</a><button className="copy-button" onClick={copyEmail} aria-label="Copy email address">{copyStatus === "Email address copied." ? <Check size={18} aria-hidden="true"/> : <Copy size={18} aria-hidden="true"/>}</button></div>
        </div>
        <p className="copy-status" role="status">{copyStatus}</p>
      </section>
    </main>
    <footer className="shell site-footer"><span>© {new Date().getFullYear()} Ashwin T E</span><div className="footer-links">
      <a href="https://github.com/Ashwin312007" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={12} className="inline" aria-hidden="true"/></a>
      <a href="https://www.linkedin.com/in/ashwin-t-e-410655240/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={12} className="inline" aria-hidden="true"/></a>
      <button className="terminal-trigger" onClick={() => window.dispatchEvent(new Event("open-terminal"))}><Terminal size={14} aria-hidden="true"/>Open terminal</button>
      <a href="#about">Back to top ↑</a>
    </div></footer>
    <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)}/>
    <CyberTerminal/>
  </>;
}
