"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Link, Code, MapPin, Terminal } from "lucide-react";
import { useLayoutEffect, useState } from "react";

export function HUD() {
  const { scrollY, scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Hide intro if scrolled more than 50 pixels down
    if (latest > 50 && showIntro) setShowIntro(false);
    if (latest <= 50 && !showIntro) setShowIntro(true);
  });

  // Keep other chapters on progress-based opacity
  const opacityChapter2 = useTransform(scrollYProgress, [0.15, 0.25, 0.4, 0.5], [0, 1, 1, 0]);
  const opacityChapter3 = useTransform(scrollYProgress, [0.4, 0.5, 0.65, 0.75], [0, 1, 1, 0]);
  const opacityChapter4 = useTransform(scrollYProgress, [0.65, 0.75, 0.9, 1], [0, 1, 1, 0]);
  const opacityChapter5 = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none p-6 md:p-12 text-white font-mono flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="glass-panel p-4 rounded-xl pointer-events-auto"
        >
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#00ffcc] uppercase">
            Ashwin T E
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 flex items-center gap-2">
            <Terminal size={14} className="text-[#0066ff]" />
            Mechatronics & Automation Student
          </p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
            <MapPin size={14} /> VIT Chennai
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="glass-panel p-2 flex gap-4 rounded-xl pointer-events-auto"
        >
          <a href="https://github.com/Ashwin312007" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffcc] transition-colors p-2">
            <Code size={20} />
          </a>
          <a href="https://www.linkedin.com/in/ashwin-t-e-410655240/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0066ff] transition-colors p-2">
            <Link size={20} />
          </a>
        </motion.div>
      </header>

      {/* Main Content Area - Scroll Chapters */}
      <main className="relative flex-1 flex items-center justify-center pointer-events-none mt-20">
        
        {/* Chapter 1: Intro - Now uses absolute pixel logic and conditional unmounting */}
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              key="intro"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="absolute text-center max-w-2xl px-4 pointer-events-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] to-[#0066ff]">
                Robotic Command Center
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed glass-panel p-6 rounded-xl border-l-4 border-l-[#00ffcc]">
                Initializing system simulation...<br/>
                Loading technical profile...<br/><br/>
                Primary Roles:<br/>
                <span className="text-white font-semibold">Programming Lead @ TEAM MOVIS (2025-2026)</span><br/>
                <span className="text-white font-semibold">R&D Lead @ VIT Chennai Open Source Programming Club</span><br/>
                <br/>
                Scroll to begin sequence.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chapter 2: The 'Speed' Achievement */}
        <motion.div style={{ opacity: opacityChapter2 }} className="absolute left-0 md:left-20 max-w-xl px-4">
          <div className="glass-panel p-8 rounded-xl border-t-4 border-t-[#0066ff]">
            <div className="text-[#0066ff] text-xs font-bold tracking-[0.2em] mb-2">SYSTEM.ACHIEVEMENT.01</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">NASA HERC</h2>
            <ul className="space-y-3 text-sm md:text-base text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ffcc]" />
                6th Overall Worldwide
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ffcc]" />
                Best Indian Team
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ffcc]" />
                Fastest Team (Time: 7:02)
              </li>
            </ul>
            <p className="mt-6 text-xs text-gray-400 font-mono">
              ROLE: Responsible for the electrical systems, ensuring perfect operation under extreme conditions.
            </p>
          </div>
        </motion.div>

        {/* Chapter 3: Autonomy */}
        <motion.div style={{ opacity: opacityChapter3 }} className="absolute right-0 md:right-20 max-w-xl px-4 text-right">
          <div className="glass-panel p-8 rounded-xl border-r-4 border-r-[#00ffcc] text-left">
            <div className="text-[#0066ff] text-xs font-bold tracking-[0.2em] mb-2">SYSTEM.AUTONOMY.02</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">Autonomy & Robotics</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-[#0066ff] font-semibold text-lg">Caterpillar Autonomy Challenge</h3>
                <p className="text-sm text-gray-300 mt-1">Semifinalist (IIT Madras 2026)</p>
              </div>
              
              <div>
                <h3 className="text-[#0066ff] font-semibold text-lg">Tech Expo BITS Hyderabad</h3>
                <p className="text-sm text-gray-300 mt-1">Finalist</p>
              </div>

              <div>
                <h3 className="text-[#0066ff] font-semibold text-lg">ISRO Robotics Challenge</h3>
                <p className="text-sm text-gray-300 mt-1">Aerial Vehicle/Drone autonomy using ROS2, Raspberry Pi, and Pixhawk.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter 4: VSLAM */}
        <motion.div style={{ opacity: opacityChapter4 }} className="absolute left-0 md:left-20 max-w-xl px-4">
          <div className="glass-panel p-8 rounded-xl border-b-4 border-b-[#0066ff]">
            <div className="text-[#0066ff] text-xs font-bold tracking-[0.2em] mb-2">SYSTEM.MAPPING.03</div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">Spatial Computing</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              Visualizing VSLAM & RTAB point cloud processing for autonomous navigation and environment mapping.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded-lg border border-white/5 text-center">
                <span className="block text-[#00ffcc] font-bold text-xl mb-1">VSLAM</span>
                <span className="text-xs text-gray-400 uppercase">Visual SLAM</span>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-white/5 text-center">
                <span className="block text-[#0066ff] font-bold text-xl mb-1">RTAB</span>
                <span className="text-xs text-gray-400 uppercase">Mapping</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter 5: Skills */}
        <motion.div style={{ opacity: opacityChapter5 }} className="absolute text-center max-w-3xl px-4">
          <div className="glass-panel p-8 md:p-12 rounded-xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 text-white">Technical Matrix</h2>
            
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {['ROS/ROS2', 'Embedded C', 'Python', 'VSLAM / SLAM', 'PID Control', 'PCB Modeling (Altium/KiCad)', 'CAD'].map(skill => (
                <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold text-[#00ffcc] hover:bg-[#00ffcc]/10 transition-colors">
                  {skill}
                </span>
              ))}
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="text-xs text-gray-400 font-bold tracking-[0.2em] mb-4">LANGUAGE PROTOCOLS</div>
              <div className="flex flex-wrap gap-4 justify-center">
                {['English', 'German', 'Tamil', 'Hindi'].map(lang => (
                  <span key={lang} className="text-gray-300 text-sm flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#0066ff]"></span>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer / Scroll Indicator */}
      <footer className="text-center pb-4 pointer-events-auto flex justify-between items-end">
        <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">
          Sys.Status: <span className="text-[#00ffcc]">Online</span>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#00ffcc] to-transparent"></div>
        </motion.div>

        <div className="text-xs text-gray-500 font-mono tracking-widest uppercase text-right">
          Lat: 12.8406° N <br/> Lon: 80.1534° E
        </div>
      </footer>
    </div>
  );
}
