"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, Mail, Terminal, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(false);

  const buttonSpring = {
    type: "spring" as const,
    damping: 15,
    stiffness: 200,
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const },
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  };

  const staggerDelay = (index: number) => ({
    transition: { delay: index * 0.1 },
  });

  const cards = [
    {
      id: "01",
      title: "AutoVIT Club",
      subtitle: "Secretary & Engineering Lead",
      content: "Spearheading technical workshops, autonomous vehicle research, and engineering operations for student builders.",
      specs: ["Leadership", "ROS2", "SLAM", "Autonomous Systems"]
    },
    {
      id: "02",
      title: "Team MOVIS - NASA HERC",
      subtitle: "Advisory Board Member",
      content: "Advising multi-disciplinary engineering teams on telemetry, electrical systems, and autonomous vehicle strategy.",
      specs: ["Advisory", "NASA HERC", "Telemetry", "Strategy"]
    },
    {
      id: "03",
      title: "VIT Chennai OSP Club",
      subtitle: "Former R&D Lead",
      content: "Led research and development initiatives, open-source software projects, and technical skill-building workshops.",
      specs: ["R&D Lead", "Open Source", "Software Architecture", "Prototyping"]
    },
    {
      id: "04",
      title: "Team MOVIS",
      subtitle: "Programming Lead & HERC Point of Contact",
      content: "Directed software development, telemetry pipeline, and sensor integration while serving as official Point of Contact for NASA HERC.",
      specs: ["Programming Lead", "HERC POC", "Telemetry", "Embedded C++"]
    },
    {
      id: "05",
      title: "ATAL Tinkering Lab",
      subtitle: "Govt. of India Initiative (Student In-Charge)",
      content: "Managed lab operations, mentored junior students in electronics & robotics, and fostered hands-on hardware innovation.",
      specs: ["Lab Management", "Robotics", "Mentorship", "Govt. Initiative"]
    },
    {
      id: "06",
      title: "Empower Tech National Hackathon",
      subtitle: "Hackathon Judge",
      content: "Evaluated innovative hardware and software solutions, providing technical mentorship and scoring project feasibility.",
      specs: ["Hackathon Judge", "Technical Evaluation", "Mentorship", "Innovation"]
    }
  ];

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveTab((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveTab((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 60 : -60,
      opacity: 0,
    }),
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00a3ff]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Typography & Info */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0.3 } : { staggerChildren: 0.1, delayChildren: 0.2 }}
          className="flex flex-col items-start text-left"
        >
          <motion.div
            {...(shouldReduceMotion ? fadeIn : fadeInUp)}
            {...staggerDelay(0)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-mono tracking-wider mb-8 uppercase"
          >
            <MapPin size={14} className="text-[#00a3ff]" />
            <span>CHENNAI, INDIA</span>
            <span className="opacity-50">•</span>
            <span className="text-white font-semibold">SECRETARY @ AUTOVIT</span>
          </motion.div>

          <motion.h1
            {...(shouldReduceMotion ? fadeIn : fadeInUp)}
            {...staggerDelay(1)}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 leading-[0.9] text-white"
          >
            Ashwin T E
          </motion.h1>
          
          <motion.h2
            {...(shouldReduceMotion ? fadeIn : fadeInUp)}
            {...staggerDelay(2)}
            className="text-xl md:text-2xl text-[#00a3ff] font-medium tracking-tight mb-6"
          >
            Mechatronics Engineer & Autonomous Systems Lead
          </motion.h2>

          <motion.p
            {...(shouldReduceMotion ? fadeIn : fadeInUp)}
            {...staggerDelay(3)}
            className="text-base md:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed font-normal"
          >
            Award-winning innovator specializing in ROS2, SLAM, and Embedded C/C++. Led <strong className="text-gray-200 font-medium">NASA HERC (6th Place Global)</strong>, developed the <strong className="text-gray-200 font-medium">Agri-Sorter</strong> & <strong className="text-gray-200 font-medium">Air-Puff Tonometer</strong> (Patents Pending), and currently serving as Secretary at <strong className="text-gray-200 font-medium">AutoVIT Club</strong>. Building high-performance hardware and intelligent autonomy.
          </motion.p>

          <motion.div
            {...(shouldReduceMotion ? fadeIn : fadeInUp)}
            {...staggerDelay(4)}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#projects"
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={buttonSpring}
            >
              Explore Work <ArrowRight size={16} />
            </motion.a>
            
            <motion.a
              href="#projects"
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-white border border-white/20 rounded-full hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={buttonSpring}
            >
              View Patents
            </motion.a>

            <motion.a
              href="mailto:teashwin3@gmail.com"
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-[#00a3ff] bg-[#00a3ff]/10 border border-[#00a3ff]/30 rounded-full hover:bg-[#00a3ff]/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={buttonSpring}
            >
              <Mail size={16} /> Email Me
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right Column: Featured Telemetry / Patent Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-w-[500px] mx-auto lg:ml-auto"
        >
          <div 
            className="glass-card w-full h-full p-8 flex flex-col justify-between group relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Background ID Number with smooth opacity fade */}
            <AnimatePresence>
              <motion.div
                key={cards[activeTab].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-4 right-6 text-[120px] font-bold font-mono text-white/5 pointer-events-none select-none z-0 leading-none"
              >
                {cards[activeTab].id}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-start mb-8 z-10 relative">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center relative z-10 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="mb-8"
                >
                  <h3 className="text-3xl font-bold text-white mb-2">{cards[activeTab].title}</h3>
                  <h4 className="text-[#00a3ff] font-medium mb-4 text-sm tracking-wider uppercase">{cards[activeTab].subtitle}</h4>
                  <p className="text-gray-400 text-sm mb-6 max-w-sm leading-relaxed">{cards[activeTab].content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {cards[activeTab].specs.map((spec, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-md text-gray-300">
                        {spec}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-auto z-10 relative">
              <div className="flex gap-2 items-center">
                {cards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === activeTab) return;
                      setDirection(idx > activeTab ? 1 : -1);
                      setActiveTab(idx);
                    }}
                    className={`h-1.5 transition-all rounded-full ${
                      activeTab === idx ? "w-8 bg-[#00a3ff]" : "w-4 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`View ${card.title}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Previous card"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Next card"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};