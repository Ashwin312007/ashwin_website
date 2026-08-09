"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch, Box, Cpu, Code } from "lucide-react";
import { ProjectData } from "@/types";

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[60] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/10 bg-black/80 shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-start p-6 border-b border-white/10 bg-black/50 backdrop-blur-lg">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-[#00a3ff] uppercase border border-blue-500/30 rounded-full bg-blue-500/10">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-green-400 uppercase border border-green-500/30 rounded-full bg-green-500/10">
                    {project.status}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">{project.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Project Overview</h3>
                <p className="text-gray-300 leading-relaxed">{project.description}</p>
              </div>

              {/* Grid for Highlights and Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Engineering Highlights */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Box size={16} /> Key Engineering Specs
                  </h3>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <span className="text-[#00a3ff] mt-1">▹</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Cpu size={16} /> Hardware & Software Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 flex items-center gap-2"
                      >
                        <Code size={14} className="text-[#00a3ff]" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Links */}
              {project.links && project.links.length > 0 && (
                <div className="pt-8 border-t border-white/10 flex flex-wrap gap-4">
                  {project.links.map((link, idx) => {
                    const isGithub = link.url.includes("github.com");
                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,200,255,0.2)]"
                      >
                        {isGithub ? <GitBranch size={18} /> : <ExternalLink size={18} />}
                        <span className="font-medium">{link.label}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
