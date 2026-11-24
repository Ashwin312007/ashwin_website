import { Hero } from "@/components/sections/Hero";
import { Dive } from "@/components/sections/Dive";
import { Approach } from "@/components/sections/Approach";
import { Capabilities } from "@/components/sections/Capabilities";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Research } from "@/components/sections/Research";
import { About } from "@/components/sections/About";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Dive />
      <Approach />
      <Capabilities />
      <Work />
      <Experience />
      <Research />
      <About />
      <Footer />
    </>
  );
}
