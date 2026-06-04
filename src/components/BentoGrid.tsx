"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Award, 
  Cpu, 
  GraduationCap, 
  Globe, 
  ExternalLink,
  Zap,
  Bot
} from "lucide-react";

interface BentoItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  tags?: string[];
  className?: string;
  link?: string;
  footer?: string;
}

const BentoItem = ({ title, subtitle, description, icon, tags, className, link, footer }: BentoItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`glass-card p-8 rounded-3xl flex flex-col justify-between ${className}`}
  >
    <div>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-2xl silver-border text-white">
          {icon}
        </div>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
            <ExternalLink size={18} />
          </a>
        )}
      </div>
      <div className="mb-2 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">{subtitle}</div>
      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      {description && <p className="text-gray-400 text-sm leading-relaxed mb-6">{description}</p>}
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white/5 silver-border rounded-full text-[10px] text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
    {footer && <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-gray-500 font-bold tracking-widest uppercase">{footer}</div>}
  </motion.div>
);

interface SkillGroup {
  category: string;
  skills: { name: string; level: number }[];
}

const skillGroups: SkillGroup[] = [
  { category: "Robotics", skills: [
    { name: "ROS2", level: 90 },
    { name: "SLAM", level: 85 },
    { name: "Control Systems", level: 80 }
  ]},
  { category: "Design", skills: [
    { name: "CAD / Fusion 360", level: 85 },
    { name: "PCB Modeling", level: 75 }
  ]},
  { category: "Coding", skills: [
    { name: "Embedded C/C++", level: 90 },
    { name: "Python", level: 85 },
    { name: "Java", level: 70 }
  ]},
  { category: "Hardware", skills: [
    { name: "ESP32 / STM32", level: 90 },
    { name: "Jetson Nano", level: 75 }
  ]}
];

export const BentoGrid = () => {
  return (
    <section className="section-padding max-w-7xl mx-auto px-6">
      
      {/* Experience Section */}
      <div id="experience" className="mb-24">
        <h2 className="text-3xl md:text-5xl font-bold silver-gradient-text mb-12 tracking-tighter">Experience</h2>
        <div className="bento-grid">
          <BentoItem
            className="md:col-span-2"
            icon={<Briefcase size={24} />}
            subtitle="R&D Lead | 2025 – Present"
            title="VIT Chennai OSP Club"
            description="Leading research initiatives and achieving impressive outcomes through efficient project management. Orchestrating team collaborations on advanced robotics and automation systems."
            footer="VIT Chennai"
          />
          <BentoItem
            className="md:col-span-2"
            icon={<Briefcase size={24} />}
            subtitle="Intern | May 2025 – June 2025"
            title="MEL Systems and Services"
            description="Professional internship focusing on high-performance electronic systems and hardware manufacturing services."
            footer="Chennai, India"
          />
          <BentoItem
            className="md:col-span-2"
            icon={<Bot size={24} />}
            subtitle="Programming Lead"
            title="Team MOVIS"
            description="Leading the electrical and software implementation for NASA HERC competition, focusing on autonomous rover systems."
            footer="Space Tech"
          />
        </div>
      </div>

      <div className="section-divider" />

      {/* Projects Section */}
      <div id="projects" className="mb-24">
        <h2 className="text-3xl md:text-5xl font-bold silver-gradient-text mb-12 tracking-tighter">Key Projects</h2>
        <div className="bento-grid">
          <BentoItem
            className="md:col-span-2"
            icon={<Cpu size={24} />}
            subtitle="Autonomous Systems"
            title="ISRO Robotics Challenge"
            description="Autonomous drone using ROS2, Raspberry Pi, and Pixhawk. Logic for flight & motor control."
            tags={["ROS2", "Python", "Pixhawk", "Raspberry Pi"]}
          />
          <BentoItem
            className="md:col-span-2"
            icon={<Zap size={24} />}
            subtitle="Agri-Tech"
            title="Cold Plasma Research"
            description="Patent Pending. Leading software & automation for plasma-assisted agricultural growth systems."
            tags={["Automation", "Electronics", "R&D"]}
          />
          <BentoItem
            className="md:col-span-4"
            icon={<Globe size={24} />}
            subtitle="Logistics"
            title="Autonomous Delivery Robot"
            description="Industrial-grade robot with SLAM & obstacle detection. Custom PCB/PDB architecture for robust power delivery and signal integrity."
            tags={["SLAM", "PCB Design", "Navigation", "Embedded C++"]}
          />
        </div>
      </div>

      <div className="section-divider" />

      {/* Achievements & Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="achievements" className="lg:col-span-2">
          <h2 className="text-3xl font-bold silver-gradient-text mb-8 tracking-tighter">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BentoItem
              icon={<Award size={20} />}
              subtitle="NASA HERC 2026"
              title="6th Place Global"
              description="Best Indian Team. Fastest Team (7:02). Handled electrical implementation."
            />
            <BentoItem
              icon={<Award size={20} />}
              subtitle="Hackathon"
              title="REVIVE 2024 Winner"
              description="National Level Hackathon victory for innovative engineering solution."
            />
          </div>
        </div>

        <div id="skills">
          <h2 className="text-3xl font-bold silver-gradient-text mb-8 tracking-tighter">Technical Matrix</h2>
          <div className="glass-card p-8 rounded-3xl h-full">
            <div className="space-y-6">
              {skillGroups.map((group) => (
                <div key={group.category}>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{group.category}</div>
                  <div className="space-y-2">
                    {group.skills.map(skill => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white font-medium">{skill.name}</span>
                          <span className="text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="skill-bar-track">
                          <motion.div
                            className="skill-bar-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="mt-24">
        <div className="glass-card p-12 rounded-[3rem] text-center max-w-4xl mx-auto">
          <GraduationCap className="mx-auto mb-6 text-gray-400" size={48} />
          <h2 className="text-3xl font-bold text-white mb-4">Education Protocols</h2>
          <h3 className="text-xl silver-gradient-text font-bold mb-2">B.Tech in Mechatronics and Automation</h3>
          <p className="text-gray-400 mb-8">Vellore Institute of Technology (VIT), Chennai | 2024 – Present</p>
          <div className="flex justify-center gap-12 border-t border-white/5 pt-8">
             <div>
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Languages</div>
               <div className="text-white text-sm">English, German, Hindi, Tamil</div>
             </div>
             <div>
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Location</div>
               <div className="text-white text-sm">Chennai, India</div>
             </div>
          </div>
        </div>
      </div>

    </section>
  );
};
