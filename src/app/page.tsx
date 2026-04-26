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
      {/* We need enough height to scroll through the 5 chapters. Let's make it 500vh */}
      <div id="scroll-container" className="relative w-full h-[500vh] z-20 pointer-events-none">
        {/* Invisible sections to give scroll context if needed, though heights dictate scroll length */}
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
        <section className="h-[100vh] w-full" />
      </div>
    </div>
  );
}
