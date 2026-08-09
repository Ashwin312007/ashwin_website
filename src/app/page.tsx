"use client";

import { useState, useEffect } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { BentoGrid } from "@/components/BentoGrid";
import { CyberTerminal } from "@/components/CyberTerminal";
import { ProjectModal } from "@/components/ProjectModal";
import { ProjectData } from "@/types";
import { GitBranch, Mail, Copy, Check, Terminal } from "lucide-react";

const LinkedInIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }) + " UTC" + (now.getTimezoneOffset() / -60 >= 0 ? "+" : "") + (now.getTimezoneOffset() / -60));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("teashwin3@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openTerminal = () => {
    window.dispatchEvent(new Event("open-terminal"));
  };

  return (
    <div className="relative w-full min-h-screen text-white font-sans selection:bg-blue-300 selection:text-black z-10">
      {/* Background Effect */}
      <ParticleBackground />
      
      {/* Navigation */}
      <NavBar />
      
      {/* Main Content */}
      <main>
        <HeroSection />
        <BentoGrid onProjectSelect={setSelectedProject} />
      </main>

      {/* Cyber Terminal & Project Modal */}
      <CyberTerminal />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Contact & Footer Section */}
      <div id="contact" className="mt-32 pt-16 pb-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="section-divider mb-16" />

        <div className="glass-card p-8 md:p-16 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <h2 className="heading-1 silver-gradient-text mb-4 tracking-tighter">Let&apos;s Connect</h2>
              <p className="text-gray-400 max-w-md mb-8 text-base leading-relaxed">
                Open to collaborations in Robotics, Embedded Systems, Autonomous Automation, and Mechatronics R&D.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <button 
                  onClick={copyEmail}
                  className="flex items-center gap-3 px-6 py-3 bg-[#00a3ff]/10 hover:bg-[#00a3ff]/20 border border-[#00a3ff]/30 rounded-full text-sm font-bold text-[#00a3ff] hover:text-white transition-all duration-300 shadow-lg shadow-[#00a3ff]/10"
                >
                  <Mail size={18} />
                  <span>teashwin3@gmail.com</span>
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>

                <button 
                  onClick={openTerminal}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300"
                >
                  <Terminal size={18} /> Init Terminal
                </button>
              </div>

              {/* Toast Notification */}
              {copied && (
                <div className="mt-4 px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold tracking-widest rounded-lg inline-block animate-in fade-in">
                  EMAIL COPIED TO CLIPBOARD!
                </div>
              )}
            </div>
            
            <div className="flex gap-6 items-center bg-white/5 border border-white/10 p-4 px-8 rounded-full">
              <a 
                href="https://github.com/Ashwin312007" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 text-gray-400 hover:text-[#00a3ff] hover:bg-white/5 rounded-full transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <GitBranch size={28} />
              </a>
              <div className="w-[1px] h-8 bg-white/10" />
              <a 
                href="https://www.linkedin.com/in/ashwin-t-e-410655240/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 text-gray-400 hover:text-[#00a3ff] hover:bg-white/5 rounded-full transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon size={28} />
              </a>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500 font-bold uppercase tracking-[0.3em]">
            <div>© {new Date().getFullYear()} ASHWIN T E — ALL RIGHTS RESERVED</div>
            <div>STAY CURIOUS.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
