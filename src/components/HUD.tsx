"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Link, Code, MapPin, Terminal, Cpu, Briefcase, Award, Zap, Languages, Mail, Phone, GraduationCap, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export function HUD() {
  const { scrollY, scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Hide intro if scrolled more than 50 pixels down
    if (latest > 50 && showIntro) setShowIntro(false);
    if (latest <= 50 && !showIntro) setShowIntro(true);
  });

  // Scroll-based chapter opacities
  // 1: Intro (handled by showIntro)
  // 2: Profile/Summary
  const opacityChapter2 = useTransform(scrollYProgress, [0.08, 0.15, 0.25, 0.3], [0, 1, 1, 0]);
  // 3: Experience & Education
  const opacityChapter3 = useTransform(scrollYProgress, [0.25, 0.32, 0.45, 0.5], [0, 1, 1, 0]);
  // 4: Projects
  const opacityChapter4 = useTransform(scrollYProgress, [0.45, 0.52, 0.65, 0.7], [0, 1, 1, 0]);
  // 5: Achievements
  const opacityChapter5 = useTransform(scrollYProgress, [0.65, 0.72, 0.85, 0.9], [0, 1, 1, 0]);
  // 6: Technical Matrix
  const opacityChapter6 = useTransform(scrollYProgress, [0.85, 0.92, 1], [0, 1, 1]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none p-4 md:p-12 text-white font-mono flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="glass-panel p-4 rounded-xl border-l-4 border-l-[#00ffcc] pointer-events-auto"
        >
          <h1 className="text-xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] via-white to-[#0066ff] uppercase">
            Ashwin T E
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-1 flex items-center gap-2">
            <Terminal size={14} className="text-[#00ffcc]" />
            Robotics Enthusiast | Embedded Systems Developer
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={12} className="text-[#0066ff]" /> VIT Chennai
            </p>
            <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1">
              <Mail size={12} className="text-[#0066ff]" /> teashwin3@gmail.com
            </p>
            <p className="text-[10px] md:text-xs text-gray-400 flex items-center gap-1">
              <Phone size={12} className="text-[#0066ff]" /> +91 8825677628
            </p>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="glass-panel p-2 flex gap-2 md:gap-4 rounded-xl pointer-events-auto"
        >
          <a href="https://github.com/Ashwin312007" target="_blank" rel="noopener noreferrer" className="hover:text-[#00ffcc] hover:bg-white/5 rounded-lg transition-all p-2 flex flex-col items-center gap-1">
            <Code size={20} />
            <span className="text-[8px] uppercase">GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/ashwin-t-e-410655240/" target="_blank" rel="noopener noreferrer" className="hover:text-[#0066ff] hover:bg-white/5 rounded-lg transition-all p-2 flex flex-col items-center gap-1">
            <Link size={20} />
            <span className="text-[8px] uppercase">LinkedIn</span>
          </a>
        </motion.div>
      </header>

      {/* Main Content Area - Scroll Chapters */}
      <main className="relative flex-1 flex items-center justify-center pointer-events-none my-10">
        
        {/* Chapter 1: Intro */}
        <AnimatePresence>
          {showIntro && (
            <motion.div 
              key="intro"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute text-center max-w-2xl px-4 pointer-events-auto"
            >
              <div className="inline-block px-3 py-1 bg-[#00ffcc]/10 border border-[#00ffcc]/30 rounded-full text-[#00ffcc] text-[10px] uppercase tracking-[0.3em] mb-4">
                System Initialized
              </div>
              <h2 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                COMMAND <br/> CENTER
              </h2>
              <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00ffcc]" />
                <p className="text-gray-300 text-sm md:text-base leading-relaxed text-left">
                  <span className="text-[#00ffcc] font-bold">$</span> Loading technical profile...<br/>
                  <span className="text-[#00ffcc] font-bold">$</span> Initializing sensor fusion...<br/>
                  <span className="text-[#00ffcc] font-bold">$</span> Calibrating ROS2 nodes...<br/><br/>
                  <span className="text-white opacity-60">Status:</span> <span className="text-[#00ffcc] animate-pulse">READY</span><br/>
                  <span className="text-[10px] text-gray-500 mt-4 block italic">Scroll to deploy data streams</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chapter 2: Profile Summary */}
        <motion.div style={{ opacity: opacityChapter2 }} className="absolute max-w-3xl px-4 text-center">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Cpu size={120} />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white uppercase tracking-widest">Profile Abstract</h2>
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed font-sans italic">
              &quot;An eager Embedded System Developer passionate about expanding expertise in electronics and autonomous systems. Recognized for efficiency in research and development, currently serving as the Programming Lead for Team MOVIS (2025–2026), and the R&D Lead at the VIT Chennai Open Source Programming Club.&quot;
            </p>
            <div className="mt-8 flex justify-center gap-8">
               <div className="text-center">
                  <div className="text-[#00ffcc] text-2xl font-bold">2+</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest">Leadership Roles</div>
               </div>
               <div className="text-center">
                  <div className="text-[#0066ff] text-2xl font-bold">5+</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest">Major Projects</div>
               </div>
               <div className="text-center">
                  <div className="text-white text-2xl font-bold">6</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest">Intl Awards</div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter 3: Experience & Education */}
        <motion.div style={{ opacity: opacityChapter3 }} className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-20">
          <div className="w-full md:w-1/2 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="text-[#00ffcc]" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">Experience</h2>
            </div>
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-xl border-l-2 border-l-[#00ffcc]">
                <h3 className="text-white font-bold text-lg">MEL Systems and Services</h3>
                <div className="flex justify-between text-xs text-[#00ffcc] mb-2 uppercase font-bold">
                  <span>Intern</span>
                  <span>May 2025 – June 2025</span>
                </div>
                <p className="text-xs text-gray-400">Completed a 60-day professional internship focusing on electronic systems and hardware services.</p>
              </div>
              <div className="glass-panel p-5 rounded-xl border-l-2 border-l-[#0066ff]">
                <h3 className="text-white font-bold text-lg">VIT Chennai OSPC</h3>
                <div className="flex justify-between text-xs text-[#0066ff] mb-2 uppercase font-bold">
                  <span>R&D Lead</span>
                  <span>2025 – Present</span>
                </div>
                <p className="text-xs text-gray-400">Leading research initiatives and achieving impressive outcomes through efficient project management.</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="text-[#0066ff]" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">Education</h2>
            </div>
            <div className="glass-panel p-6 rounded-xl border-r-2 border-r-[#0066ff] text-right">
              <h3 className="text-white font-black text-xl mb-1">B.Tech Mechatronics</h3>
              <p className="text-[#0066ff] font-bold text-sm mb-4">VIT Chennai</p>
              <div className="text-xs text-gray-400 font-mono space-y-2">
                <p>July 2024 – Present</p>
                <p>Focusing on Automation, Robotics & Systems Control</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter 4: Projects */}
        <motion.div style={{ opacity: opacityChapter4 }} className="absolute inset-0 flex items-center justify-center px-4 md:px-20">
          <div className="w-full max-w-5xl">
            <div className="flex items-center gap-3 mb-10 justify-center">
              <Zap className="text-[#00ffcc]" size={24} />
              <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-[0.2em]">Active Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "ISRO Robotics Challenge",
                  tech: "ROS2 / Pi 5 / Pixhawk",
                  desc: "Developing an autonomous drone for motor control and autonomous flight logic.",
                  color: "#00ffcc"
                },
                {
                  title: "Cold Plasma Effects",
                  tech: "Embedded C / Automation",
                  desc: "Leading software development for research into plasma-assisted agricultural growth. (Patent Pending)",
                  color: "#0066ff"
                },
                {
                  title: "Autonomous Delivery Robot",
                  tech: "SLAM / Custom PCB",
                  desc: "Industrial-grade robot with obstacle detection. Designed electronics architecture including custom PDB.",
                  color: "#ffffff"
                }
              ].map((project, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl border-t-2 transition-all hover:translate-y-[-5px]" style={{ borderColor: project.color }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50" style={{ color: project.color }}>Project {i+1}</div>
                  <h3 className="text-white font-bold text-xl mb-2 leading-tight">{project.title}</h3>
                  <div className="text-[10px] font-mono bg-white/5 inline-block px-2 py-1 rounded mb-4" style={{ color: project.color }}>{project.tech}</div>
                  <p className="text-xs text-gray-400 leading-relaxed">{project.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chapter 5: Achievements */}
        <motion.div style={{ opacity: opacityChapter5 }} className="absolute left-0 md:left-20 max-w-2xl px-4">
          <div className="flex items-center gap-3 mb-8">
            <Award className="text-[#0066ff]" size={30} />
            <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-widest">Recognition</h2>
          </div>
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-colors">
              <div className="absolute top-0 right-0 bg-[#00ffcc] text-black text-[10px] font-bold px-3 py-1">6th WORLDWIDE</div>
              <h3 className="text-xl font-bold text-[#00ffcc] mb-1 uppercase">NASA HERC 2026</h3>
              <p className="text-[10px] text-gray-500 mb-3 tracking-[0.2em]">FASTEST INDIAN TEAM (7:02)</p>
              <ul className="text-xs text-gray-300 space-y-1">
                <li className="flex items-center gap-2"><ChevronRight size={10} className="text-[#00ffcc]" /> Finalist in RC subdivision</li>
                <li className="flex items-center gap-2"><ChevronRight size={10} className="text-[#00ffcc]" /> Electrical Implementation Lead</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl border-l-2 border-l-[#0066ff]">
                <h4 className="text-sm font-bold text-white mb-1 uppercase">Caterpillar Autonomy</h4>
                <p className="text-[10px] text-gray-400">Semi-finalist @ IITM - Autonomous Navigation Specialist</p>
              </div>
              <div className="glass-panel p-4 rounded-xl border-l-2 border-l-[#ffffff]">
                <h4 className="text-sm font-bold text-white mb-1 uppercase">REVIVE 2024</h4>
                <p className="text-[10px] text-gray-400">Winner of National Level Hackathon</p>
              </div>
              <div className="glass-panel p-4 rounded-xl border-l-2 border-l-gray-600">
                <h4 className="text-sm font-bold text-white mb-1 uppercase">Innovate National</h4>
                <p className="text-[10px] text-gray-400">Secured 3rd Place</p>
              </div>
              <div className="glass-panel p-4 rounded-xl border-l-2 border-l-gray-600">
                <h4 className="text-sm font-bold text-white mb-1 uppercase">Project Expo</h4>
                <p className="text-[10px] text-gray-400">Finalist @ BITS Hyderabad</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter 6: Technical Matrix */}
        <motion.div style={{ opacity: opacityChapter6 }} className="absolute text-center max-w-5xl px-4 w-full">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,255,204,0.1)]">
            <h2 className="text-3xl md:text-5xl font-black mb-10 text-white uppercase tracking-[0.3em]">Technical Matrix</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-12">
              <div>
                <h3 className="text-[#00ffcc] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1 h-3 bg-[#00ffcc]" /> Systems & Robotics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['ROS2', 'SLAM', 'PID Control', 'Path Planning', 'CIM'].map(s => (
                    <span key={s} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[#0066ff] text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                   <div className="w-1 h-3 bg-[#0066ff]" /> Programming
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Embedded C', 'Python', 'C++', 'JAVA', 'React', 'SQL'].map(s => (
                    <span key={s} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                   <div className="w-1 h-3 bg-white" /> Hardware
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Raspberry Pi 5', 'Jetson Nano', 'ESP32', 'STM32', 'Arduino'].map(s => (
                    <span key={s} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                   <div className="w-1 h-3 bg-gray-400" /> Design
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['SolidWorks', 'Fusion 360', 'PCB Modeling', 'LTSpice'].map(s => (
                    <span key={s} className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/5">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <Languages className="text-[#0066ff]" size={20} />
                <div className="flex gap-4">
                  {['English', 'German', 'Tamil', 'Hindi'].map(lang => (
                    <span key={lang} className="text-xs text-gray-400 uppercase tracking-widest">{lang}</span>
                  ))}
                </div>
              </div>
              <div className="text-[10px] text-gray-600 uppercase tracking-[0.5em]">
                Version 2.0.26 // Optimized for deployment
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer / Scroll Indicator */}
      <footer className="text-center pb-4 pointer-events-auto flex justify-between items-end">
        <div className="hidden md:block text-[10px] text-gray-500 font-mono tracking-widest uppercase">
          Sys.Loc: <span className="text-[#00ffcc]">Sector 7G-VITC</span> <br/>
          Temporal: <span className="text-[#00ffcc]">2026.05.03</span>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="text-[8px] uppercase tracking-[0.3em] mb-2 opacity-50">Deep Scan</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#00ffcc] to-transparent"></div>
        </motion.div>

        <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase text-right">
          Lat: 12.8406° N <br/> Lon: 80.1534° E <br/>
          <span className="text-[#0066ff]">Link Established</span>
        </div>
      </footer>
    </div>
  );
}
