import { Experience } from "@/components/Experience";
import { HUD } from "@/components/HUD";

export default function Home() {
  return (
    <div className="relative bg-black w-full min-h-screen text-white overflow-hidden">
      {/* Fixed 3D Background */}
      <Experience />
      
      {/* Fixed HUD Overlay */}
      <HUD />
      
      {/* Scrollable Container to drive GSAP & Framer Motion */}
      {/* Increased height to 800vh to accommodate more sections: Intro, Experience, Projects, Achievements, Skills, Contact */}
      <div id="scroll-container" className="relative w-full h-[800vh] z-20 pointer-events-none">
        {/* Invisible sections to give scroll context */}
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
      </div>
    </div>
  );
}
