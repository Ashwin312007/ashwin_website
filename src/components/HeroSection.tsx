"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as const } }
};

export const HeroSection = () => {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl"
      >
        <motion.span
          variants={itemVariants}
          className="text-sm font-medium tracking-[0.3em] text-gray-400 uppercase mb-4 block"
        >
          Mechatronics &amp; Automation Engineer
        </motion.span>
        
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-8xl font-bold tracking-tighter silver-gradient-text mb-8 leading-[1.1]"
        >
          Building the Future of <br />
          <span className="text-white">Autonomous Systems</span>
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Eager Embedded System Developer passionate about expanding expertise in 
          electronics and autonomous robotics. Currently leading R&amp;D at VIT Chennai OSP Club.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
          >
            View Projects
          </a>
          <a
            href="#experience"
            className="px-8 py-3 silver-border text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
          >
            My Experience
          </a>
          <a
            href="/Ashwin_TE_Resume.pdf"
            download
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full hover:shadow-[0_0_30px_rgba(0,200,255,0.3)] transition-all duration-300 flex items-center gap-2"
          >
            <Download size={16} />
            Resume
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-10"
      >
        <ArrowDown className="text-gray-500" size={24} />
      </motion.div>
    </section>
  );
};
