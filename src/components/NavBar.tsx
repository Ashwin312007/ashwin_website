"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, GitBranch, Terminal } from "lucide-react";

const LinkedInIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
  ];

  const springConfig = {
    type: "spring" as const,
    damping: 20,
    stiffness: 100,
    duration: 0.4,
  };

  const fastSpring = {
    type: "spring" as const,
    damping: 15,
    stiffness: 200,
    duration: 0.25,
  };

  const openTerminal = () => {
    window.dispatchEvent(new Event("open-terminal"));
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 flex flex-col ${
          isScrolled
            ? "bg-black/80 backdrop-blur-[20px] border-b border-[#00a3ff]/30 shadow-[0_4px_30px_rgba(0,163,255,0.1)]"
            : "bg-transparent"
        }`}
      >
        {/* Top Telemetry Ticker Banner */}
        

        <div className={`max-w-7xl mx-auto px-6 w-full flex justify-between items-center transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={shouldReduceMotion ? { duration: 0.3 } : springConfig}
            className="text-xl font-bold tracking-tighter text-white flex items-center gap-2"
          >
            <span>ASHWIN T E</span>
            <span className="text-[#00a3ff] font-mono text-sm tracking-widest hidden sm:inline-block">
              // ENGINEER
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springConfig, delay: index * 0.05 }}
                whileHover={{ color: "#00a3ff", y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="text-sm font-mono font-medium text-gray-400 transition-colors uppercase tracking-widest"
              >
                {link.name}
              </motion.a>
            ))}
            <div className="h-4 w-[1px] bg-white/20 mx-2" />
            <div className="flex items-center gap-4">
              <motion.button
                onClick={openTerminal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold text-[#00a3ff] border border-[#00a3ff]/50 rounded hover:bg-[#00a3ff]/10 hover:shadow-[0_0_15px_rgba(0,163,255,0.3)] transition-all"
              >
                <Terminal size={14} />
                TERMINAL CLI
              </motion.button>
              <motion.a
                href="https://github.com/Ashwin312007"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={fastSpring}
                className="text-gray-400 hover:text-[#00a3ff] transition-colors duration-300"
              >
                <GitBranch size={18} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/ashwin-t-e-410655240/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={fastSpring}
                className="text-gray-400 hover:text-[#00a3ff] transition-colors duration-300"
              >
                <LinkedInIcon size={18} />
              </motion.a>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden text-white hover:text-[#00a3ff] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={fastSpring}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden bg-black/95 backdrop-blur-[20px] border-b border-[#00a3ff]/30 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 font-mono">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    transition={{ ...springConfig, delay: index * 0.06 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-400 hover:text-[#00a3ff] uppercase tracking-wider"
                  >
                    {link.name}
                  </motion.a>
                ))}
                
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springConfig, delay: navLinks.length * 0.06 }}
                  className="pt-4 border-t border-[#00a3ff]/20"
                >
                  <button
                    onClick={openTerminal}
                    className="w-full flex justify-center items-center gap-2 px-4 py-3 mb-6 text-sm font-bold text-black bg-[#00a3ff] hover:bg-[#00a3ff]/80 hover:shadow-[0_0_20px_rgba(0,163,255,0.4)] rounded transition-all"
                  >
                    <Terminal size={18} />
                    LAUNCH TERMINAL
                  </button>
                  
                  <div className="flex justify-center gap-8">
                    <motion.a
                      href="https://github.com/Ashwin312007"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={fastSpring}
                      className="text-gray-400 hover:text-[#00a3ff]"
                    >
                      <GitBranch size={24} />
                    </motion.a>
                    <motion.a
                      href="https://www.linkedin.com/in/ashwin-t-e-410655240/"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={fastSpring}
                      className="text-gray-400 hover:text-[#00a3ff]"
                    >
                      <LinkedInIcon size={24} />
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};