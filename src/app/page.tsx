import { ParticleBackground } from "@/components/ParticleBackground";
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { BentoGrid } from "@/components/BentoGrid";
import { GitBranch, Mail } from "lucide-react";

const LinkedInIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Home() {
  return (
    <div className="relative w-full min-h-screen text-white font-sans selection:bg-cyan-300 selection:text-black z-10">
      {/* Background Effect */}
      <ParticleBackground />
      
      {/* Navigation */}
      <NavBar />
      
      {/* Main Content */}
      <main>
        <HeroSection />
        <BentoGrid />
      </main>

      {/* Footer */}
      <footer className="relative py-24 border-t border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold silver-gradient-text mb-4 tracking-tighter">Let&apos;s Connect</h2>
            <p className="text-gray-400 max-w-sm">
              Open to collaborations in Robotics, Embedded Systems, and Autonomous Automation.
            </p>
          </div>
          
          <div className="flex gap-8">
            <a href="https://github.com/Ashwin312007" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
              <GitBranch size={32} />
            </a>
            <a href="https://www.linkedin.com/in/ashwin-t-e-410655240/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
              <LinkedInIcon size={32} />
            </a>
            <a href="mailto:ashwin.te2007@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
              <Mail size={32} />
            </a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
          <div>© 2026 ASHWIN T E</div>
          <div>STAY CURIOUS.</div>
        </div>
      </footer>
    </div>
  );
}
