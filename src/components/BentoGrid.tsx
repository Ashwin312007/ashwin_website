"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Award,
  Cpu,
  GraduationCap,
  Globe,
  ExternalLink,
  Zap,
  Bot,
  ArrowRight,
  Users
} from "lucide-react";
import { ProjectData } from "@/types";

interface BentoItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  tags?: string[];
  className?: string;
  link?: string;
  footer?: string;
  onDeepDive?: () => void;
}

const BentoItem = ({
  title,
  subtitle,
  description,
  icon,
  tags,
  className,
  link,
  footer,
  onDeepDive
}: BentoItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const fadeInConfig = {
    duration: 0.6,
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={fadeInConfig}
      className={`glass-card p-8 rounded-3xl flex flex-col justify-between ${className} relative group overflow-hidden border border-white/5 hover:border-[#00a3ff]/50 transition-colors duration-300`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00a3ff]/0 via-transparent to-[#00a3ff]/0 group-hover:from-[#00a3ff]/5 group-hover:to-[#00a3ff]/10 transition-all duration-300" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white group-hover:text-[#00a3ff] group-hover:border-[#00a3ff]/30 transition-all duration-300">
            {icon}
          </div>
          {link && !onDeepDive && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#00a3ff] transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
        <div className="mb-2 text-xs font-bold tracking-[0.2em] text-[#00a3ff]/80 uppercase caption">{subtitle}</div>
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-blue-300 transition-colors">{title}</h3>
        {description && <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>}
        {tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/5 border border-white/10 group-hover:border-[#00a3ff]/30 rounded-full text-[10px] font-medium text-gray-300 cursor-default transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {onDeepDive && (
          <button
            onClick={onDeepDive}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-[#00a3ff] hover:text-white transition-colors"
          >
            Deep Dive Spec <ArrowRight size={16} />
          </button>
        )}
      </div>
      {footer && <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-gray-500 font-bold tracking-widest uppercase caption relative z-10">{footer}</div>}
    </motion.div>
  );
};

interface SkillItem {
  name: string;
  level: number;
  category: string;
}

const ALL_SKILLS: SkillItem[] = [
  { name: "ROS2", level: 95, category: "ROBOTICS & ROS" },
  { name: "SLAM", level: 85, category: "ROBOTICS & ROS" },
  { name: "Kinematics & Control Systems", level: 80, category: "ROBOTICS & ROS" },
  
  { name: "Embedded C/C++", level: 95, category: "EMBEDDED & FIRMWARE" },
  { name: "ESP32 / STM32", level: 95, category: "EMBEDDED & FIRMWARE" },
  { name: "RTOS", level: 90, category: "EMBEDDED & FIRMWARE" },

  { name: "Python", level: 90, category: "AI & VISION" },
  { name: "OpenCV & Computer Vision", level: 60, category: "AI & VISION" },
  { name: "TensorFlow / PyTorch", level: 60, category: "AI & VISION" },

  { name: "CAD / Fusion 360", level: 80, category: "HARDWARE & CAD" },
  { name: "PCB Design & PDB Architecture", level: 90, category: "HARDWARE & CAD" },
  { name: "Manufacturing (DFM & VMC)", level: 85, category: "HARDWARE & CAD" }
];

const SKILL_CATEGORIES = ["ALL", "ROBOTICS & ROS", "EMBEDDED & FIRMWARE", "AI & VISION", "HARDWARE & CAD"];

const SkillBar = ({ name, level }: { name: string; level: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="group cursor-default">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-white font-medium group-hover:text-[#00a3ff] transition-colors">{name}</span>
        <span className="text-blue-500/80">{level}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-300 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: "agri-sorter",
    title: "Agri-Sorter",
    category: "Agri-Tech / Patent",
    status: "Patent Pending",
    description: "Automated computer vision and mechatronic sorting system for high-throughput agricultural classification.",
    highlights: ["Filed patent for automated sorting system", "Integrated CV with mechanical sorting mechanisms", "Optimized for high-throughput environments"],
    stack: ["Patent", "Computer Vision", "Mechatronics", "Automation"],
    links: []
  },
  {
    id: "air-puff-tonometer",
    title: "Portable Air-Puff Tonometer",
    category: "Medical Devices / Patent",
    status: "Patent Pending",
    description: "Non-contact intraocular pressure measurement medical device utilizing micro-pneumatics and embedded sensing.",
    highlights: ["Filed patent for non-contact medical device", "Micro-pneumatic systems design", "Embedded sensing architecture"],
    stack: ["Patent", "Medical Devices", "Embedded Systems", "Micro-Pneumatics"],
    links: []
  },
  {
    id: "isro-drone",
    title: "ISRO Robotics Challenge",
    category: "Autonomous Systems",
    status: "Completed",
    description: "Autonomous drone using ROS2, Raspberry Pi, and Pixhawk.",
    highlights: ["Integrated Pixhawk flight controller with ROS2", "Developed custom motor logic", "Implemented autonomous navigation algorithms"],
    stack: ["ROS2", "Python", "C++", "Pixhawk", "Raspberry Pi"],
    links: [{ label: "Repository", url: "https://github.com/Ashwin312007" }]
  },
  {
    id: "delivery-robot",
    title: "Autonomous Delivery Robot",
    category: "Logistics",
    status: "Active Development",
    description: "Industrial-grade SLAM robot with custom PCB/PDB architecture.",
    highlights: ["Custom PCB/PDB architecture for power management", "Integrated LiDAR for SLAM navigation", "Embedded C++ for core logic"],
    stack: ["SLAM", "PCB Design", "Navigation", "Embedded C++", "Altium"],
    links: [{ label: "Project Spec", url: "#" }]
  },
  {
    id: "nasa-herc",
    title: "NASA HERC Autonomous Rover",
    category: "Space Tech",
    status: "6th Place Global",
    description: "NASA HERC: 6th Place Global / Best Indian Team (Advisory Board & Electrical/Software architecture).",
    highlights: ["Engineered robust power distribution system", "Developed complex motor control logic", "Achieved 6th place globally and Best Indian Team"],
    stack: ["Motor Control", "Power Electronics", "Embedded Systems", "C/C++"],
    links: [{ label: "View Rover", url: "#" }]
  }
];

export const BentoGrid = ({ onProjectSelect }: { onProjectSelect?: (project: ProjectData) => void }) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("ALL");

  const filteredSkills = activeCategory === "ALL" 
    ? ALL_SKILLS 
    : ALL_SKILLS.filter(s => s.category === activeCategory);

  return (
    <section className="section-padding max-w-7xl mx-auto px-6 relative z-10">
      {/* Experience Section */}
      <div id="experience" className="mb-24 pt-20">
        <h2 className="heading-1 silver-gradient-text mb-12 tracking-tighter">
          Experience
        </h2>
        <div className="bento-grid">
          <BentoItem
            className="md:col-span-2 clip-reveal"
            icon={<Briefcase size={24} />}
            subtitle="Secretary | 2024 - Present"
            title="AutoVIT Club"
            description="Leading initiatives and orchestrating team collaborations on advanced robotics and automation systems."
            footer="VIT Chennai"
          />
          <BentoItem
            className="md:col-span-2 clip-reveal"
            icon={<Bot size={24} />}
            subtitle="Advisory Board Member"
            title="Team MOVIS"
            description="Advising the electrical and software implementation for NASA HERC competition, focusing on autonomous rover systems."
            footer="Space Tech"
          />
          <BentoItem
            className="md:col-span-2 clip-reveal"
            icon={<Briefcase size={24} />}
            subtitle="Embedded System Design Intern"
            title="MEL Systems and Services"
            description="Embedded system design internship working on their hardware/IoT product Pick2Lite, developing embedded logic and electronic system architecture."
            footer="Chennai, India"
          />
          <BentoItem
            className="md:col-span-2 clip-reveal"
            icon={<Briefcase size={24} />}
            subtitle="Engineering Intern | May 2026 – June 2026"
            title="Salcomp Manufacturing"
            description="CAD modeling, Design for Manufacturability (DFM) principles, and operational hands-on experience with VMC (Vertical Machining Center)."
            footer="Chennai, India"
          />
        </div>
      </div>

      <div className="section-divider" />

      {/* Projects Section */}
      <div id="projects" className="mb-24 pt-20">
        <h2 className="heading-1 silver-gradient-text mb-12 tracking-tighter">
          Key Projects & Patents
        </h2>
        <div className="bento-grid">
          {PROJECTS_DATA.map((project, idx) => (
            <BentoItem
              key={project.id}
              className="md:col-span-2 clip-reveal"
              icon={idx < 2 ? <Award size={24} /> : <Cpu size={24} />}
              subtitle={project.category}
              title={project.title}
              description={project.description}
              tags={project.stack}
              onDeepDive={() => onProjectSelect && onProjectSelect(project)}
            />
          ))}
        </div>
      </div>

      <div className="section-divider" />

      {/* Achievements Section */}
      <div id="achievements" className="mt-24 pt-20">
        <h2 className="heading-1 silver-gradient-text mb-8 tracking-tighter">
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BentoItem
            className="clip-reveal"
            icon={<Award size={24} />}
            subtitle="NASA HERC 2026"
            title="6th Place Global"
            description="Best Indian Team | 7:02 Fastest Run"
          />
          <BentoItem
            className="clip-reveal"
            icon={<Award size={24} />}
            subtitle="Innovate Hackathon"
            title="3rd Place National"
            description="National Level Hackathon Victory"
          />
          <BentoItem
            className="clip-reveal"
            icon={<Award size={24} />}
            subtitle="REVIVE 2024"
            title="Hackathon Winner"
            description="National Level Victory"
          />
          <BentoItem
            className="clip-reveal"
            icon={<Award size={24} />}
            subtitle="BITS Hyderabad Techfest"
            title="Techfest Finalist"
            description="Demonstrated advanced technical competence."
          />
          <BentoItem
            className="clip-reveal md:col-span-2 lg:col-span-2"
            icon={<Award size={24} />}
            subtitle="IIT Madras Caterpillar Challenge"
            title="Autonomy Semi-Finalist"
            description="Showcased robust autonomous engineering solutions."
          />
        </div>
      </div>

      <div className="section-divider" />

      {/* Skills Matrix */}
      <div id="skills" className="mt-24 pt-20">
        <h2 className="heading-1 silver-gradient-text mb-8 tracking-tighter">
          Technical Matrix
        </h2>
        <div className="glass-card p-8 md:p-12 rounded-[3rem] border border-white/5">
          {/* Interactive Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 border-b border-white/5 pb-6">
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-blue-500/20 text-[#00a3ff] border border-blue-500/30" 
                    : "bg-white/5 text-gray-400 border border-transparent hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skills List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {filteredSkills.map((skill, index) => (
              <div key={skill.name}>
                <SkillBar name={skill.name} level={skill.level} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Leadership & Special Teams */}
      <div id="leadership" className="mt-24 pt-20">
        <h2 className="heading-1 silver-gradient-text mb-8 tracking-tighter">
          Leadership & Special Teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BentoItem
            icon={<Users size={24} />}
            subtitle="AutoVIT Club"
            title="Secretary"
            description="Leading administrative and operational functions, guiding the team toward successful execution of mechatronics projects."
          />
          <BentoItem
            icon={<Users size={24} />}
            subtitle="Team MOVIS (NASA HERC)"
            title="Advisory Board Member"
            description="Advising the team on strategic engineering decisions, specifically in software and electrical architecture for the NASA HERC."
          />
          <BentoItem
            icon={<Users size={24} />}
            subtitle="VIT Chennai OSP Club"
            title="Former R&D Lead"
            description="Led research and development efforts, mentoring members in embedded systems and robotics development."
          />
          <BentoItem
            icon={<Users size={24} />}
            subtitle="Team MOVIS"
            title="Programming Lead & HERC Point of Contact (In-charge)"
            description="Previously led programming efforts and served as the point of contact for the NASA HERC competition."
          />
          <BentoItem
            icon={<Users size={24} />}
            subtitle="ATAL Tinkering Lab (Govt. of India Initiative)"
            title="Student In-Charge"
            description="Represented school for the NITI Aayog ATAL Tinkering Lab initiative, leading student innovation projects and hands-on STEM engineering workshops."
          />
          <BentoItem
            icon={<Users size={24} />}
            subtitle="Empower Tech National Hackathon"
            title="Hackathon Judge"
            description="Served as a judge for the Empower Tech national level hackathon, evaluating software architecture, mechatronics prototypes, and student engineering innovations."
          />
        </div>
      </div>

      {/* Education */}
      <div id="education" className="mt-24 pt-20">
        <div className="glass-card p-8 md:p-12 rounded-[3rem] text-center max-w-4xl mx-auto border border-white/5 relative overflow-hidden group">
          <GraduationCap className="mx-auto mb-6 text-blue-500/50 group-hover:text-[#00a3ff] transition-colors duration-500" size={48} />
          <h2 className="heading-2 text-white mb-8">Education</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-widest text-[#00a3ff] mb-1">Higher Education</div>
              <h3 className="text-lg font-bold text-white mb-1">B.Tech in Mechatronics & Automation</h3>
              <p className="text-sm text-gray-400 mb-2">Vellore Institute of Technology (VIT), Chennai</p>
              <span className="text-xs px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-[#00a3ff] rounded-full inline-block font-semibold">2024 – Present</span>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-widest text-[#00a3ff] mb-1">Schooling</div>
              <h3 className="text-lg font-bold text-white mb-1">Higher Secondary Education</h3>
              <p className="text-sm text-gray-400 mb-2">SBOA Matriculation and Higher Secondary School, Chennai</p>
              <span className="text-xs px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full inline-block font-semibold">Graduated: 91% Grade</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16 border-t border-white/5 pt-8">
             <div className="text-center">
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Languages</div>
               <div className="text-sm font-medium text-white flex flex-wrap justify-center gap-2">
                 <span className="px-3 py-1 bg-white/5 rounded-full">English</span>
                 <span className="px-3 py-1 bg-white/5 rounded-full">German</span>
                 <span className="px-3 py-1 bg-white/5 rounded-full">Hindi</span>
                 <span className="px-3 py-1 bg-white/5 rounded-full">Tamil</span>
               </div>
             </div>
             <div className="text-center">
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Location</div>
               <div className="text-sm font-medium text-white bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full inline-block">Chennai, India</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};