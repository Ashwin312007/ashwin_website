"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Grain } from "@/components/motion/Grain";
import { TopHUD } from "@/components/motion/TopHUD";
import { Hero } from "@/components/motion/Hero";
import { ResearchInterests } from "@/components/motion/ResearchInterests";
import { ProjectShowcase } from "@/components/motion/ProjectShowcase";
import { HowIWork } from "@/components/motion/HowIWork";
import { Capabilities } from "@/components/motion/Capabilities";
import { Contact } from "@/components/motion/Contact";
import { Footer } from "@/components/motion/Footer";
import { CyberTerminal } from "@/components/motion/CyberTerminal";

const KineticStage = dynamic(
  () =>
    import("@/components/canvas/KineticStage").then((m) => m.KineticStage),
  { ssr: false }
);

export default function Page() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-white/20 focus:bg-[#08080A] focus:px-4 focus:py-2 focus:text-xs focus:font-mono focus:text-[#9bc1ff] focus:outline-none focus:ring-2 focus:ring-[#9bc1ff]"
      >
        Skip to main content
      </a>
      <main id="main-content" className="relative min-h-screen bg-[#08080A] text-[#edf2fa]">
        <Grain />
        <KineticStage />
        <TopHUD />
        <Hero />
        <ResearchInterests />
        <ProjectShowcase />
        <HowIWork />
        <Capabilities />
        <Contact />
        <Footer />
        <CyberTerminal />
      </main>
    </>
  );
}